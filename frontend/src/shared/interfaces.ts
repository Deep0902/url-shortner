export interface AlertState {
  show: boolean;
  message: string;
  subMessage?: string;
  type: "success" | "error" | "warning";
}