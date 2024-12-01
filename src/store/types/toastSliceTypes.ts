export type ToastMessage = {
  show: boolean;
  message: string;
  duration: number;
  value: number;
  type: "info" | "error" | "success" | "warning";
  id: string;
};

export type ToastState = {
  toastMessages: ToastMessage[];
};
