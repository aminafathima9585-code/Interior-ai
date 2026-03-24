'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDesignStore } from '@/store/designStore';
import { DesignCard } from '@/components/design/DesignCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, ArrowLeft, Wand2 } from 'lucide-react';
import { Design } from '@/types';

export default function GeneratePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState<Design[]>([]);
  const { preferences, roomImage, addDesign, selectDesign, selectedDesign } =
    useDesignStore();
  const router = useRouter();

  useEffect(() => {
    generateDesigns();
  }, []);

  const generateDesigns = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences,
          roomImage,
          variations: 3,
        }),
      });

      const data = await res.json();

      if (data.designs) {
        const designsWithDates = data.designs.map((d: Design) => ({
          ...d,
          preferences: preferences as Design['preferences'],
          createdAt: new Date(),
        }));
        setGeneratedDesigns(designsWithDates);
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelect = (design: Design) => {
    selectDesign(design);
  };

  const handleCustomize = () => {
    if (selectedDesign) {
      addDesign(selectedDesign);
      router.push('/design/customize');
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => router.push('/design/chat')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
            <h1 className="text-3xl font-bold">Generated Designs</h1>
            <Button variant="outline" onClick={generateDesigns} disabled={isGenerating}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          </div>

          {isGenerating ? (
            <Card className="py-16">
              <CardContent className="flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-lg text-muted-foreground">
                  Generating your design concepts...
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This may take a minute
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {generatedDesigns.map((design) => (
                  <DesignCard
                    key={design.id}
                    design={design}
                    isSelected={selectedDesign?.id === design.id}
                    onSelect={() => handleSelect(design)}
                  />
                ))}
              </div>

              {selectedDesign && (
                <Card className="sticky bottom-4 bg-background/95 backdrop-blur border-primary">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">Design Selected</p>
                      <p className="text-sm text-muted-foreground">
                        Customize or save this design
                      </p>
                    </div>
                    <Button onClick={handleCustomize}>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Customize Design
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
