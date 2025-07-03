export interface ApiSuccessResponse<T> {
  status: 'success';
  code?: number;
  data?: T;
  message: string;
}

export interface ApiErrorResponse {
  status: 'error';
  code: number;
  message: string;
  errors?: Record<string, any>; // Tùy chọn để chứa chi tiết lỗi (nếu có)
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;