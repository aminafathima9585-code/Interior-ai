'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Palette, 
  Sofa, 
  Lightbulb, 
  Grid3X3, 
  Paintbrush,
  Sparkles,
  Loader2,
  Check
} from 'lucide-react';

interface CustomizationOptions {
  wallColor?: string;
  furnitureStyle?: string;
  lighting?: string;
  flooring?: string;
  decor?: string;
  accentColor?: string;
}

interface CustomizePanelProps {
  onCustomize: (options: CustomizationOptions) => void;
  isLoading?: boolean;
}

const colorOptions = [
  { name: 'Warm White', value: 'warm-white', color: '#F5F5DC' },
  { name: 'Cool Gray', value: 'cool-gray', color: '#808080' },
  { name: 'Sage Green', value: 'sage-green', color: '#9CAF88' },
  { name: 'Navy Blue', value: 'navy-blue', color: '#1E3A5F' },
  { name: 'Terracotta', value: 'terracotta', color: '#E2725B' },
  { name: 'Dusty Rose', value: 'dusty-rose', color: '#DCAE96' },
];

const furnitureStyles = [
  { name: 'Modern', value: 'modern', icon: Sofa },
  { name: 'Minimalist', value: 'minimalist', icon: Sofa },
  { name: 'Bohemian', value: 'bohemian', icon: Sofa },
  { name: 'Industrial', value: 'industrial', icon: Sofa },
  { name: 'Scandinavian', value: 'scandinavian', icon: Sofa },
  { name: 'Traditional', value: 'traditional', icon: Sofa },
];

const lightingOptions = [
  { name: 'Natural Light', value: 'natural', icon: Lightbulb },
  { name: 'Warm Ambient', value: 'warm', icon: Lightbulb },
  { name: 'Cool White', value: 'cool', icon: Lightbulb },
  { name: 'Dramatic', value: 'dramatic', icon: Lightbulb },
  { name: 'Soft & Cozy', value: 'cozy', icon: Lightbulb },
];

const flooringOptions = [
  { name: 'Hardwood', value: 'hardwood' },
  { name: 'Light Carpet', value: 'light-carpet' },
  { name: 'Dark Carpet', value: 'dark-carpet' },
  { name: 'Tile', value: 'tile' },
  { name: 'Vinyl', value: 'vinyl' },
  { name: 'Concrete', value: 'concrete' },
];

const decorOptions = [
  { name: 'Plants & Greenery', value: 'plants' },
  { name: 'Abstract Art', value: 'abstract-art' },
  { name: 'Mirrors', value: 'mirrors' },
  { name: 'Minimal', value: 'minimal' },
  { name: 'Vintage', value: 'vintage' },
  { name: 'Metallic Accents', value: 'metallic' },
];

export function CustomizePanel({ onCustomize, isLoading }: CustomizePanelProps) {
  const [selectedOptions, setSelectedOptions] = useState<CustomizationOptions>({});

  const handleSelect = (category: keyof CustomizationOptions, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: prev[category] === value ? undefined : value,
    }));
  };

  const handleApply = () => {
    onCustomize(selectedOptions);
  };

  const hasSelections = Object.values(selectedOptions).some((v) => v !== undefined);

  return (
    <div className="space-y-6">
      {/* Wall Color */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <Paintbrush className="w-4 h-4 text-purple-400" />
            Wall Color
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {colorOptions.map((color) => (
              <motion.button
                key={color.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect('wallColor', color.value)}
                className={`relative p-3 rounded-xl border-2 transition-all ${
                  selectedOptions.wallColor === color.value
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div
                  className="w-full h-8 rounded-lg mb-2 border border-white/10"
                  style={{ backgroundColor: color.color }}
                />
                <span className="text-xs text-gray-300">{color.name}</span>
                {selectedOptions.wallColor === color.value && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Furniture Style */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <Sofa className="w-4 h-4 text-blue-400" />
            Furniture Style
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {furnitureStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => handleSelect('furnitureStyle', style.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedOptions.furnitureStyle === style.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lighting */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            Lighting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {lightingOptions.map((light) => (
              <button
                key={light.value}
                onClick={() => handleSelect('lighting', light.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedOptions.lighting === light.value
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {light.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flooring */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <Grid3X3 className="w-4 h-4 text-green-400" />
            Flooring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {flooringOptions.map((floor) => (
              <button
                key={floor.value}
                onClick={() => handleSelect('flooring', floor.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedOptions.flooring === floor.value
                    ? 'bg-green-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {floor.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Decor */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <Palette className="w-4 h-4 text-pink-400" />
            Decor Style
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {decorOptions.map((decor) => (
              <button
                key={decor.value}
                onClick={() => handleSelect('decor', decor.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedOptions.decor === decor.value
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {decor.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Apply Button */}
      <Button
        onClick={handleApply}
        disabled={!hasSelections || isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Applying Changes...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Apply Customizations
          </>
        )}
      </Button>
    </div>
  );
}

export type { CustomizationOptions };
