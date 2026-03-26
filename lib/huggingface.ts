const HF_TOKEN = process.env.HF_TOKEN;

interface ImageGenerationOptions {
  prompt: string;
  seed?: number;
  negative_prompt?: string;
  guidance_scale?: number;
  num_inference_steps?: number;
  width?: number;
  height?: number;
}

/**
 * Generate an AI image using Hugging Face Inference API
 * Uses stabilityai/stable-diffusion-xl-base-1.0 model
 */
export async function generateImage(options: ImageGenerationOptions): Promise<string> {
  const { 
    prompt, 
    seed,
    negative_prompt = "blurry, low quality, watermark, text, distorted",
    guidance_scale = 7.5,
    num_inference_steps = 25,
    width = 800,
    height = 600
  } = options;

  if (!HF_TOKEN || HF_TOKEN === 'your_huggingface_token_here') {
    throw new Error('HF_TOKEN not configured');
  }

  try {
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            seed: seed || Math.floor(Math.random() * 1000000),
            negative_prompt,
            guidance_scale,
            num_inference_steps,
            width,
            height,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hugging Face API error: ${error}`);
    }

    // The API returns the image as binary data
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    
    // Return as data URL
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Hugging Face image generation error:', error);
    throw error;
  }
}

export function buildInteriorDesignPrompt(preferences: any, variation?: string): string {
  const roomType = preferences.roomType || 'living room';
  const styles = preferences.styles?.join(', ') || 'modern';
  const colors = preferences.colors || 'neutral tones';
  const mood = preferences.mood || 'cozy';
  
  // Build a more explicit prompt with room type emphasized multiple times
  let prompt = `Professional architectural photography of a ${roomType} interior, ${roomType} design, ${styles} style, ${colors} color palette, ${mood} atmosphere`;
  
  // Add room-specific elements to reinforce the room type
  const roomSpecificElements: Record<string, string> = {
    'kitchen': 'cooking area, countertops, cabinets, stove, refrigerator, kitchen island',
    'bedroom': 'bed, nightstands, wardrobe, bedside lamps, sleeping area',
    'bathroom': 'bathtub, shower, sink, toilet, vanity, mirrors',
    'living room': 'sofa, coffee table, TV, entertainment center, seating area',
    'dining room': 'dining table, chairs, chandelier, buffet, dining area',
    'office': 'desk, office chair, bookshelf, computer, workspace',
  };
  
  const specificElements = roomSpecificElements[roomType.toLowerCase()];
  if (specificElements) {
    prompt += `, featuring ${specificElements}`;
  }
  
  prompt += `, photorealistic, 8k quality, architectural photography, interior design magazine style`;
  
  if (variation) {
    prompt += `, ${variation}`;
  }
  
  // Add negative prompt elements to avoid wrong room types
  const wrongRoomTypes = Object.keys(roomSpecificElements).filter(r => r !== roomType.toLowerCase());
  if (wrongRoomTypes.length > 0) {
    prompt += `, NOT ${wrongRoomTypes.join(', NOT ')}`;
  }
  
  return prompt;
}

export function buildCustomizationPrompt(basePreferences: any, customizations: any): string {
  const roomType = basePreferences?.roomType || 'living room';
  
  const customizationParts: string[] = [];
  
  if (customizations.wallColor) {
    customizationParts.push(`${customizations.wallColor} walls`);
  }
  if (customizations.furnitureStyle) {
    customizationParts.push(`${customizations.furnitureStyle} furniture`);
  }
  if (customizations.lighting) {
    customizationParts.push(`${customizations.lighting} lighting`);
  }
  if (customizations.flooring) {
    customizationParts.push(`${customizations.flooring} flooring`);
  }
  if (customizations.decor) {
    customizationParts.push(`${customizations.decor} decor`);
  }
  
  const customizationText = customizationParts.join(', ');
  
  return `Professional interior design photograph of a ${roomType}, ${customizationText}, photorealistic, high quality`;
}

export const hasHuggingFaceToken = !!HF_TOKEN && HF_TOKEN !== 'your_huggingface_token_here';
