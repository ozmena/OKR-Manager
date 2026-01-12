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
  area?: string;  // Only for child OKRs - department/area of the organization
}

// Available areas for child OKRs
export const AREAS = [
  'GCC Mexico',
  'GCC India',
  'GCC Genpact',
  'GPL',
  'GBS Onshore',
  'Capabilities/Tech'
] as const;
