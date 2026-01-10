export interface KeyResult {
  id: string;
  metricName: string;
  from: number;
  to: number;
}

export interface OKR {
  id: string;
  objective: string;
  keyResults: KeyResult[];
  createdAt: string;
  parentId?: string;
}
