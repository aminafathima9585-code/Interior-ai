const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const hasGroqKey = !!GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_api_key_here';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface DesignPreferences {
  roomType?: string;
  styles?: string[];
  colors?: string;
  mood?: string;
  budget?: string;
  mustHave?: string;
  avoid?: string;
  prompt?: string;
}

export const SYSTEM_PROMPT = `You are an expert interior designer AI assistant. Your goal is to understand the user's room and preferences through natural conversation.

Gather these details naturally:
- Room type (living room, bedroom, kitchen, bathroom, office, etc.)
- Preferred design styles (modern, minimalist, bohemian, industrial, scandinavian, etc.)
- Color preferences
- Budget range
- Must-have items or features
- Things to avoid
- Overall mood/vibe desired

After collecting enough information (usually 4-6 exchanges), you MUST generate a detailed image generation prompt and indicate you're ready to generate designs by ending your response with: [READY_TO_GENERATE]

The image generation prompt should be detailed and descriptive, suitable for Stable Diffusion XL. Format it as:
[PROMPT]: Your detailed prompt here

Keep responses concise and friendly. Ask one or two questions at a time.`;

export async function chatWithGroq(messages: ChatMessage[]): Promise<{ content: string; readyToGenerate: boolean; prompt?: string }> {
  if (!hasGroqKey) {
    throw new Error('Groq API key not configured');
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    const readyToGenerate = content.includes('[READY_TO_GENERATE]');
    
    // Extract prompt if present
    let prompt: string | undefined;
    const promptMatch = content.match(/\[PROMPT\]:([\s\S]+?)(?=\[|$)/);
    if (promptMatch) {
      prompt = promptMatch[1].trim();
    }

    return {
      content: content.replace(/\[READY_TO_GENERATE\]/g, '').replace(/\[PROMPT\]:[\s\S]+$/, '').trim(),
      readyToGenerate,
      prompt,
    };
  } catch (error) {
    console.error('Groq chat error:', error);
    throw error;
  }
}

export async function generateDesignPrompt(preferences: DesignPreferences): Promise<string> {
  if (!hasGroqKey) {
    throw new Error('Groq API key not configured');
  }

  const promptRequest = `Generate a detailed, high-quality image generation prompt for Stable Diffusion XL based on these interior design preferences:

Room Type: ${preferences.roomType || 'living room'}
Style: ${preferences.styles?.join(', ') || 'modern'}
Colors: ${preferences.colors || 'neutral tones'}
Mood: ${preferences.mood || 'cozy and inviting'}
Budget: ${preferences.budget || 'mid-range'}
Must Have: ${preferences.mustHave || 'standard furniture'}
Avoid: ${preferences.avoid || 'nothing specific'}

Create a detailed prompt that will generate a photorealistic interior design image. Include details about lighting, materials, furniture arrangement, and atmosphere. The prompt should be optimized for Stable Diffusion XL.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are an expert at writing image generation prompts for Stable Diffusion XL. Generate detailed, descriptive prompts for interior design images.' },
          { role: 'user', content: promptRequest },
        ],
        temperature: 0.8,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq prompt generation error:', error);
    throw error;
  }
}
