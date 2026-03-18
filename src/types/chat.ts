export type MessageRole = 'user' | 'ai' | 'system';

export type MessageContentType =
  | 'text'
  | 'structured-card'
  | 'training-plan'
  | 'calendar-confirm'
  | 'training-reminder'
  | 'today-training'
  | 'exercise-advice'
  | 'data-permission'
  | 'training-summary'
  | 'flight-search'
  | 'conflict-alert'
  | 'skill-recommend'
  | 'image';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  contentType: MessageContentType;
  text?: string;
  cardData?: Record<string, any>;
  timestamp: number;
  agentId?: string;
}

export type TriggerType =
  | { type: 'auto'; delayMs: number }
  | { type: 'user-input'; matchText?: string }
  | { type: 'button-click'; buttonId?: string }
  | { type: 'option-select'; optionId?: string };

export interface ScriptNode {
  id: string;
  trigger: TriggerType;
  messages: ChatMessage[];
  sideEffects?: () => void;
  nextNodeId?: string | ((context: any) => string);
}

export interface ChatScript {
  id: string;
  flowName: string;
  agentId: string;
  nodes: ScriptNode[];
  entryNodeId: string;
}
