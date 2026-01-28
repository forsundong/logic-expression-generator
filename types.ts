
export interface AnswerRow {
  id: string;
  [key: string]: string; // 确保允许所有字符串键，包括 blank1, blank2 等
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}
