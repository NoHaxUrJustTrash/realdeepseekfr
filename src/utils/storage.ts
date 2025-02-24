import { supabase } from './supabase';
import { Chat, Message, Settings, ChatStats } from '../types';

const SETTINGS_KEY = 'ai_settings';

export const saveChats = async (chats: Chat[]) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  for (const chat of chats) {
    // Update or insert chat
    const { error: chatError } = await supabase
      .from('chats')
      .upsert({
        id: chat.id,
        user_id: user.id,
        title: chat.title,
        last_updated: chat.lastUpdated.toISOString(),
      });

    if (chatError) {
      console.error('Error saving chat:', chatError);
      continue;
    }

    // Get existing messages for this chat
    const { data: existingMessages } = await supabase
      .from('messages')
      .select('id')
      .eq('chat_id', chat.id);

    const existingIds = new Set(existingMessages?.map(m => m.id) || []);

    // Update or insert messages
    for (const message of chat.messages) {
      const messageId = message.id || crypto.randomUUID();
      const { error: messageError } = await supabase
        .from('messages')
        .upsert({
          id: messageId,
          chat_id: chat.id,
          role: message.role,
          content: message.content,
          thinking: message.thinking,
          thinking_time: message.thinkingTime,
          timestamp: message.timestamp.toISOString(),
        });

      if (messageError) {
        console.error('Error saving message:', messageError);
      }
      
      if (existingIds.has(messageId)) {
        existingIds.delete(messageId);
      }
    }

    // Delete any messages that no longer exist in the chat
    if (existingIds.size > 0) {
      const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .in('id', Array.from(existingIds));

      if (deleteError) {
        console.error('Error deleting old messages:', deleteError);
      }
    }
  }
};

export const loadChats = async (): Promise<Chat[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: chats, error: chatsError } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', user.id)
    .order('last_updated', { ascending: false });

  if (chatsError) {
    console.error('Error loading chats:', chatsError);
    return [];
  }

  const fullChats: Chat[] = [];

  for (const chat of chats) {
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chat.id)
      .order('timestamp', { ascending: true });

    if (messagesError) {
      console.error('Error loading messages:', messagesError);
      continue;
    }

    fullChats.push({
      id: chat.id,
      title: chat.title,
      messages: messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        thinking: msg.thinking,
        thinkingTime: msg.thinking_time,
      })),
      lastUpdated: new Date(chat.last_updated),
      userId: chat.user_id,
    });
  }

  return fullChats;
};

export const saveSettings = (settings: Settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const loadSettings = (): Settings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) {
      return {
        theme: 'dark',
        fontSize: 'medium',
        showTimestamps: true,
      };
    }
    return JSON.parse(saved);
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      theme: 'dark',
      fontSize: 'medium',
      showTimestamps: true,
    };
  }
};

export const getChatStats = async (): Promise<ChatStats> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      totalChats: 0,
      totalMessages: 0,
      averageResponseTime: 0,
    };
  }

  const { count: totalChats } = await supabase
    .from('chats')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: totalMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .in('chat_id', supabase
      .from('chats')
      .select('id')
      .eq('user_id', user.id)
    );

  const { data: assistantMessages } = await supabase
    .from('messages')
    .select('thinking_time')
    .eq('role', 'assistant')
    .not('thinking_time', 'is', null)
    .in('chat_id', supabase
      .from('chats')
      .select('id')
      .eq('user_id', user.id)
    );

  const totalResponseTime = assistantMessages?.reduce((sum, msg) => sum + (msg.thinking_time || 0), 0) || 0;
  const averageResponseTime = assistantMessages?.length 
    ? Math.round(totalResponseTime / assistantMessages.length)
    : 0;

  return {
    totalChats: totalChats || 0,
    totalMessages: totalMessages || 0,
    averageResponseTime,
  };
};