export type KeyResultStatus = 'on-track' | 'progressing' | 'off-track';
export type KeyResultUnit = 'percentage' | 'number';

export interface QualityChecklistItem {
  id: string;
  checked: boolean;
}

export interface Action {
  id: string;
  text: string;           // Action description
  owner: string;          // Person responsible
  dueDate: string;        // ISO date string (YYYY-MM-DD)
  completed: boolean;     // Done/not done
  completedAt?: string;   // When it was completed (ISO timestamp)
  createdAt: string;      // When action was created (ISO timestamp)
}

export interface KeyResult {
  id: string;
  metricName: string;
  from: number;
  to: number;
  unit?: KeyResultUnit;  // defaults to 'percentage'
  current?: number;  // Actual value from check-in
  status?: KeyResultStatus;  // Manual status selection
  function?: string;  // Optional function assignment for Area OKRs
}

// Helper function to format KR values with unit
export function formatKRValue(value: number, unit?: KeyResultUnit): string {
  return unit === 'number' ? String(value) : `${value}%`;
}

export interface OKR {
  id: string;
  displayId?: string;  // e.g., "OKR-1" - only for global OKRs
  objective: string;
  keyResults: KeyResult[];
  createdAt: string;
  parentId?: string;
  area?: string;  // Only for child OKRs - department/area of the organization
  challenges?: string;  // Check-in: What challenges are you facing?
  needs?: string;  // Check-in: What do you need to achieve your OKRs?
  comments?: string;  // Check-in comments
  owner?: string;  // Person responsible for this OKR
  qualityChecklist?: QualityChecklistItem[];  // Quality checklist for child OKRs
  actions?: Action[];  // Action items tracked during check-ins
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

// Available people for OKR ownership (alphabetically sorted)
export const PEOPLE = [
  'Alex Komrakov',
  'Amanda Jones',
  'Deepa Abi',
  'Dylan Jetha',
  'Elena Schoeman',
  'Eric Ruys',
  'Evan Sams',
  'Hardik Bhatt',
  'Jack Shu',
  'Juan Montoya',
  'Juan Ramon Triana',
  'Mariana Avila',
  'Morne Fouche',
  'Preeti Naval Kumar',
  'Sanjay Dora',
  'Serge De Vos',
  'Thiago Marchi',
  'Thiago Pinheiro'
] as const;

// Available functions for Key Results (Area OKRs only)
export const FUNCTIONS = ['Supply Chain', 'PBS', 'Ringmaster'] as const;

// Quality checklist items for Area OKRs
export const QUALITY_CHECKLIST_ITEMS = [
  { id: 'direction', title: 'Direction', question: 'Does the Objective set a clear direction and articulate the change that needs to be driven?' },
  { id: 'stakeholder-alignment', title: 'Stakeholder Alignment', question: 'Have the OKRs been aligned with Business Stakeholders?' },
  { id: 'cascading', title: 'Cascading', question: 'Has the cascading of this OKR been decided and aligned across teams?' },
  { id: 'understanding', title: 'Understanding', question: 'Are the OKRs aligned and understood by all involved GBS leads?' },
  { id: 'measurability', title: 'Measurability', question: 'Do the Key Results clearly measure the Objective, and have KPIs been defined to monitor them?' },
  { id: 'prioritization', title: 'Prioritization (Focus)', question: 'Does this OKR help us make better choices about where to spend our time, energy, and resources?' },
  { id: 'ownership', title: 'Ownership', question: 'Has ownership for the Key Results been aligned across GBS?' },
  { id: 'strategic-thinking', title: 'Strategic Thinking', question: 'Does this OKR address existing problems and articulate a clear transformation to a new reality?' },
] as const;
