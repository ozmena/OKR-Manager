export type KeyResultStatus = 'on-track' | 'progressing' | 'off-track';

export interface KeyResult {
  id: string;
  metricName: string;
  from: number;
  to: number;
  current?: number;  // Actual value from check-in
  status?: KeyResultStatus;  // Manual status selection
}

export interface OKR {
  id: string;
  displayId?: string;  // e.g., "OKR-1" - only for global OKRs
  objective: string;
  keyResults: KeyResult[];
  createdAt: string;
  parentId?: string;
  area?: string;  // Only for child OKRs - department/area of the organization
  comments?: string;  // Check-in comments for child OKRs
  owner?: string;  // Person responsible for this OKR
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

// Available people for OKR ownership
export const PEOPLE = [
  'Hardik Bhatt',
  'Mariana Avila',
  'Jack Shu',
  'Thiago Pinheiro',
  'Morne Fouche',
  'Thiago Marchi',
  'Evan Sams',
  'Sanjay Dora',
  'Deepa Abi',
  'Alex Komrakov',
  'Juan Ramon Triana',
  'Serge De Vos',
  'Eric Ruys',
  'Elena Schoeman',
  'Preeti Naval Kumar',
  'Dylan Jetha',
  'Juan Montoya',
  'Amanda Jones'
] as const;
