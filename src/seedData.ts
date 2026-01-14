import { OKR } from './types';

export const seedOKRs: OKR[] = [
  // Global OKR 1
  {
    id: 'global-1',
    displayId: 'OKR-1',
    objective: 'Become the market leader, more innovative and automated processes',
    keyResults: [
      { id: 'kr-1-1', metricName: 'Market Share', from: 10, to: 30 },
      { id: 'kr-1-2', metricName: 'Adherence to agreed Finance WoW, measured through cycle reviews and stakeholder feedback ', from: 13, to: 24 },
      { id: 'kr-1-3', metricName: 'Processes automated', from: 24, to: 35 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Hardik Bhatt',
  },
  {
    id: 'child-1-1',
    objective: 'Become a trusted Business Partner by delivering strong operational results and top-tier stakeholder NPS',
    parentId: 'global-1',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-1-1-1', metricName: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions', from: 10, to: 30 },
      { id: 'kr-1-1-2', metricName: 'Automated', from: 19, to: 25 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Deepa Abi',
  },
  {
    id: 'child-1-2',
    objective: 'Become a trusted Business Partner by delivering strong operational results and top tier stakeholder NPS',
    parentId: 'global-1',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-1-2-1', metricName: 'Adherence to agreed Finance WoW, measured through cycle reviews and stakeholder feedback ', from: 10, to: 40 },
      { id: 'kr-1-2-2', metricName: 'Revenue', from: 10, to: 20 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Juan Montoya',
  },

  // Global OKR 2
  {
    id: 'global-2',
    displayId: 'OKR-2',
    objective: 'Build a high performing GBS team that becomes a KHC talent pipeline',
    keyResults: [
      { id: 'kr-2-1', metricName: 'Top talent', from: 10, to: 30 },
      { id: 'kr-2-2', metricName: 'Adherence to agreed Finance WoW, measured through cycle reviews and stakeholder feedback ', from: 45, to: 65 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Mariana Avila',
  },
  {
    id: 'child-2-1',
    objective: 'Adherence to agreed Finance WoW, measured through cycle reviews and stakeholder feedback',
    parentId: 'global-2',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-2-1-1', metricName: 'Savings', from: 10, to: 30 },
      { id: 'kr-2-1-2', metricName: 'Automated', from: 19, to: 25 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Sanjay Dora',
  },
  {
    id: 'child-2-2',
    objective: 'Become a trusted Business Partner by delivering strong operational results and top-tier stakeholder NPS',
    parentId: 'global-2',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-2-2-1', metricName: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions', from: 10, to: 40 },
      { id: 'kr-2-2-2', metricName: 'Revenue', from: 10, to: 20 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Thiago Pinheiro',
  },

  // Global OKR 3
  {
    id: 'global-3',
    displayId: 'OKR-3',
    objective: 'Become a trusted Business Partner by delivering strong operational results and top-tier stakeholder NPS',
    keyResults: [
      { id: 'kr-3-1', metricName: 'Stakeholder NPS', from: 40, to: 70 },
      { id: 'kr-3-2', metricName: 'All critical payroll controls documented, testd, and signed off', from: 60, to: 85 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Jack Shu',
  },
  {
    id: 'child-3-1',
    objective: 'Deliver savings',
    parentId: 'global-3',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-3-1-1', metricName: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions', from: 10, to: 30 },
      { id: 'kr-3-1-2', metricName: 'All critical payroll controls documented, testd, and signed off', from: 19, to: 25 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Alex Komrakov',
  },
  {
    id: 'child-3-2',
    objective: 'Become the market leader',
    parentId: 'global-3',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-3-2-1', metricName: 'Savings', from: 10, to: 40 },
      { id: 'kr-3-2-2', metricName: 'All critical payroll controls documented, testd, and signed off', from: 10, to: 20 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Elena Schoeman',
  },

  // Global OKR 4
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
    objective: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions',
    parentId: 'global-4',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-4-1-1', metricName: 'Savings', from: 13, to: 30 },
      { id: 'kr-4-1-2', metricName: 'Automated', from: 14, to: 25 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Preeti Naval Kumar',
  },
  {
    id: 'child-4-2',
    objective: 'Deliver savings',
    parentId: 'global-4',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-4-2-1', metricName: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions', from: 10, to: 40 },
      { id: 'kr-4-2-2', metricName: 'Revenue', from: 10, to: 20 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Serge De Vos',
  },

  // Global OKR 5
  {
    id: 'global-5',
    displayId: 'OKR-5',
    objective: 'Deliver a successful GBS Separation',
    keyResults: [
      { id: 'kr-5-1', metricName: 'Separation milestones', from: 0, to: 100 },
      { id: 'kr-5-2', metricName: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions', from: 10, to: 40 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Morne Fouche',
  },
  {
    id: 'child-5-1',
    objective: 'Become the market leader, more innovative and automated processes',
    parentId: 'global-5',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-5-1-1', metricName: 'Savings', from: 10, to: 30 },
      { id: 'kr-5-1-2', metricName: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions', from: 19, to: 25 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Thiago Marchi',
  },
  {
    id: 'child-5-2',
    objective: 'Adherence to agreed Finance WoW, measured through cycle reviews and stakeholder feedback',
    parentId: 'global-5',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-5-2-1', metricName: 'Savings', from: 10, to: 40 },
      { id: 'kr-5-2-2', metricName: 'Revenue', from: 10, to: 20 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Eric Ruys',
  },
  {
    id: 'f80256e1-dc8d-4c07-a0dd-3283a2f2fd79',
    objective: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions',
    parentId: 'global-5',
    area: 'GPL',
    keyResults: [
      { id: 'b4de2b6e-e5f9-4a57-9fa5-f3ef4e1eb615', metricName: 'Market Share', from: 13, to: 34 },
      { id: '654acde8-0135-470b-ae5b-e00cb0824cb7', metricName: 'Revenue', from: 24, to: 25 },
    ],
    createdAt: '2026-01-10T19:20:26.372Z',
    owner: 'Juan Ramon Triana',
  },
  {
    id: '7fdd4d98-b077-4f92-b134-dca0caa0935b',
    objective: 'Build a high performing GBS team that becomes a KHC  talent pipeline',
    parentId: 'global-5',
    area: 'GBS Onshore',
    keyResults: [
      { id: '1e672e16-a22e-4f69-9ca8-75847d4023c5', metricName: 'Adherence to agreed Finance WoW, measured through cycle reviews and stakeholder feedback ', from: 10, to: 50 },
      { id: '2599c070-a6ec-4d42-869e-210b007f0fc7', metricName: 'All critical payroll controls documented, testd, and signed off', from: 13, to: 15 },
      { id: '71ca0cae-83e2-4b06-85f7-f44b574c55c1', metricName: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions', from: 11, to: 100 },
    ],
    createdAt: '2026-01-11T18:38:15.684Z',
    owner: 'Amanda Jones',
  },
  {
    id: 'ba10e094-b8c9-42ab-a26f-85cf05293123',
    objective: 'All critical payroll controls documented, testd, and signed off',
    keyResults: [
      { id: 'cd2895e1-d659-4190-b360-776fd0a66d46', metricName: 'Market share captured', from: 14, to: 20 },
    ],
    createdAt: '2026-01-12T13:18:49.497Z',
    parentId: 'global-5',
    area: 'Capabilities/Tech',
    owner: 'Dylan Jetha',
  },
];
