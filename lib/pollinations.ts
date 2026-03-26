interface ImageGenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
  negative_prompt?: string;
  guidance_scale?: number;
  num_inference_steps?: number;
}

/**
 * Generate an AI image using Pollinations.ai (FREE - no API key needed)
 * Uses direct URL generation which works client-side
 */
export async function generateImage(options: ImageGenerationOptions): Promise<string> {
  const { prompt, width = 800, height = 600, seed } = options;

  // Clean and optimize the prompt
  const cleanPrompt = prompt.trim();
  
  // Build Pollinations URL with the prompt
  const encodedPrompt = encodeURIComponent(cleanPrompt);
  
  // Use a unique seed for each generation
  const uniqueSeed = seed || Date.now();
  
  // Pollinations.ai direct image generation URL
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${uniqueSeed}&nologo=true&no-cache=true`;
  
  console.log(`Generating AI image with Pollinations: "${cleanPrompt.substring(0, 60)}..."`);
  
  return imageUrl;
}

export function buildInteriorDesignPrompt(preferences: any, variation?: string): string {
  const roomType = preferences.roomType || 'living room';
  const styles = preferences.styles?.join(', ') || 'modern';
  const colors = preferences.colors || 'neutral tones';
  const mood = preferences.mood || 'cozy';

  // Room-specific elements to guide the AI
  const roomSpecificElements: Record<string, string> = {
    'kitchen': 'kitchen cabinets, countertops, stove, refrigerator, kitchen island, cooking area',
    'bedroom': 'bed, pillows, wardrobe, nightstands, bedside lamps, sleeping area',
    'bathroom': 'bathtub, shower, sink, toilet, vanity, bathroom mirrors',
    'living room': 'sofa, coffee table, TV unit, armchairs, living room, seating area',
    'dining room': 'dining table, dining chairs, chandelier, dining room',
    'office': 'office desk, office chair, bookshelf, computer, home office workspace',
  };

  const roomKey = roomType.toLowerCase();
  const specificElements = roomSpecificElements[roomKey] || roomType;

  // Strong prompt: room type mentioned multiple times + specific elements
  let prompt = `${roomType} interior design, ${roomType}, ${specificElements}, ${styles} style, ${colors} colors, ${mood}, photorealistic, high quality interior photography`;

  if (variation) {
    prompt += `, ${variation}`;
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
    customizationParts.push(`${customizations.flooring} floor`);
  }
  if (customizations.decor) {
    customizationParts.push(`${customizations.decor} decor`);
  }
  
  const customizationText = customizationParts.join(', ');
  
  // Keep prompt concise
  return `Interior design of a ${roomType}, ${customizationText}, photorealistic, high quality`;
}

// Always true since we use direct URL generation which doesn't require an API key
export const hasPollinationsKey = true;
