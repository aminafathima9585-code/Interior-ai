'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesignStore } from '@/store/designStore';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';

export function ChatContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [readyToGenerate, setReadyToGenerate] = useState(false);
  const { messages, addMessage, preferences } = useDesignStore();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (content: string) => {
    addMessage({ role: 'user', content });
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content }],
        }),
      });

      const data = await res.json();
      addMessage({
        role: 'assistant',
        content: data.message.replace('[READY_TO_GENERATE]', ''),
      });

      if (data.readyToGenerate) {
        setReadyToGenerate(true);
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = () => {
    router.push('/design/generate');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-slate-900/50 border-white/10 backdrop-blur-xl overflow-hidden">
      <CardHeader className="border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg">Design Assistant</div>
            <div className="text-xs text-gray-400 font-normal">Powered by AI</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[450px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Wand2 className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Welcome! I&apos;m your AI Designer</h3>
                <p className="text-gray-400 max-w-sm mx-auto leading-relaxed">
                  Tell me about your room, style preferences, and vision. I&apos;ll help you create stunning interior designs.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {['Modern living room', 'Cozy bedroom', 'Minimalist kitchen'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-gray-400 pl-12"
            >
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm">AI is thinking...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="space-y-3">
            <ChatInput onSend={sendMessage} isLoading={isLoading} />

            <AnimatePresence>
              {readyToGenerate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <Button
                    onClick={handleGenerate}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Design Concepts
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
