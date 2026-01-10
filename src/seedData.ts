import { OKR } from './types';

export const seedOKRs: OKR[] = [
  {
    id: 'global-1',
    objective: 'Become the market leader',
    keyResults: [
      { id: 'kr-1-1', metricName: 'Market Share', from: 10, to: 30 },
      { id: 'kr-1-2', metricName: 'Revenue', from: 13, to: 24 },
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
  {
    id: 'global-2',
    objective: 'Build a high performing GBS team that becomes a KHC talent pipeline',
    keyResults: [
      { id: 'kr-2-1', metricName: 'Top talent', from: 10, to: 30 },
      { id: 'kr-2-2', metricName: 'Team Engagement score', from: 45, to: 65 },
    ],
    createdAt: new Date().toISOString(),
  },
];
