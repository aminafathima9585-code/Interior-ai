import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

export const genAI = apiKey && apiKey !== 'your_gemini_api_key_here' 
  ? new GoogleGenerativeAI(apiKey)
  : null;

export const SYSTEM_PROMPT = `You are an expert interior designer assistant. 
Your goal is to understand the user's room and preferences through conversation.
Gather these details naturally:
- Room type and approximate size
- Preferred design styles
- Color preferences
- Budget range
- Must-have and must-avoid items
- Overall mood/vibe desired

After collecting enough info (usually 4-6 exchanges), summarize the preferences 
and indicate you're ready to generate designs by ending with: [READY_TO_GENERATE]

Keep responses concise and friendly. Ask one or two questions at a time.`;

export function buildDesignPrompt(preferences: any): string {
  return `Create a photorealistic interior design render of a ${preferences.roomType}.
Style: ${preferences.styles?.join(', ') || 'Modern'}
Color palette: ${preferences.colors || 'Neutral tones'}
Budget aesthetic: ${preferences.budget || 'Mid-range'}
Mood: ${preferences.mood || 'Cozy and inviting'}
Must include: ${preferences.mustHave || 'Standard furniture'}
Avoid: ${preferences.avoid || 'Nothing specific'}

CRITICAL: Create a cohesive, professionally designed space. 
Ensure proper lighting, realistic proportions, and harmonious color coordination.
The image should look like a professional interior design portfolio piece.`;
}

export function getVariationModifier(index: number): string {
  const modifiers = [
    'Focus on natural lighting and airy feel',
    'Emphasize cozy textures and warm ambiance',
    'Highlight modern minimalist aesthetic with statement pieces',
    'Showcase eclectic mix with bold accent colors',
  ];
  return modifiers[index % modifiers.length];
}
