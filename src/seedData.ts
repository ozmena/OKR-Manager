import { OKR } from './types';

export const seedOKRs: OKR[] = [
  // ============================================
  // Global OKR 1 - Market Leadership
  // ============================================
  {
    id: 'global-1',
    displayId: 'OKR-1',
    objective: 'Become the market leader, more innovative and automated processes',
    keyResults: [
      { id: 'kr-1-1', metricName: 'Market Share', from: 10, to: 30, current: 22, status: 'on-track' },
      { id: 'kr-1-2', metricName: 'Adherence to agreed Finance WoW, measured through cycle reviews and stakeholder feedback', from: 13, to: 24, current: 17, status: 'progressing' },
      { id: 'kr-1-3', metricName: 'Processes automated', from: 24, to: 35, current: 26, status: 'off-track' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Hardik Bhatt',
  },
  // Child OKRs for Global 1 - varied lengths
  {
    id: 'child-1-1',
    objective: 'Deliver savings', // Very short
    parentId: 'global-1',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-1-1-1', metricName: 'Cost reduction', from: 10, to: 30, current: 28, status: 'on-track' },
      { id: 'kr-1-1-2', metricName: 'Automated processes', from: 19, to: 25, current: 21, status: 'progressing' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Deepa Abi',
  },
  {
    id: 'child-1-2',
    objective: 'Become a trusted Business Partner by delivering strong operational results and top tier stakeholder NPS through consistent excellence', // Long
    parentId: 'global-1',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-1-2-1', metricName: 'Adherence to agreed Finance WoW, measured through cycle reviews and stakeholder feedback across all regional teams', from: 10, to: 40, current: 32, status: 'on-track' },
      { id: 'kr-1-2-2', metricName: 'Revenue', from: 10, to: 20, current: 12, status: 'off-track' },
      { id: 'kr-1-2-3', metricName: 'NPS', from: 40, to: 75, current: 58, status: 'progressing' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Juan Montoya',
  },
  {
    id: 'child-1-3',
    objective: 'Improve process efficiency', // Short
    parentId: 'global-1',
    area: 'GPL',
    keyResults: [
      { id: 'kr-1-3-1', metricName: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions across all business units', from: 0, to: 100, current: 75, status: 'on-track' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Elena Schoeman',
  },

  // ============================================
  // Global OKR 2 - Talent Development
  // ============================================
  {
    id: 'global-2',
    displayId: 'OKR-2',
    objective: 'Build a high performing GBS team that becomes a KHC talent pipeline',
    keyResults: [
      { id: 'kr-2-1', metricName: 'Top talent', from: 10, to: 30, current: 24, status: 'on-track' },
      { id: 'kr-2-2', metricName: 'Adherence to agreed Finance WoW, measured through cycle reviews and stakeholder feedback', from: 45, to: 65, current: 52, status: 'progressing' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Mariana Avila',
  },
  {
    id: 'child-2-1',
    objective: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions across all regions and business units', // Very long
    parentId: 'global-2',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-2-1-1', metricName: 'Savings', from: 10, to: 30 }, // Very short
      { id: 'kr-2-1-2', metricName: 'Team engagement score improvement', from: 19, to: 25 }, // Medium
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Sanjay Dora',
  },
  {
    id: 'child-2-2',
    objective: 'Grow talent', // Very short
    parentId: 'global-2',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-2-2-1', metricName: 'Employees promoted to senior roles within organization demonstrating clear career progression pathways', from: 10, to: 40 }, // Long
      { id: 'kr-2-2-2', metricName: 'Revenue', from: 10, to: 20 }, // Very short
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Thiago Pinheiro',
  },
  {
    id: 'child-2-3',
    objective: 'Build leadership capabilities across all levels', // Medium
    parentId: 'global-2',
    area: 'GBS Onshore',
    keyResults: [
      { id: 'kr-2-3-1', metricName: 'Leaders trained', from: 0, to: 50 }, // Short
      { id: 'kr-2-3-2', metricName: 'Succession readiness', from: 30, to: 80 }, // Short
      { id: 'kr-2-3-3', metricName: 'Internal mobility rate tracking career moves across departments and functions measured quarterly', from: 15, to: 35 }, // Long
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Amanda Jones',
  },

  // ============================================
  // Global OKR 3 - Business Partnership
  // ============================================
  {
    id: 'global-3',
    displayId: 'OKR-3',
    objective: 'Become a trusted Business Partner by delivering strong operational results and top-tier stakeholder NPS',
    keyResults: [
      { id: 'kr-3-1', metricName: 'Stakeholder NPS', from: 40, to: 70, current: 62, status: 'on-track' },
      { id: 'kr-3-2', metricName: 'All critical payroll controls documented, tested, and signed off', from: 60, to: 85, current: 68, status: 'off-track' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Jack Shu',
  },
  {
    id: 'child-3-1',
    objective: 'Enhance stakeholder engagement', // Short
    parentId: 'global-3',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-3-1-1', metricName: 'Stakeholder satisfaction score measured through quarterly surveys and feedback sessions with key business partners', from: 10, to: 30 }, // Very long
      { id: 'kr-3-1-2', metricName: 'Response time', from: 19, to: 25 }, // Short
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Alex Komrakov',
  },
  {
    id: 'child-3-2',
    objective: 'Drive operational excellence through continuous improvement initiatives and best practice implementation across all service delivery teams', // Very long
    parentId: 'global-3',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-3-2-1', metricName: 'SLA', from: 10, to: 40, current: 35, status: 'on-track' },
      { id: 'kr-3-2-2', metricName: 'CSAT', from: 10, to: 20, current: 14, status: 'progressing' },
      { id: 'kr-3-2-3', metricName: 'First contact resolution rate', from: 60, to: 90, current: 72, status: 'progressing' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Elena Schoeman',
  },
  {
    id: 'child-3-3',
    objective: 'Reduce escalations', // Very short
    parentId: 'global-3',
    area: 'Capabilities/Tech',
    keyResults: [
      { id: 'kr-3-3-1', metricName: 'Escalation rate', from: 25, to: 10 }, // Short
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Dylan Jetha',
  },
  {
    id: 'child-3-4',
    objective: 'Improve customer satisfaction and loyalty metrics across all touchpoints by implementing feedback-driven enhancements', // Long
    parentId: 'global-3',
    area: 'GPL',
    keyResults: [
      { id: 'kr-3-4-1', metricName: 'Net Promoter Score improvement across customer segments with focus on strategic accounts', from: 35, to: 65 }, // Long
      { id: 'kr-3-4-2', metricName: 'Retention', from: 85, to: 95 }, // Very short
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Preeti Naval Kumar',
  },

  // ============================================
  // Global OKR 4 - Company Launch
  // ============================================
  {
    id: 'global-4',
    displayId: 'OKR-4',
    objective: 'Launch both companies with a compelling narrative',
    keyResults: [
      { id: 'kr-4-1', metricName: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions', from: 20, to: 60 },
      { id: 'kr-4-2', metricName: 'Media coverage', from: 8, to: 28 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Evan Sams',
  },
  {
    id: 'child-4-1',
    objective: 'Execute communication plan', // Short
    parentId: 'global-4',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-4-1-1', metricName: 'Employee awareness score measured through pulse surveys conducted monthly during transition period', from: 13, to: 30 }, // Long
      { id: 'kr-4-1-2', metricName: 'Comms delivered', from: 14, to: 25 }, // Short
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Preeti Naval Kumar',
  },
  {
    id: 'child-4-2',
    objective: 'Ensure seamless brand transition across all customer-facing channels and internal platforms while maintaining service continuity', // Very long
    parentId: 'global-4',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-4-2-1', metricName: 'Brand consistency score', from: 10, to: 40 }, // Medium
      { id: 'kr-4-2-2', metricName: 'Revenue', from: 10, to: 20 }, // Very short
      { id: 'kr-4-2-3', metricName: 'Customer awareness of new brand identity measured through recognition surveys and social media sentiment analysis', from: 20, to: 80 }, // Very long
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Serge De Vos',
  },
  {
    id: 'child-4-3',
    objective: 'Build excitement', // Very short
    parentId: 'global-4',
    area: 'GBS Onshore',
    keyResults: [
      { id: 'kr-4-3-1', metricName: 'Event attendance', from: 50, to: 90 }, // Short
      { id: 'kr-4-3-2', metricName: 'Social engagement', from: 100, to: 500 }, // Short
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Juan Ramon Triana',
  },

  // ============================================
  // Global OKR 5 - GBS Separation
  // ============================================
  {
    id: 'global-5',
    displayId: 'OKR-5',
    objective: 'Deliver a successful GBS Separation',
    keyResults: [
      { id: 'kr-5-1', metricName: 'Separation milestones', from: 0, to: 100, current: 45, status: 'progressing' },
      { id: 'kr-5-2', metricName: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions', from: 10, to: 40, current: 28, status: 'on-track' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Morne Fouche',
  },
  {
    id: 'child-5-1',
    objective: 'Complete technology migration', // Short
    parentId: 'global-5',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-5-1-1', metricName: 'Systems migrated', from: 10, to: 30, current: 22, status: 'on-track' },
      { id: 'kr-5-1-2', metricName: 'Data integrity validation completion rate across all critical business systems and applications', from: 19, to: 25, current: 20, status: 'off-track' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Thiago Marchi',
  },
  {
    id: 'child-5-2',
    objective: 'Ensure business continuity throughout the separation process with zero critical service interruptions for stakeholders and customers', // Very long
    parentId: 'global-5',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-5-2-1', metricName: 'Uptime', from: 10, to: 40 }, // Very short
      { id: 'kr-5-2-2', metricName: 'Incidents', from: 10, to: 20 }, // Very short
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Eric Ruys',
  },
  {
    id: 'child-5-3',
    objective: 'Finalize legal and compliance requirements for both entities including regulatory filings and contractual obligations', // Long
    parentId: 'global-5',
    area: 'GPL',
    keyResults: [
      { id: 'kr-5-3-1', metricName: 'Contracts reviewed and updated to reflect new organizational structure and legal entity requirements', from: 13, to: 34, current: 30, status: 'on-track' },
      { id: 'kr-5-3-2', metricName: 'Compliance score', from: 24, to: 25, current: 24, status: 'off-track' },
      { id: 'kr-5-3-3', metricName: 'Audit readiness', from: 50, to: 100, current: 85, status: 'on-track' },
    ],
    createdAt: '2026-01-10T19:20:26.372Z',
    owner: 'Juan Ramon Triana',
  },
  {
    id: 'child-5-4',
    objective: 'Train teams', // Very short
    parentId: 'global-5',
    area: 'GBS Onshore',
    keyResults: [
      { id: 'kr-5-4-1', metricName: 'Comprehensive training program completion rate for all affected employees across both new organizations', from: 10, to: 50 }, // Very long
      { id: 'kr-5-4-2', metricName: 'Readiness assessment score for day one operations including process knowledge and system access verification', from: 13, to: 15 }, // Very long
      { id: 'kr-5-4-3', metricName: 'Knowledge transfer', from: 11, to: 100 }, // Short
    ],
    createdAt: '2026-01-11T18:38:15.684Z',
    owner: 'Amanda Jones',
  },
  {
    id: 'child-5-5',
    objective: 'Migrate critical infrastructure', // Short
    parentId: 'global-5',
    area: 'Capabilities/Tech',
    keyResults: [
      { id: 'kr-5-5-1', metricName: 'Infrastructure components successfully transitioned to new environment', from: 14, to: 20 }, // Medium
    ],
    createdAt: '2026-01-12T13:18:49.497Z',
    owner: 'Dylan Jetha',
  },
];
