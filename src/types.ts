export interface KeyResult {
  id: string;
  metricName: string;
  from: number;
  to: number;
}

export interface OKR {
  id: string;
  displayId?: string;  // e.g., "OKR-1" - only for global OKRs
  objective: string;
  keyResults: KeyResult[];
  createdAt: string;
  parentId?: string;
}
