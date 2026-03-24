'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, X, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  image: string | null;
  onImageSelect: (image: string | null) => void;
}

export function ImageUploader({ image, onImageSelect }: ImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          onImageSelect(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
  });

  if (image) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group"
      >
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
          <Image src={image} alt="Room" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onImageSelect(null)}
          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </motion.button>
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-xs text-white">
          Room Photo
        </div>
      </motion.div>
    );
  }

  const dropzoneProps = getRootProps();

  return (
    <div
      {...dropzoneProps}
      className={`cursor-pointer transition-all duration-300 rounded-xl border-2 border-dashed hover:scale-[1.02] active:scale-[0.98] ${
        isDragActive 
          ? 'border-purple-500 bg-purple-500/10' 
          : 'border-white/20 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <motion.div
          animate={isDragActive ? { y: [0, -5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${
            isDragActive 
              ? 'bg-purple-500/20' 
              : 'bg-white/5'
          }`}
        >
          {isDragActive ? (
            <Upload className="w-7 h-7 text-purple-400" />
          ) : (
            <ImageIcon className="w-7 h-7 text-gray-400" />
          )}
        </motion.div>
        <p className="text-sm text-gray-300 text-center font-medium">
          {isDragActive ? (
            'Drop your image here'
          ) : (
            <>
              Drop photo or <span className="text-purple-400">browse</span>
            </>
          )}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Supports: JPG, PNG, WebP
        </p>
      </div>
    </div>
  );
}
