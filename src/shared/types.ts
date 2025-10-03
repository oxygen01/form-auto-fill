export interface FormField {
  element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  type: string;
  name: string;
  id: string;
  placeholder: string;
  required: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: string;
  max?: string;
  step?: string;
}

export interface FillOptions {
  respectValidation: boolean;
  locale: string;
  animationSpeed: 'instant' | 'fast' | 'slow';
}

export interface StorageData {
  options: FillOptions;
  profiles: Profile[];
}

export interface Profile {
  id: string;
  name: string;
  data: Record<string, string>;
}

export type MessageType =
  | 'FILL_FORM'
  | 'GET_FORM_COUNT'
  | 'FORM_COUNT_RESPONSE'
  | 'FILL_COMPLETE';

export interface Message {
  type: MessageType;
  payload?: any;
}
