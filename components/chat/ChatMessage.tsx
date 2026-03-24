'use client';

import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25' 
            : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Sparkles className="w-5 h-5 text-white" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3 ${
          isUser
            ? 'bg-gradient-to-br from-blue-600/80 to-cyan-600/80 text-white border border-blue-400/30'
            : 'bg-white/10 text-gray-100 border border-white/10'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </motion.div>
  );
}
