
export interface AnswerRow {
  id: string;
  [key: string]: string; // Key will be blank1, blank2, etc. + 'id'
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}
