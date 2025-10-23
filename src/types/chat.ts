import { AgentAction } from './agent';
import { ThemeType, Theme } from './theme';

export interface BaseMessage {
  id: string;
  type: MessageType;
  timestamp: Date;
  sender: MessageSender;
  status: MessageStatus;
}

export interface TextMessage extends BaseMessage {
  type: 'text';
  content: string;
  format?: 'plain' | 'markdown';
}

export interface FileMessage extends BaseMessage {
  type: 'file';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface ReasoningMessage extends BaseMessage {
  type: 'reasoning';
  steps: ReasoningStep[];
  isCollapsed?: boolean;
}

export interface ReasoningStep {
  id: string;
  content: string;
  timestamp: Date;
}

export interface FormMessage extends BaseMessage {
  type: 'form';
  title: string;
  fields: FormField[];
  submitLabel?: string;
  onSubmit?: (data: Record<string, any>) => void;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'range';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    step?: number;
  };
}

export interface ImageMessage extends BaseMessage {
  type: 'image';
  imageUrl: string;
  altText?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface LinksMessage extends BaseMessage {
  type: 'links';
  title?: string;
  links: LinkItem[];
  layout?: 'grid' | 'list';
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  imageUrl?: string;
  domain?: string;
}

export interface TableMessage extends BaseMessage {
  type: 'table';
  title?: string;
  columns: TableColumn[];
  data: Record<string, any>[];
  pagination?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface ProgressMessage extends BaseMessage {
  type: 'progress';
  title: string;
  progress: number;
  max?: number;
  progressStatus?: 'idle' | 'running' | 'completed' | 'error';
  description?: string;
  showPercentage?: boolean;
}

export interface MapMessage extends BaseMessage {
  type: 'map';
  title?: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers: MapMarker[];
  height?: number;
  width?: number;
  interactive?: boolean;
}

export interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface ButtonGroupMessage extends BaseMessage {
  type: 'button-group';
  buttons: ButtonItem[];
  layout?: 'horizontal' | 'vertical';
}

export interface ButtonItem {
  id: string;
  label: string;
  action: AgentAction;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export interface QuickRepliesMessage extends BaseMessage {
  type: 'quick-replies';
  suggestions: string[];
  maxVisible?: number;
}

export type Message =
  | TextMessage
  | FileMessage
  | ReasoningMessage
  | FormMessage
  | ImageMessage
  | LinksMessage
  | TableMessage
  | ProgressMessage
  | ButtonGroupMessage
  | QuickRepliesMessage
  | MapMessage;

export type MessageType =
  | 'text'
  | 'file'
  | 'reasoning'
  | 'form'
  | 'image'
  | 'links'
  | 'table'
  | 'progress'
  | 'button-group'
  | 'quick-replies'
  | 'map';
export type MessageSender = 'user' | 'agent';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  theme: ThemeType;
}

export interface MessageComponentProps<T extends Message = Message> {
  message: T;
  theme: Theme;
  onAction?: (action: AgentAction) => void;
}