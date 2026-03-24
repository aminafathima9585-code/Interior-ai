export interface Preferences {
  roomType: string;
  roomSize: string;
  styles: string[];
  colors: string;
  budget: string;
  mood: string;
  mustHave: string;
  avoid: string;
}

export interface Design {
  id: string;
  image: string;
  description: string;
  preferences: Preferences;
  createdAt: Date;
  customizations?: Record<string, string | undefined>;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
