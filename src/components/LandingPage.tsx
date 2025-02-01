import React from 'react';
import { MessageSquare, Zap, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MessageSquare className="text-blue-500" size={32} />
          <span className="text-white text-xl font-bold">Deepseek AI Chat</span>
        </div>
        <div className="space-x-4">
          <Link
            to="/signin"
            className="text-white hover:text-blue-400 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-white mb-6">
            Experience the Future of Conversation
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Experience the power of Deepseek R1 — our most advanced model — designed for insightful conversations, innovative problem-solving, and seamless creative collaboration.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            Get Started <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="bg-blue-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Natural Conversations
            </h3>
            <p className="text-gray-400">
              Experience fluid, context-aware conversations that feel natural and
              engaging.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-purple-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Lightning Fast
            </h3>
            <p className="text-gray-400">
              Get instant responses powered by state-of-the-art AI technology.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="bg-green-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="text-green-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-400">
              Your conversations are protected with enterprise-grade security.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};