'use client';

import { motion } from 'framer-motion';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ImageUploader } from '@/components/design/ImageUploader';
import { useDesignStore } from '@/store/designStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Sparkles } from 'lucide-react';

export default function ChatPage() {
  const { roomImage, setRoomImage } = useDesignStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">AI Design Assistant</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Design Your Space
            </h1>
            <p className="text-gray-400 mt-3 max-w-lg mx-auto">
              Share your vision with our AI. Upload a photo of your room and describe your dream design.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl overflow-hidden sticky top-6">
                <CardHeader className="border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-purple-400" />
                    Room Photo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ImageUploader image={roomImage} onImageSelect={setRoomImage} />
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Optional - helps AI understand your space better
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              <ChatContainer />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
