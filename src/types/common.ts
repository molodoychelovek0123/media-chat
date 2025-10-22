import { ChatSession, Message } from './chat';
import { ThemeType } from './theme';

export interface AppState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isAgentTyping: boolean;
  currentTheme: ThemeType;
  agentMode: AgentMode;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
}

export type AgentMode = 'business-consultation' | 'technical-support';