'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesignStore } from '@/store/designStore';
import { Design } from '@/types';
import { CustomizePanel, CustomizationOptions } from '@/components/customize/CustomizePanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Save, RotateCcw, Check, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function CustomizePage() {
  const [customizedDesign, setCustomizedDesign] = useState<Design | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const { selectedDesign, addDesign } = useDesignStore();
  const router = useRouter();

  if (!selectedDesign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">No Design Selected</h1>
          <p className="text-gray-400 mb-6">
            Please select a design to customize
          </p>
          <Button onClick={() => router.push('/design/generate')}>
            Go to Designs
          </Button>
        </div>
      </div>
    );
  }

  const handleCustomize = async (options: CustomizationOptions) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          design: selectedDesign,
          customizations: options,
        }),
      });

      const data = await res.json();
      if (data.customizedDesign) {
        setCustomizedDesign(data.customizedDesign);
        setShowComparison(true);
      }
    } catch (error) {
      console.error('Customization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    const designToSave = customizedDesign || selectedDesign;
    addDesign(designToSave);
    router.push('/dashboard');
  };

  const handleDownload = () => {
    const designToDownload = customizedDesign || selectedDesign;
    const link = document.createElement('a');
    link.href = designToDownload.image;
    link.download = `design-${designToDownload.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setCustomizedDesign(null);
    setShowComparison(false);
  };

  const currentDesign = customizedDesign || selectedDesign;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push('/design/generate')} className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Customize Design
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Personalize your space with custom options
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {customizedDesign && (
                <Button variant="outline" onClick={handleReset} className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
              <Button variant="outline" onClick={handleDownload} className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                <Save className="w-4 h-4 mr-2" />
                Save Design
              </Button>
            </div>
          </motion.div>

          {/* Comparison Toggle */}
          {customizedDesign && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-green-400 font-medium">Customization Applied!</p>
                  <p className="text-gray-400 text-sm">Your design has been updated with the selected options.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowComparison(!showComparison)}
                  className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
                >
                  {showComparison ? 'Hide Original' : 'Compare with Original'}
                </Button>
              </div>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Design Preview */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="wait">
                {showComparison && customizedDesign ? (
                  <motion.div
                    key="comparison"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    {/* Original */}
                    <Card className="bg-slate-900/50 border-white/10 overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-gray-400 text-sm">Original Design</CardTitle>
                      </CardHeader>
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={selectedDesign.image}
                          alt="Original design"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Card>

                    {/* Customized */}
                    <Card className="bg-slate-900/50 border-purple-500/30 overflow-hidden ring-2 ring-purple-500/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-purple-400 text-sm">Customized Design</CardTitle>
                      </CardHeader>
                      <div className="relative aspect-[4/3]">
                        {/* Base Image with filters */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            filter: customizedDesign?.customizations?.lighting === 'warm' 
                              ? 'sepia(20%) saturate(1.2) brightness(1.05)'
                              : customizedDesign?.customizations?.lighting === 'cool'
                              ? 'hue-rotate(180deg) saturate(0.9) brightness(1.1)'
                              : customizedDesign?.customizations?.lighting === 'dramatic'
                              ? 'contrast(1.2) brightness(0.9) saturate(1.3)'
                              : customizedDesign?.customizations?.lighting === 'cozy'
                              ? 'sepia(30%) brightness(0.95) contrast(0.95)'
                              : customizedDesign?.customizations?.lighting === 'natural'
                              ? 'brightness(1.1) saturate(1.1)'
                              : 'none',
                          }}
                        >
                          <Image
                            src={customizedDesign.image}
                            alt="Customized design"
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {/* Wall color overlay */}
                        {customizedDesign?.customizations?.wallColor && (
                          <div 
                            className="absolute inset-0 mix-blend-multiply opacity-30"
                            style={{
                              backgroundColor: 
                                customizedDesign.customizations.wallColor === 'warm-white' ? '#F5F5DC' :
                                customizedDesign.customizations.wallColor === 'cool-gray' ? '#A0A0A0' :
                                customizedDesign.customizations.wallColor === 'sage-green' ? '#9CAF88' :
                                customizedDesign.customizations.wallColor === 'navy-blue' ? '#1E3A5F' :
                                customizedDesign.customizations.wallColor === 'terracotta' ? '#E2725B' :
                                customizedDesign.customizations.wallColor === 'dusty-rose' ? '#DCAE96' :
                                'transparent'
                            }}
                          />
                        )}
                        
                        {/* Furniture style overlay */}
                        {customizedDesign?.customizations?.furnitureStyle && (
                          <div 
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage: 
                                customizedDesign.customizations.furnitureStyle === 'modern' 
                                  ? 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)'
                                  : customizedDesign.customizations.furnitureStyle === 'bohemian'
                                  ? 'radial-gradient(circle at 20% 80%, rgba(255,200,100,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(200,100,255,0.3) 0%, transparent 50%)'
                                  : customizedDesign.customizations.furnitureStyle === 'minimalist'
                                  ? 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)'
                                  : customizedDesign.customizations.furnitureStyle === 'industrial'
                                  ? 'repeating-linear-gradient(90deg, rgba(100,100,100,0.2) 0px, rgba(100,100,100,0.2) 2px, transparent 2px, transparent 10px)'
                                  : 'none',
                              backgroundSize: customizedDesign.customizations.furnitureStyle === 'modern' ? '20px 20px' : 'auto',
                            }}
                          />
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="single"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="bg-slate-900/50 border-white/10 overflow-hidden">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {/* Base Image with customization filters */}
                        <div 
                          className="absolute inset-0 transition-all duration-700"
                          style={{
                            filter: customizedDesign?.customizations?.lighting === 'warm' 
                              ? 'sepia(25%) saturate(1.3) brightness(1.1) contrast(1.05)'
                              : customizedDesign?.customizations?.lighting === 'cool'
                              ? 'hue-rotate(200deg) saturate(0.85) brightness(1.15) contrast(1.1)'
                              : customizedDesign?.customizations?.lighting === 'dramatic'
                              ? 'contrast(1.35) brightness(0.85) saturate(1.4)'
                              : customizedDesign?.customizations?.lighting === 'cozy'
                              ? 'sepia(35%) brightness(0.9) contrast(0.9) saturate(0.95)'
                              : customizedDesign?.customizations?.lighting === 'natural'
                              ? 'brightness(1.15) saturate(1.15) contrast(1.05)'
                              : 'none',
                          }}
                        >
                          <Image
                            src={currentDesign.image}
                            alt={currentDesign.description}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {/* Wall color overlay - more prominent */}
                        {customizedDesign?.customizations?.wallColor && (
                          <div 
                            className="absolute inset-0 transition-all duration-700"
                            style={{
                              background: 
                                customizedDesign.customizations.wallColor === 'warm-white' 
                                  ? 'linear-gradient(to bottom, rgba(245,245,220,0.5) 0%, rgba(245,245,220,0.3) 50%, rgba(245,245,220,0.2) 100%)' :
                                customizedDesign.customizations.wallColor === 'cool-gray' 
                                  ? 'linear-gradient(to bottom, rgba(128,128,128,0.45) 0%, rgba(128,128,128,0.25) 50%, rgba(128,128,128,0.15) 100%)' :
                                customizedDesign.customizations.wallColor === 'sage-green' 
                                  ? 'linear-gradient(to bottom, rgba(156,175,136,0.5) 0%, rgba(156,175,136,0.3) 50%, rgba(156,175,136,0.2) 100%)' :
                                customizedDesign.customizations.wallColor === 'navy-blue' 
                                  ? 'linear-gradient(to bottom, rgba(30,58,95,0.55) 0%, rgba(30,58,95,0.35) 50%, rgba(30,58,95,0.2) 100%)' :
                                customizedDesign.customizations.wallColor === 'terracotta' 
                                  ? 'linear-gradient(to bottom, rgba(226,114,91,0.5) 0%, rgba(226,114,91,0.3) 50%, rgba(226,114,91,0.2) 100%)' :
                                customizedDesign.customizations.wallColor === 'dusty-rose' 
                                  ? 'linear-gradient(to bottom, rgba(220,174,150,0.5) 0%, rgba(220,174,150,0.3) 50%, rgba(220,174,150,0.2) 100%)' :
                                'transparent',
                              mixBlendMode: 'multiply',
                            }}
                          />
                        )}
                        
                        {/* Flooring overlay */}
                        {customizedDesign?.customizations?.flooring && (
                          <div 
                            className="absolute bottom-0 left-0 right-0 h-1/3 transition-all duration-700"
                            style={{
                              background: 
                                customizedDesign.customizations.flooring === 'hardwood'
                                  ? 'linear-gradient(to top, rgba(139,90,43,0.6) 0%, rgba(160,110,60,0.4) 30%, transparent 100%)' :
                                customizedDesign.customizations.flooring === 'light-carpet'
                                  ? 'linear-gradient(to top, rgba(240,240,240,0.5) 0%, rgba(245,245,245,0.3) 30%, transparent 100%)' :
                                customizedDesign.customizations.flooring === 'dark-carpet'
                                  ? 'linear-gradient(to top, rgba(60,60,60,0.6) 0%, rgba(80,80,80,0.4) 30%, transparent 100%)' :
                                customizedDesign.customizations.flooring === 'tile'
                                  ? 'linear-gradient(to top, rgba(200,200,200,0.5) 0%, rgba(220,220,220,0.3) 30%, transparent 100%)' :
                                customizedDesign.customizations.flooring === 'concrete'
                                  ? 'linear-gradient(to top, rgba(120,120,120,0.55) 0%, rgba(140,140,140,0.35) 30%, transparent 100%)' :
                                customizedDesign.customizations.flooring === 'vinyl'
                                  ? 'linear-gradient(to top, rgba(180,180,180,0.5) 0%, rgba(200,200,200,0.3) 30%, transparent 100%)' :
                                'transparent',
                            }}
                          />
                        )}
                        
                        {/* Furniture style overlay */}
                        {customizedDesign?.customizations?.furnitureStyle && (
                          <div 
                            className="absolute inset-0 transition-all duration-700 pointer-events-none"
                            style={{
                              background: 
                                customizedDesign.customizations.furnitureStyle === 'modern' 
                                  ? 'radial-gradient(ellipse at 50% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' :
                                customizedDesign.customizations.furnitureStyle === 'bohemian'
                                  ? 'radial-gradient(circle at 30% 80%, rgba(255,200,100,0.25) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(200,100,255,0.2) 0%, transparent 40%), radial-gradient(circle at 50% 90%, rgba(100,255,200,0.15) 0%, transparent 50%)' :
                                customizedDesign.customizations.furnitureStyle === 'minimalist'
                                  ? 'linear-gradient(to top, rgba(255,255,255,0.25) 0%, transparent 40%)' :
                                customizedDesign.customizations.furnitureStyle === 'industrial'
                                  ? 'repeating-linear-gradient(90deg, rgba(80,80,80,0.15) 0px, rgba(80,80,80,0.15) 3px, transparent 3px, transparent 15px), linear-gradient(to top, rgba(60,60,60,0.2) 0%, transparent 50%)' :
                                customizedDesign.customizations.furnitureStyle === 'scandinavian'
                                  ? 'radial-gradient(ellipse at 50% 80%, rgba(255,250,240,0.3) 0%, transparent 60%)' :
                                customizedDesign.customizations.furnitureStyle === 'traditional'
                                  ? 'radial-gradient(ellipse at 50% 75%, rgba(139,90,43,0.2) 0%, transparent 60%)' :
                                'none',
                            }}
                          />
                        )}
                        
                        {/* Decor elements */}
                        {customizedDesign?.customizations?.decor && (
                          <div className="absolute inset-0 pointer-events-none">
                            {customizedDesign.customizations.decor === 'plants' && (
                              <>
                                <div className="absolute bottom-4 left-4 w-16 h-24 bg-gradient-to-t from-green-600/60 to-green-400/40 rounded-full blur-sm" />
                                <div className="absolute bottom-8 right-8 w-12 h-20 bg-gradient-to-t from-green-500/50 to-green-300/30 rounded-full blur-sm" />
                                <div className="absolute top-1/3 left-2 w-8 h-12 bg-gradient-to-t from-green-600/40 to-green-400/20 rounded-full blur-sm" />
                              </>
                            )}
                            {customizedDesign.customizations.decor === 'abstract-art' && (
                              <>
                                <div className="absolute top-8 left-1/4 w-20 h-28 bg-gradient-to-br from-purple-500/50 via-pink-500/40 to-orange-400/30 rounded-lg transform rotate-3" />
                                <div className="absolute top-12 right-1/4 w-16 h-24 bg-gradient-to-bl from-blue-500/50 via-cyan-400/40 to-teal-300/30 rounded-lg transform -rotate-2" />
                              </>
                            )}
                            {customizedDesign.customizations.decor === 'mirrors' && (
                              <>
                                <div className="absolute top-1/4 left-8 w-24 h-32 bg-gradient-to-br from-white/40 to-gray-300/30 rounded-lg border-2 border-white/30" />
                                <div className="absolute top-1/3 right-6 w-20 h-28 bg-gradient-to-bl from-white/35 to-gray-300/25 rounded-full border-2 border-white/25" />
                              </>
                            )}
                            {customizedDesign.customizations.decor === 'metallic' && (
                              <>
                                <div className="absolute bottom-1/3 left-1/3 w-12 h-16 bg-gradient-to-br from-yellow-400/50 via-yellow-300/40 to-yellow-200/30 rounded-lg transform rotate-12" />
                                <div className="absolute top-1/2 right-1/4 w-10 h-14 bg-gradient-to-bl from-gray-300/50 via-gray-400/40 to-gray-500/30 rounded-full" />
                                <div className="absolute bottom-1/4 right-1/3 w-8 h-10 bg-gradient-to-tr from-amber-400/45 to-yellow-300/35 rounded-sm transform -rotate-6" />
                              </>
                            )}
                          </div>
                        )}
                        
                        {/* Visual overlay for customized designs */}
                        {customizedDesign && (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-transparent to-pink-500/15 mix-blend-overlay" />
                            <div className="absolute top-4 left-4 px-3 py-1.5 bg-purple-500/90 backdrop-blur-sm rounded-full text-sm text-white font-medium flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Customized
                            </div>
                            {/* Visual effect badges */}
                            <div className="absolute bottom-4 right-4 flex flex-wrap gap-2 justify-end max-w-[50%]">
                              {Object.entries(customizedDesign.customizations || {})
                                .filter(([_, value]) => value)
                                .slice(0, 3)
                                .map(([key, value]) => (
                                  <span
                                    key={key}
                                    className="px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs border border-white/20"
                                  >
                                    {value as string}
                                  </span>
                                ))}
                            </div>
                          </>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <p className="text-gray-300 leading-relaxed">
                          {currentDesign.description}
                        </p>
                        
                        {/* Customization Tags */}
                        {customizedDesign?.customizations && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {Object.entries(customizedDesign.customizations)
                              .filter(([_, value]) => value)
                              .map(([key, value]) => (
                                <span
                                  key={key}
                                  className="px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm flex items-center gap-1.5"
                                >
                                  <Check className="w-3 h-3" />
                                  {key.replace(/([A-Z])/g, ' $1').trim()}: {value as string}
                                </span>
                              ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Design Preferences */}
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Design Preferences</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Room Type', value: currentDesign.preferences.roomType },
                    { label: 'Style', value: currentDesign.preferences.styles?.join(', ') },
                    { label: 'Colors', value: currentDesign.preferences.colors },
                    { label: 'Budget', value: currentDesign.preferences.budget },
                    { label: 'Mood', value: currentDesign.preferences.mood },
                  ].map(({ label, value }) => (
                    value && (
                      <div key={label} className="p-3 rounded-lg bg-white/5">
                        <span className="text-gray-500 text-xs">{label}</span>
                        <p className="text-gray-300 font-medium">{value}</p>
                      </div>
                    )
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Customization Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <CustomizePanel onCustomize={handleCustomize} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
