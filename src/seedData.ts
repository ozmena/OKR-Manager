import { OKR } from './types';

const ITEMS = ['direction', 'stakeholder-alignment', 'cascading', 'understanding', 'measurability', 'prioritization', 'ownership', 'strategic-thinking'];
function qc(checked: number[]) {
  return ITEMS.map((id, i) => ({ id, checked: checked.includes(i) }));
}

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
    actions: [
      { id: 'act-g1-1', text: 'Review Q1 market share targets with regional leads', owner: 'Hardik Bhatt', dueDate: '2026-01-20', completed: true, completedAt: '2026-01-20T16:00:00Z', createdAt: '2026-01-10T08:00:00Z' },
      { id: 'act-g1-2', text: 'Align automation roadmap with IT and Operations', owner: 'Hardik Bhatt', dueDate: '2026-02-01', completed: false, createdAt: '2026-01-12T09:00:00Z' },
      { id: 'act-g1-3', text: 'Present innovation pipeline to executive committee', owner: 'Elena Schoeman', dueDate: '2026-03-15', completed: false, createdAt: '2026-01-15T10:00:00Z' },
      { id: 'act-g1-4', text: 'Conduct competitive landscape analysis for top 3 markets', owner: 'Deepa Abi', dueDate: '2026-03-30', completed: false, createdAt: '2026-01-18T11:00:00Z' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Hardik Bhatt',
    status: 'progressing',
  },
  {
    id: 'child-1-1',
    objective: 'Deliver savings',
    parentId: 'global-1',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-1-1-1', metricName: 'Cost reduction', from: 10, to: 30, current: 28, status: 'on-track' },
      { id: 'kr-1-1-2', metricName: 'Automated processes', from: 19, to: 25, current: 21, status: 'progressing' },
    ],
    qualityChecklist: qc([0,1,2,3,4,5,6,7]), // 8/8
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Deepa Abi',
    status: 'on-track',
  },
  {
    id: 'child-1-2',
    objective: 'Become a trusted Business Partner by delivering strong operational results and top tier stakeholder NPS through consistent excellence',
    parentId: 'global-1',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-1-2-1', metricName: 'Adherence to agreed Finance WoW, measured through cycle reviews and stakeholder feedback across all regional teams', from: 10, to: 40, current: 32, status: 'on-track' },
      { id: 'kr-1-2-2', metricName: 'Revenue', from: 10, to: 20, current: 12, status: 'off-track' },
      { id: 'kr-1-2-3', metricName: 'NPS', from: 40, to: 75, current: 58, status: 'progressing' },
    ],
    actions: [
      { id: 'act-1-2-1', text: 'Finalize Q1 revenue forecast and present to leadership', owner: 'Juan Montoya', dueDate: '2026-01-25', completed: true, completedAt: '2026-01-24T14:00:00Z', createdAt: '2026-01-10T10:00:00Z' },
      { id: 'act-1-2-2', text: 'Schedule NPS deep-dive workshop with regional teams', owner: 'Juan Montoya', dueDate: '2026-02-01', completed: false, createdAt: '2026-01-12T09:00:00Z' },
      { id: 'act-1-2-3', text: 'Launch stakeholder feedback survey for Q1', owner: 'Elena Schoeman', dueDate: '2026-03-01', completed: false, createdAt: '2026-01-15T11:00:00Z' },
    ],
    qualityChecklist: qc([0,1,2,3,4,6,7]), // 7/8
    challenges: 'Stakeholder alignment across regions is taking longer than expected. Different teams have conflicting priorities which slows down decision-making.',
    needs: 'Need cross-functional support from Finance and Operations leadership to align on shared KPIs and reporting cadence.',
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Juan Montoya',
    status: 'progressing',
  },
  {
    id: 'child-1-3',
    objective: 'Improve process efficiency',
    parentId: 'global-1',
    area: 'GPL',
    keyResults: [
      { id: 'kr-1-3-1', metricName: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions across all business units', from: 0, to: 100, current: 75, status: 'on-track' },
    ],
    qualityChecklist: qc([0,2,4,6,7]), // 5/8
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Elena Schoeman',
    status: 'on-track',
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
    actions: [
      { id: 'act-g2-1', text: 'Define talent pipeline criteria with HR leadership', owner: 'Mariana Avila', dueDate: '2026-01-25', completed: true, completedAt: '2026-01-25T14:00:00Z', createdAt: '2026-01-08T09:00:00Z' },
      { id: 'act-g2-2', text: 'Launch GBS-wide skills assessment survey', owner: 'Mariana Avila', dueDate: '2026-01-31', completed: false, createdAt: '2026-01-10T10:00:00Z' },
      { id: 'act-g2-3', text: 'Set up quarterly talent review board with business partners', owner: 'Amanda Jones', dueDate: '2026-03-20', completed: false, createdAt: '2026-01-14T11:00:00Z' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Mariana Avila',
    status: 'on-track',
  },
  {
    id: 'child-2-1',
    objective: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions across all regions and business units',
    parentId: 'global-2',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-2-1-1', metricName: 'Savings', from: 10, to: 30, current: 15, status: 'progressing' },
      { id: 'kr-2-1-2', metricName: 'Team engagement score improvement', from: 19, to: 25, current: 22, status: 'on-track' },
    ],
    qualityChecklist: qc([0,4,6]), // 3/8
    actions: [
      { id: 'act-2-1-1', text: 'Map decision rights for SC governance framework', owner: 'Sanjay Dora', dueDate: '2026-01-25', completed: false, createdAt: '2026-01-08T09:00:00Z' },
      { id: 'act-2-1-2', text: 'Draft RACI matrix for cross-functional forums', owner: 'Sanjay Dora', dueDate: '2026-03-10', completed: false, createdAt: '2026-01-12T10:00:00Z' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Sanjay Dora',
    status: 'progressing',
  },
  {
    id: 'child-2-2',
    objective: 'Grow talent',
    parentId: 'global-2',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-2-2-1', metricName: 'Employees promoted to senior roles within organization demonstrating clear career progression pathways', from: 10, to: 40, current: 22, status: 'progressing' },
      { id: 'kr-2-2-2', metricName: 'Revenue', from: 10, to: 20, current: 14, status: 'off-track' },
    ],
    qualityChecklist: qc([0,1,2,3,4,5,6]), // 7/8
    actions: [
      { id: 'act-2-2-1', text: 'Launch mentorship pairing program for high-potential employees', owner: 'Thiago Pinheiro', dueDate: '2026-02-01', completed: true, completedAt: '2026-02-01T15:00:00Z', createdAt: '2026-01-10T08:00:00Z' },
      { id: 'act-2-2-2', text: 'Set up quarterly talent review cadence with leadership', owner: 'Thiago Pinheiro', dueDate: '2026-03-15', completed: false, createdAt: '2026-01-14T11:00:00Z' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Thiago Pinheiro',
    status: 'off-track',
  },
  {
    id: 'child-2-3',
    objective: 'Build leadership capabilities across all levels',
    parentId: 'global-2',
    area: 'GBS Onshore',
    keyResults: [
      { id: 'kr-2-3-1', metricName: 'Leaders trained', from: 0, to: 50, current: 28, status: 'on-track' },
      { id: 'kr-2-3-2', metricName: 'Succession readiness', from: 30, to: 80, current: 48, status: 'on-track' },
      { id: 'kr-2-3-3', metricName: 'Internal mobility rate tracking career moves across departments and functions measured quarterly', from: 15, to: 35, current: 21, status: 'progressing' },
    ],
    qualityChecklist: qc([0,1,2,3,4,5,6,7]), // 8/8
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Amanda Jones',
    status: 'on-track',
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
    actions: [
      { id: 'act-g3-1', text: 'Kick off NPS baseline measurement across all regions', owner: 'Jack Shu', dueDate: '2026-02-05', completed: true, completedAt: '2026-02-05T15:00:00Z', createdAt: '2026-01-12T08:00:00Z' },
      { id: 'act-g3-2', text: 'Establish payroll controls testing cadence', owner: 'Jack Shu', dueDate: '2026-02-10', completed: false, createdAt: '2026-01-14T09:00:00Z' },
      { id: 'act-g3-3', text: 'Draft stakeholder communication plan for Q2', owner: 'Alex Komrakov', dueDate: '2026-04-01', completed: false, createdAt: '2026-01-18T10:00:00Z' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Jack Shu',
    status: 'progressing',
  },
  {
    id: 'child-3-1',
    objective: 'Enhance stakeholder engagement',
    parentId: 'global-3',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-3-1-1', metricName: 'Stakeholder satisfaction score measured through quarterly surveys and feedback sessions with key business partners', from: 10, to: 30 },
      { id: 'kr-3-1-2', metricName: 'Response time', from: 19, to: 25 },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Alex Komrakov',
  },
  {
    id: 'child-3-2',
    objective: 'Drive operational excellence through continuous improvement initiatives and best practice implementation across all service delivery teams',
    parentId: 'global-3',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-3-2-1', metricName: 'SLA', from: 10, to: 40, current: 35, status: 'on-track' },
      { id: 'kr-3-2-2', metricName: 'CSAT', from: 10, to: 20, current: 14, status: 'progressing' },
      { id: 'kr-3-2-3', metricName: 'First contact resolution rate', from: 60, to: 90, current: 72, status: 'progressing' },
    ],
    qualityChecklist: qc([0,1,2,4,5,6]), // 6/8
    actions: [
      { id: 'act-3-2-1', text: 'Audit current SLA compliance across all teams', owner: 'Elena Schoeman', dueDate: '2026-01-20', completed: false, createdAt: '2026-01-05T08:00:00Z' },
      { id: 'act-3-2-2', text: 'Roll out first-contact resolution training program', owner: 'Elena Schoeman', dueDate: '2026-02-05', completed: false, createdAt: '2026-01-10T10:00:00Z' },
      { id: 'act-3-2-3', text: 'Set up automated CSAT survey after ticket resolution', owner: 'Dylan Jetha', dueDate: '2026-01-31', completed: true, completedAt: '2026-01-28T16:30:00Z', createdAt: '2026-01-08T09:00:00Z' },
      { id: 'act-3-2-4', text: 'Publish best practices playbook for service delivery', owner: 'Elena Schoeman', dueDate: '2026-03-15', completed: false, createdAt: '2026-01-15T14:00:00Z' },
    ],
    challenges: 'SLA measurement is inconsistent across teams. Some regions define SLA differently, making it hard to benchmark and compare.',
    needs: 'Need a unified SLA tracking tool and standardized definitions across all service delivery regions.',
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Elena Schoeman',
    status: 'on-track',
  },
  {
    id: 'child-3-3',
    objective: 'Reduce escalations',
    parentId: 'global-3',
    area: 'Capabilities/Tech',
    keyResults: [
      { id: 'kr-3-3-1', metricName: 'Escalation rate', from: 25, to: 10, current: 18, status: 'progressing' },
    ],
    qualityChecklist: qc([0,1,4,6]), // 4/8
    actions: [
      { id: 'act-3-3-1', text: 'Analyze top 10 escalation root causes from Q4', owner: 'Dylan Jetha', dueDate: '2026-01-28', completed: false, createdAt: '2026-01-06T09:00:00Z' },
      { id: 'act-3-3-2', text: 'Implement escalation auto-routing rules in ticketing system', owner: 'Dylan Jetha', dueDate: '2026-02-10', completed: true, completedAt: '2026-02-03T14:00:00Z', createdAt: '2026-01-10T10:00:00Z' },
      { id: 'act-3-3-3', text: 'Train L1 support on new triage protocol', owner: 'Alex Komrakov', dueDate: '2026-03-01', completed: false, createdAt: '2026-01-15T11:00:00Z' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Dylan Jetha',
    status: 'progressing',
  },
  {
    id: 'child-3-4',
    objective: 'Improve customer satisfaction and loyalty metrics across all touchpoints by implementing feedback-driven enhancements',
    parentId: 'global-3',
    area: 'GPL',
    keyResults: [
      { id: 'kr-3-4-1', metricName: 'Net Promoter Score improvement across customer segments with focus on strategic accounts', from: 35, to: 65 },
      { id: 'kr-3-4-2', metricName: 'Retention', from: 85, to: 95 },
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
      { id: 'kr-4-1', metricName: 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions', from: 20, to: 60, current: 32, status: 'progressing' },
      { id: 'kr-4-2', metricName: 'Media coverage', from: 8, to: 28, current: 14, status: 'off-track' },
    ],
    actions: [
      { id: 'act-g4-1', text: 'Finalize brand narrative and key messaging framework', owner: 'Evan Sams', dueDate: '2026-01-28', completed: false, createdAt: '2026-01-08T09:00:00Z' },
      { id: 'act-g4-2', text: 'Brief PR agency on launch timeline and milestones', owner: 'Evan Sams', dueDate: '2026-03-10', completed: false, createdAt: '2026-01-12T10:00:00Z' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Evan Sams',
    status: 'off-track',
  },
  {
    id: 'child-4-1',
    objective: 'Execute communication plan',
    parentId: 'global-4',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-4-1-1', metricName: 'Employee awareness score measured through pulse surveys conducted monthly during transition period', from: 13, to: 30, current: 20, status: 'progressing' },
      { id: 'kr-4-1-2', metricName: 'Comms delivered', from: 14, to: 25, current: 18, status: 'off-track' },
    ],
    qualityChecklist: qc([0,4]), // 2/8
    actions: [
      { id: 'act-4-1-1', text: 'Send first all-hands transition update email', owner: 'Preeti Naval Kumar', dueDate: '2026-02-01', completed: false, createdAt: '2026-01-12T09:00:00Z' },
      { id: 'act-4-1-2', text: 'Create FAQ document for employee questions about the transition', owner: 'Preeti Naval Kumar', dueDate: '2026-02-28', completed: false, createdAt: '2026-01-15T10:00:00Z' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Preeti Naval Kumar',
    status: 'progressing',
  },
  {
    id: 'child-4-2',
    objective: 'Ensure seamless brand transition across all customer-facing channels and internal platforms while maintaining service continuity',
    parentId: 'global-4',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-4-2-1', metricName: 'Brand consistency score', from: 10, to: 40, current: 18, status: 'off-track' },
      { id: 'kr-4-2-2', metricName: 'Revenue', from: 10, to: 20, current: 13, status: 'off-track' },
      { id: 'kr-4-2-3', metricName: 'Customer awareness of new brand identity measured through recognition surveys and social media sentiment analysis', from: 20, to: 80, current: 32, status: 'progressing' },
    ],
    qualityChecklist: qc([0,1,2,4,6]), // 5/8
    actions: [
      { id: 'act-4-2-1', text: 'Complete brand asset migration checklist', owner: 'Serge De Vos', dueDate: '2026-01-30', completed: true, completedAt: '2026-01-30T12:00:00Z', createdAt: '2026-01-08T08:00:00Z' },
      { id: 'act-4-2-2', text: 'Brief customer-facing teams on new brand guidelines', owner: 'Serge De Vos', dueDate: '2026-03-05', completed: false, createdAt: '2026-01-14T09:00:00Z' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Serge De Vos',
    status: 'off-track',
  },
  {
    id: 'child-4-3',
    objective: 'Build excitement',
    parentId: 'global-4',
    area: 'GBS Onshore',
    keyResults: [
      { id: 'kr-4-3-1', metricName: 'Event attendance', from: 50, to: 90 },
      { id: 'kr-4-3-2', metricName: 'Social engagement', from: 100, to: 500 },
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
    actions: [
      { id: 'act-g5-1', text: 'Complete separation readiness checklist for all workstreams', owner: 'Morne Fouche', dueDate: '2026-02-01', completed: true, completedAt: '2026-02-01T17:00:00Z', createdAt: '2026-01-10T08:00:00Z' },
      { id: 'act-g5-2', text: 'Secure sign-off on Day 1 operating model', owner: 'Morne Fouche', dueDate: '2026-02-08', completed: false, createdAt: '2026-01-12T09:00:00Z' },
      { id: 'act-g5-3', text: 'Conduct end-to-end separation dry run', owner: 'Thiago Marchi', dueDate: '2026-03-25', completed: false, createdAt: '2026-01-15T10:00:00Z' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Morne Fouche',
    status: 'on-track',
  },
  {
    id: 'child-5-1',
    objective: 'Complete technology migration',
    parentId: 'global-5',
    area: 'GCC India',
    keyResults: [
      { id: 'kr-5-1-1', metricName: 'Systems migrated', from: 10, to: 30, current: 22, status: 'on-track' },
      { id: 'kr-5-1-2', metricName: 'Data integrity validation completion rate across all critical business systems and applications', from: 19, to: 25, current: 20, status: 'off-track' },
    ],
    qualityChecklist: qc([0,1,2,3,4,5,7]), // 7/8
    actions: [
      { id: 'act-5-1-1', text: 'Complete data migration dry-run for ERP system', owner: 'Thiago Marchi', dueDate: '2026-01-15', completed: false, createdAt: '2026-01-05T08:00:00Z' },
      { id: 'act-5-1-2', text: 'Validate data integrity checksums for batch 1', owner: 'Thiago Marchi', dueDate: '2026-01-28', completed: true, completedAt: '2026-01-27T11:00:00Z', createdAt: '2026-01-10T09:00:00Z' },
      { id: 'act-5-1-3', text: 'Coordinate downtime window with infrastructure team', owner: 'Dylan Jetha', dueDate: '2026-02-20', completed: false, createdAt: '2026-01-12T14:00:00Z' },
    ],
    challenges: 'Legacy system complexity is higher than estimated. Some integrations have undocumented dependencies that surface during migration testing.',
    needs: 'Need additional vendor support for the legacy ERP decommissioning and extended access to staging environments for parallel testing.',
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Thiago Marchi',
    status: 'progressing',
  },
  {
    id: 'child-5-2',
    objective: 'Ensure business continuity throughout the separation process with zero critical service interruptions for stakeholders and customers',
    parentId: 'global-5',
    area: 'GCC Mexico',
    keyResults: [
      { id: 'kr-5-2-1', metricName: 'Uptime', from: 10, to: 40, current: 28, status: 'progressing' },
      { id: 'kr-5-2-2', metricName: 'Incidents', from: 10, to: 20, current: 15, status: 'off-track' },
    ],
    qualityChecklist: qc([0,2,6]), // 3/8
    actions: [
      { id: 'act-5-2-1', text: 'Document critical service dependencies and failover paths', owner: 'Eric Ruys', dueDate: '2026-01-20', completed: false, createdAt: '2026-01-05T09:00:00Z' },
      { id: 'act-5-2-2', text: 'Run failover test for primary services', owner: 'Eric Ruys', dueDate: '2026-02-25', completed: false, createdAt: '2026-01-12T10:00:00Z' },
    ],
    createdAt: '2026-01-10T17:15:11.172Z',
    owner: 'Eric Ruys',
    status: 'off-track',
  },
  {
    id: 'child-5-3',
    objective: 'Finalize legal and compliance requirements for both entities including regulatory filings and contractual obligations',
    parentId: 'global-5',
    area: 'GPL',
    keyResults: [
      { id: 'kr-5-3-1', metricName: 'Contracts reviewed and updated to reflect new organizational structure and legal entity requirements', from: 13, to: 34, current: 30, status: 'on-track' },
      { id: 'kr-5-3-2', metricName: 'Compliance score', from: 24, to: 25, current: 24, status: 'off-track' },
      { id: 'kr-5-3-3', metricName: 'Audit readiness', from: 50, to: 100, current: 85, status: 'on-track' },
    ],
    qualityChecklist: qc([0,1,2,3,4,5,6,7]), // 8/8
    actions: [
      { id: 'act-5-3-1', text: 'Submit regulatory filings for new entity A', owner: 'Juan Ramon Triana', dueDate: '2026-01-30', completed: true, completedAt: '2026-01-29T10:00:00Z', createdAt: '2026-01-10T08:00:00Z' },
      { id: 'act-5-3-2', text: 'Review vendor contracts for entity reassignment', owner: 'Juan Ramon Triana', dueDate: '2026-02-01', completed: false, createdAt: '2026-01-10T08:30:00Z' },
      { id: 'act-5-3-3', text: 'Conduct internal audit readiness assessment', owner: 'Amanda Jones', dueDate: '2026-02-28', completed: false, createdAt: '2026-01-15T09:00:00Z' },
    ],
    challenges: 'Regulatory timeline for entity B filing is uncertain due to pending government review. This could delay the overall separation schedule.',
    needs: 'Need additional legal counsel bandwidth to handle parallel filings across multiple jurisdictions.',
    createdAt: '2026-01-10T19:20:26.372Z',
    owner: 'Juan Ramon Triana',
    status: 'on-track',
  },
  {
    id: 'child-5-4',
    objective: 'Train teams',
    parentId: 'global-5',
    area: 'GBS Onshore',
    keyResults: [
      { id: 'kr-5-4-1', metricName: 'Comprehensive training program completion rate for all affected employees across both new organizations', from: 10, to: 50, current: 30, status: 'progressing' },
      { id: 'kr-5-4-2', metricName: 'Readiness assessment score for day one operations including process knowledge and system access verification', from: 13, to: 15, current: 14, status: 'on-track' },
      { id: 'kr-5-4-3', metricName: 'Knowledge transfer', from: 11, to: 100, current: 45, status: 'progressing' },
    ],
    qualityChecklist: qc([0,1,2,3,4,6]), // 6/8
    actions: [
      { id: 'act-5-4-1', text: 'Complete training curriculum design for both entities', owner: 'Amanda Jones', dueDate: '2026-02-05', completed: true, completedAt: '2026-02-05T16:00:00Z', createdAt: '2026-01-10T08:00:00Z' },
      { id: 'act-5-4-2', text: 'Schedule first wave of team training sessions', owner: 'Amanda Jones', dueDate: '2026-03-01', completed: false, createdAt: '2026-01-15T09:00:00Z' },
    ],
    createdAt: '2026-01-11T18:38:15.684Z',
    owner: 'Amanda Jones',
    status: 'progressing',
  },
  {
    id: 'child-5-5',
    objective: 'Migrate critical infrastructure',
    parentId: 'global-5',
    area: 'Capabilities/Tech',
    keyResults: [
      { id: 'kr-5-5-1', metricName: 'Infrastructure components successfully transitioned to new environment', from: 14, to: 20 },
    ],
    createdAt: '2026-01-12T13:18:49.497Z',
    owner: 'Dylan Jetha',
  },
];
