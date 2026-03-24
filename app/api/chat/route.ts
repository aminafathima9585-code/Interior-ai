import { NextRequest, NextResponse } from 'next/server';
import { genAI, SYSTEM_PROMPT } from '@/lib/gemini';

// Mock responses for when API key is not available
const mockResponses = [
  "I'd love to help you design your space! What type of room are you looking to redesign? (e.g., living room, bedroom, kitchen)",
  "Great choice! What style are you drawn to? Modern, minimalist, bohemian, industrial, or something else?",
  "What colors do you prefer? Warm earth tones, cool blues, neutral grays, or bold accent colors?",
  "What's your budget range? This will help me suggest appropriate furniture and decor options.",
  "Are there any must-have items or features you want in the room?",
  "Perfect! I've gathered all your preferences. Let me create some design concepts for you. [READY_TO_GENERATE]",
];

function getMockResponse(messages: any[]) {
  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const responseIndex = Math.min(userMessageCount - 1, mockResponses.length - 1);
  return mockResponses[Math.max(0, responseIndex)];
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // If no API key, use mock mode
    if (!genAI) {
      const mockResponse = getMockResponse(messages);
      return NextResponse.json({
        message: mockResponse,
        readyToGenerate: mockResponse.includes('[READY_TO_GENERATE]'),
      });
    }

    // Use Gemini API
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const chat = model.startChat({
        history: messages.slice(0, -1).map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        })),
        systemInstruction: SYSTEM_PROMPT,
      });

      const result = await chat.sendMessage(messages[messages.length - 1].content);
      const response = await result.response.text();

      return NextResponse.json({
        message: response,
        readyToGenerate: response.includes('[READY_TO_GENERATE]'),
      });
    } catch (genError) {
      console.error('Gemini chat error:', genError);
      // Fallback to mock mode on error
      const mockResponse = getMockResponse(messages);
      return NextResponse.json({
        message: mockResponse,
        readyToGenerate: mockResponse.includes('[READY_TO_GENERATE]'),
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
