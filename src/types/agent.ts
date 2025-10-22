import { Message } from './chat';
import { ThemeType } from './theme';

export interface AgentResponse {
  message: string;
  type: 'text' | 'suggestion' | 'question';
  actions?: AgentAction[];
  metadata?: Record<string, any>;
}

export interface AgentAction {
  type: 'button' | 'link' | 'form';
  label: string;
  payload: any;
}

export interface MockAgentConfig {
  responseDelay: number;
  typingDuration: number;
  errorRate: number;
  onThemeChange?: (theme: ThemeType) => void;
}

export interface AgentService {
  sendMessage(message: string): Promise<AgentResponse>;
  startSession(theme: ThemeType): Promise<void>;
  endSession(): Promise<void>;
  isTyping(): boolean;
}

export interface BusinessScenarioStep {
  trigger: RegExp;
  response: string;
  actions?: AgentAction[];
  messageType?: Message['type'];
  messageData?: Partial<Message>;
}

export interface BusinessScenario {
  steps: BusinessScenarioStep[];
}

export interface CoffeeShopScenario {
  currentStep: number;
  userData: {
    businessType?: string;
    location?: string;
    budget?: number;
    experience?: string;
    targetAudience?: string;
  };
  theme: ThemeType;
}