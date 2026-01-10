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
    createdAt: new Date().toISOString(),
  },
  {
    id: 'child-1-1',
    objective: 'GCC India / Deliver savings',
    parentId: 'global-1',
    keyResults: [
      { id: 'kr-1-1-1', metricName: 'Savings', from: 10, to: 30 },
      { id: 'kr-1-1-2', metricName: 'Automated', from: 19, to: 25 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'child-1-2',
    objective: 'GCC Mexico / Deliver savings',
    parentId: 'global-1',
    keyResults: [
      { id: 'kr-1-2-1', metricName: 'Savings', from: 10, to: 40 },
      { id: 'kr-1-2-2', metricName: 'Revenue', from: 10, to: 20 },
    ],
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
  },
  {
    id: 'child-2-1',
    objective: 'GCC India / Deliver savings',
    parentId: 'global-2',
    keyResults: [
      { id: 'kr-2-1-1', metricName: 'Savings', from: 10, to: 30 },
      { id: 'kr-2-1-2', metricName: 'Automated', from: 19, to: 25 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'child-2-2',
    objective: 'GCC Mexico / Deliver savings',
    parentId: 'global-2',
    keyResults: [
      { id: 'kr-2-2-1', metricName: 'Savings', from: 10, to: 40 },
      { id: 'kr-2-2-2', metricName: 'Revenue', from: 10, to: 20 },
    ],
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
  },
  {
    id: 'child-3-1',
    objective: 'GCC India / Deliver savings',
    parentId: 'global-3',
    keyResults: [
      { id: 'kr-3-1-1', metricName: 'Savings', from: 10, to: 30 },
      { id: 'kr-3-1-2', metricName: 'Automated', from: 19, to: 25 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'child-3-2',
    objective: 'GCC Mexico / Deliver savings',
    parentId: 'global-3',
    keyResults: [
      { id: 'kr-3-2-1', metricName: 'Savings', from: 10, to: 40 },
      { id: 'kr-3-2-2', metricName: 'Revenue', from: 10, to: 20 },
    ],
    createdAt: new Date().toISOString(),
  },

  // Global OKR 4
  {
    id: 'global-4',
    displayId: 'OKR-4',
    objective: 'Launch both companies with a compelling narrative',
    keyResults: [
      { id: 'kr-4-1', metricName: 'Brand awareness', from: 20, to: 60 },
      { id: 'kr-4-2', metricName: 'Media coverage', from: 5, to: 25 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'child-4-1',
    objective: 'GCC India / Deliver savings',
    parentId: 'global-4',
    keyResults: [
      { id: 'kr-4-1-1', metricName: 'Savings', from: 10, to: 30 },
      { id: 'kr-4-1-2', metricName: 'Automated', from: 19, to: 25 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'child-4-2',
    objective: 'GCC Mexico / Deliver savings',
    parentId: 'global-4',
    keyResults: [
      { id: 'kr-4-2-1', metricName: 'Savings', from: 10, to: 40 },
      { id: 'kr-4-2-2', metricName: 'Revenue', from: 10, to: 20 },
    ],
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
  },
  {
    id: 'child-5-1',
    objective: 'GCC India / Deliver savings',
    parentId: 'global-5',
    keyResults: [
      { id: 'kr-5-1-1', metricName: 'Savings', from: 10, to: 30 },
      { id: 'kr-5-1-2', metricName: 'Automated', from: 19, to: 25 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'child-5-2',
    objective: 'GCC Mexico / Deliver savings',
    parentId: 'global-5',
    keyResults: [
      { id: 'kr-5-2-1', metricName: 'Savings', from: 10, to: 40 },
      { id: 'kr-5-2-2', metricName: 'Revenue', from: 10, to: 20 },
    ],
    createdAt: new Date().toISOString(),
  },
];
