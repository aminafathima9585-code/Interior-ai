import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini';
import { generateImage } from '@/lib/pollinations';

// Variation modifiers for different design styles
function getVariationModifier(i: number): string {
  const variations = [
    "minimalist design, clean layout, soft natural lighting",
    "luxury interior, rich textures, warm ambient lighting, high-end finishes",
    "modern aesthetic, bold accent colors, artistic decor pieces",
    "cozy atmosphere, natural light, wooden elements, comfortable seating",
    "futuristic interior, sleek furniture, contemporary design",
  ];
  return variations[i % variations.length];
}

// Use Gemini to generate an optimized prompt for Stable Diffusion
async function generateOptimizedPrompt(preferences: any, variation: string): Promise<string> {
  if (!genAI) {
    // Fallback to basic prompt if Gemini not available
    const roomType = preferences.roomType || 'interior space';
    const styles = preferences.styles?.join(', ') || 'modern';
    const colors = preferences.colors || 'neutral tones';
    const mood = preferences.mood || 'inviting';
    return `Professional architectural photography of ${roomType}, ${styles} style, ${colors} color palette, ${mood} atmosphere, ${variation}, photorealistic, 8k quality, interior design magazine photography`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    
    const promptRequest = `Create a detailed, high-quality image generation prompt for Stable Diffusion XL based on these interior design preferences:

Room Type: ${preferences.roomType || 'interior space'}
Style: ${preferences.styles?.join(', ') || 'modern'}
Color Palette: ${preferences.colors || 'neutral tones'}
Mood/Atmosphere: ${preferences.mood || 'inviting'}
Variation: ${variation}

Generate a detailed prompt that will create a photorealistic interior design image. Include:
- Specific room type (mentioned multiple times)
- Style elements and materials
- Lighting description
- Furniture and decor details
- Camera angle and composition
- Quality descriptors (photorealistic, 8k, architectural photography)

Return ONLY the prompt text, no explanations.`;

    const result = await model.generateContent(promptRequest);
    const response = await result.response.text();
    
    return response.trim();
  } catch (error) {
    console.error('Gemini prompt generation error:', error);
    // Fallback to basic prompt
    const roomType = preferences.roomType || 'interior space';
    const styles = preferences.styles?.join(', ') || 'modern';
    const colors = preferences.colors || 'neutral tones';
    const mood = preferences.mood || 'inviting';
    return `Professional architectural photography of ${roomType}, ${styles} style, ${colors} color palette, ${mood} atmosphere, ${variation}, photorealistic, 8k quality, interior design magazine photography`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { preferences, variations = 3 } = await req.json();

    // Using Pollinations.ai for free AI image generation

    const generatedImages = [];

    for (let i = 0; i < variations; i++) {
      const seed = Math.floor(Math.random() * 1000000);
      const variation = getVariationModifier(i);

      try {
        // Step 1: Use Gemini to generate optimized prompt
        const optimizedPrompt = await generateOptimizedPrompt(preferences, variation);
        console.log(`Generated prompt for variation ${i + 1}:`, optimizedPrompt.substring(0, 100) + '...');

        // Step 2: Build negative prompt to avoid wrong room types
        const roomType = preferences.roomType?.toLowerCase() || 'room';
        const wrongRooms = ['living room', 'bedroom', 'kitchen', 'bathroom', 'dining room', 'office']
          .filter(r => r !== roomType)
          .join(', ');
        
        // Step 3: Use Pollinations.ai to generate image
        const imageUrl = await generateImage({
          prompt: optimizedPrompt,
          width: 800,
          height: 600,
          seed: seed,
        });

        generatedImages.push({
          id: crypto.randomUUID(),
          image: imageUrl,
          description: `AI-generated ${preferences.roomType || 'room'} design - Variation ${i + 1}`,
          prompt: optimizedPrompt,
        });

      } catch (error) {
        console.error(`Error generating variation ${i + 1}:`, error);
        // Continue to next variation
      }
    }

    // Return generated images if we have any
    if (generatedImages.length > 0) {
      return NextResponse.json({ designs: generatedImages });
    }

    // If all generations failed, return error
    return NextResponse.json(
      { error: 'Failed to generate any designs. Please check your API tokens and try again.' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate designs' },
      { status: 500 }
    );
  }
}
