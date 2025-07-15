export interface AlertState {
  show: boolean;
  message: string;
  subMessage?: string;
  type: "success" | "error" | "warning";
}
export interface UrlData {
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string; 
  expiresAt: string; 
}

export interface UrlStatsResponse {
  urlCount: number;
  totalClicks: number;
  urls: UrlData[];
}
