import { OKR } from './types';

export const seedOKRs: OKR[] = [
  // Global OKR 1
  {
    id: 'global-1',
    displayId: 'OKR-1',
    objective: 'Become the market leader, more innovative and automated processes',
    keyResults: [
      { id: 'kr-1-1', metricName: 'Market Share', from: 10, to: 30 },
      { id: 'kr-1-2', metricName: 'Revenue', from: 13, to: 24 },
      { id: 'kr-1-3', metricName: 'Processes automated', from: 24, to: 35 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },
  {
    id: 'child-1-1',
    objective: 'GCC India / Deliver savings',
    parentId: 'global-1',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-1-1-1', metricName: 'Savings', from: 10, to: 30 },
      { id: 'kr-1-1-2', metricName: 'Automated', from: 19, to: 25 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },
  {
    id: 'child-1-2',
    objective: 'GCC Mexico / Deliver savings',
    parentId: 'global-1',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-1-2-1', metricName: 'Savings', from: 10, to: 40 },
      { id: 'kr-1-2-2', metricName: 'Revenue', from: 10, to: 20 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },

  // Global OKR 2
  {
    id: 'global-2',
    displayId: 'OKR-2',
    objective: 'Build a high performing GBS team that becomes a KHC talent pipeline',
    keyResults: [
      { id: 'kr-2-1', metricName: 'Top talent', from: 10, to: 30 },
      { id: 'kr-2-2', metricName: 'Team Engagement score', from: 45, to: 65 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },
  {
    id: 'child-2-1',
    objective: 'GCC India / Deliver savings',
    parentId: 'global-2',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-2-1-1', metricName: 'Savings', from: 10, to: 30 },
      { id: 'kr-2-1-2', metricName: 'Automated', from: 19, to: 25 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },
  {
    id: 'child-2-2',
    objective: 'GCC Mexico / Deliver savings',
    parentId: 'global-2',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-2-2-1', metricName: 'Savings', from: 10, to: 40 },
      { id: 'kr-2-2-2', metricName: 'Revenue', from: 10, to: 20 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },

  // Global OKR 3
  {
    id: 'global-3',
    displayId: 'OKR-3',
    objective: 'Become a trusted Business Partner by delivering strong operational results and top-tier stakeholder NPS',
    keyResults: [
      { id: 'kr-3-1', metricName: 'Stakeholder NPS', from: 40, to: 70 },
      { id: 'kr-3-2', metricName: 'Operational efficiency', from: 60, to: 85 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },
  {
    id: 'child-3-1',
    objective: 'GCC India / Deliver savings',
    parentId: 'global-3',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-3-1-1', metricName: 'Savings', from: 10, to: 30 },
      { id: 'kr-3-1-2', metricName: 'Automated', from: 19, to: 25 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },
  {
    id: 'child-3-2',
    objective: 'GCC Mexico / Deliver savings',
    parentId: 'global-3',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-3-2-1', metricName: 'Savings', from: 10, to: 40 },
      { id: 'kr-3-2-2', metricName: 'Revenue', from: 10, to: 20 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },

  // Global OKR 4
  {
    id: 'global-4',
    displayId: 'OKR-4',
    objective: 'Launch both companies with a compelling narrative',
    keyResults: [
      { id: 'kr-4-1', metricName: 'Brand awareness', from: 20, to: 60 },
      { id: 'kr-4-2', metricName: 'Media coverage', from: 8, to: 28 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },
  {
    id: 'child-4-1',
    objective: 'GCC India / Deliver savings',
    parentId: 'global-4',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-4-1-1', metricName: 'Savings', from: 13, to: 30 },
      { id: 'kr-4-1-2', metricName: 'Automated', from: 14, to: 25 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },
  {
    id: 'child-4-2',
    objective: 'GCC Mexico / Deliver savings',
    parentId: 'global-4',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-4-2-1', metricName: 'Savings', from: 10, to: 40 },
      { id: 'kr-4-2-2', metricName: 'Revenue', from: 10, to: 20 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },

  // Global OKR 5
  {
    id: 'global-5',
    displayId: 'OKR-5',
    objective: 'Deliver a successful GBS Separation',
    keyResults: [
      { id: 'kr-5-1', metricName: 'Separation milestones', from: 0, to: 100 },
      { id: 'kr-5-2', metricName: 'Cost synergies', from: 10, to: 40 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },
  {
    id: 'child-5-1',
    objective: 'GCC India / Deliver savings',
    parentId: 'global-5',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-5-1-1', metricName: 'Savings', from: 10, to: 30 },
      { id: 'kr-5-1-2', metricName: 'Automated', from: 19, to: 25 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },
  {
    id: 'child-5-2',
    objective: 'GCC Mexico / Deliver savings',
    parentId: 'global-5',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-5-2-1', metricName: 'Savings', from: 10, to: 40 },
      { id: 'kr-5-2-2', metricName: 'Revenue', from: 10, to: 20 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
  },
  {
    id: 'f80256e1-dc8d-4c07-a0dd-3283a2f2fd79',
    objective: 'Deliver excellence',
    parentId: 'global-5',
    area: 'GPL',
    keyResults: [
      { id: 'b4de2b6e-e5f9-4a57-9fa5-f3ef4e1eb615', metricName: 'Market Share', from: 13, to: 34 },
      { id: '654acde8-0135-470b-ae5b-e00cb0824cb7', metricName: 'Revenue', from: 24, to: 25 },
    ],
    createdAt: '2026-01-10T19:20:26.372Z',
  },
  {
    id: '7fdd4d98-b077-4f92-b134-dca0caa0935b',
    objective: 'GPL / Build a high performing GBS team that becomes a KHC  talent pipeline',
    parentId: 'global-5',
    area: 'GBS Onshore',
    keyResults: [
      { id: '1e672e16-a22e-4f69-9ca8-75847d4023c5', metricName: 'Adherence to agreed Finance WoW, measured through cycle reviews and stakeholder feedback ', from: 10, to: 50 },
      { id: '2599c070-a6ec-4d42-869e-210b007f0fc7', metricName: 'All critical payroll controls documented, testd, and signed off', from: 13, to: 15 },
      { id: '71ca0cae-83e2-4b06-85f7-f44b574c55c1', metricName: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions', from: 11, to: 100 },
    ],
    createdAt: '2026-01-11T18:38:15.684Z',
  },
];
