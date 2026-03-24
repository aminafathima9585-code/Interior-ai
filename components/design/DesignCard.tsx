'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Design } from '@/types';
import { Check, Wand2, Heart } from 'lucide-react';
import { useState } from 'react';

interface DesignCardProps {
  design: Design;
  isSelected?: boolean;
  onSelect?: () => void;
  onCustomize?: () => void;
}

export function DesignCard({
  design,
  isSelected,
  onSelect,
  onCustomize,
}: DesignCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group"
    >
      <Card
        className={`overflow-hidden cursor-pointer transition-all duration-300 bg-slate-900/50 border-white/10 backdrop-blur-sm hover:bg-slate-800/50 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 ${
          isSelected ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/25' : ''
        }`}
        onClick={onSelect}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={design.image}
            alt={design.description}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
          
          {/* Like button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-black/60"
          >
            <Heart className={`w-4 h-4 transition-all ${isLiked ? 'fill-pink-500 text-pink-500 scale-110' : 'text-white'}`} />
          </button>

          {isSelected && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <CardContent className="p-4 bg-gradient-to-b from-transparent to-slate-900/50">
          <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
            {design.description}
          </p>
          
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
              {design.preferences.roomType || 'Room'}
            </span>
            <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
              {design.preferences.styles?.[0] || 'Style'}
            </span>
          </div>

          {onCustomize && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4 bg-white/5 border-white/10 hover:bg-purple-500/20 hover:border-purple-500/50 text-white transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onCustomize();
              }}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Customize
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
