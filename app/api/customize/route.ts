import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini';

// Mock images for fallback
const mockCustomizationImages = [
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
];

export async function POST(req: NextRequest) {
  try {
    const { design, customizations } = await req.json();

    const customizationDesc = Object.entries(customizations)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    // If no API key, use CSS-based customization (current behavior)
    if (!genAI) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      return NextResponse.json({
        customizedDesign: {
          ...design,
          id: crypto.randomUUID(),
          image: design.image, // Keep the same image
          description: `Customized design with ${customizationDesc}. ${design.description}`,
          customizations,
          isCustomized: true,
        },
      });
    }

    // Use Gemini API for real image customization
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const customizationPrompt = `Modify this interior design with the following changes: ${customizationDesc}. 
      Maintain the same room layout and perspective but apply these specific modifications.
      Room type: ${design.preferences?.roomType || 'room'}
      Original style: ${design.preferences?.styles?.join(', ') || 'modern'}
      
      Generate a photorealistic image showing the customized room.`;

      const result = await model.generateContent(customizationPrompt);
      const response = result.response;
      
      // Try to extract image from response
      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        const content = candidates[0].content;
        
        for (const part of content?.parts || []) {
          if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
            return NextResponse.json({
              customizedDesign: {
                ...design,
                id: crypto.randomUUID(),
                image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                description: `AI-customized design with ${customizationDesc}. ${design.description}`,
                customizations,
                isCustomized: true,
              },
            });
          }
        }
      }
      
      // Fallback if no image generated
      return NextResponse.json({
        customizedDesign: {
          ...design,
          id: crypto.randomUUID(),
          image: design.image,
          description: `Customized design with ${customizationDesc}. ${design.description}`,
          customizations,
          isCustomized: true,
        },
      });
    } catch (genError) {
      console.error('Gemini customization error:', genError);
      // Fallback to CSS customization
      return NextResponse.json({
        customizedDesign: {
          ...design,
          id: crypto.randomUUID(),
          image: design.image,
          description: `Customized design with ${customizationDesc}. ${design.description}`,
          customizations,
          isCustomized: true,
        },
      });
    }
  } catch (error) {
    console.error('Customize API error:', error);
    return NextResponse.json(
      { error: 'Failed to customize design' },
      { status: 500 }
    );
  }
}
