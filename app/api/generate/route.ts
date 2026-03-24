import { NextRequest, NextResponse } from 'next/server';
import { genAI, buildDesignPrompt, getVariationModifier } from '@/lib/gemini';

// Mock design images (using placeholder service)
const mockDesignImages = [
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&h=600&fit=crop',
];

function generateMockDesigns(preferences: any, variations: number) {
  const roomType = preferences.roomType || 'room';
  const style = preferences.styles?.[0] || 'modern';
  
  return Array.from({ length: variations }, (_, i) => ({
    id: crypto.randomUUID(),
    image: mockDesignImages[i % mockDesignImages.length],
    description: `A beautiful ${style} ${roomType} design featuring elegant furniture, harmonious colors, and perfect lighting. This concept emphasizes comfort and style.`,
  }));
}

export async function POST(req: NextRequest) {
  try {
    const { preferences, roomImage, variations = 3 } = await req.json();

    // If no API key, use mock mode
    if (!genAI) {
      const mockDesigns = generateMockDesigns(preferences, variations);
      return NextResponse.json({ designs: mockDesigns });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const basePrompt = buildDesignPrompt(preferences);
    const generatedImages = [];

    // Generate multiple variations
    for (let i = 0; i < variations; i++) {
      const variationPrompt = `${basePrompt}\n\nVariation ${i + 1}: ${getVariationModifier(i)}`;

      try {
        const result = await model.generateContent(variationPrompt);
        const response = result.response;
        
        // Try to extract image from response
        const candidates = response.candidates;
        if (candidates && candidates.length > 0) {
          const content = candidates[0].content;
          
          // Look for inline image data
          for (const part of content?.parts || []) {
            if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
              generatedImages.push({
                id: crypto.randomUUID(),
                image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                description: `AI-generated ${preferences.roomType || 'room'} design - Variation ${i + 1}`,
              });
              break;
            }
          }
          
          // If no image found in this variation, add a mock
          if (generatedImages.length <= i) {
            generatedImages.push({
              id: crypto.randomUUID(),
              image: mockDesignImages[i % mockDesignImages.length],
              description: `Design variation ${i + 1} - ${preferences.styles?.[0] || 'Modern'} ${preferences.roomType || 'Room'}`,
            });
          }
        }
      } catch (genError) {
        console.error(`Error generating variation ${i + 1}:`, genError);
        // Add mock image on error
        generatedImages.push({
          id: crypto.randomUUID(),
          image: mockDesignImages[i % mockDesignImages.length],
          description: `Design variation ${i + 1} - ${preferences.styles?.[0] || 'Modern'} ${preferences.roomType || 'Room'}`,
        });
      }
    }

    return NextResponse.json({ designs: generatedImages });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate designs' },
      { status: 500 }
    );
  }
}
