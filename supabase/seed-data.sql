-- Seed Data Migration for OKR App
-- Run this in Supabase SQL Editor after creating the tables

-- Clear existing data (optional - remove these lines if you want to keep existing data)
DELETE FROM actions;
DELETE FROM quality_checklist;
DELETE FROM key_results;
DELETE FROM okrs;

-- ============================================
-- Global OKR 1 - Market Leadership
-- ============================================
INSERT INTO okrs (id, display_id, objective, created_at, parent_id, area, owner, status, challenges, needs, comments)
VALUES
  ('00000000-0000-4000-a000-000000000001', 'OKR-1', 'Become the market leader, more innovative and automated processes', '2026-01-10T17:15:11.172Z', NULL, NULL, 'Hardik Bhatt', 'progressing', E'Feb 14 \u2014 Budget approval delayed, waiting on procurement.\nFeb 3 \u2014 Team capacity issue for Q1 rollout.', 'Feb 14 — Need sign-off on budget by Feb 21.', 'Feb 14 — Agreed to escalate to leadership sync. Owner to prepare one-pager.');

INSERT INTO key_results (id, okr_id, metric_name, from_value, to_value, current_value, status, sort_order)
VALUES
  ('00000000-0000-4000-b001-000000000001', '00000000-0000-4000-a000-000000000001', 'Market Share', 10, 30, 22, 'on-track', 0),
  ('00000000-0000-4000-b001-000000000002', '00000000-0000-4000-a000-000000000001', 'Adherence to agreed Finance WoW, measured through cycle reviews and stakeholder feedback', 13, 24, 17, 'progressing', 1),
  ('00000000-0000-4000-b001-000000000003', '00000000-0000-4000-a000-000000000001', 'Processes automated', 24, 35, 26, 'off-track', 2);

-- Actions for Global OKR 1
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c001-000000000001', '00000000-0000-4000-a000-000000000001', 'Review Q1 market share targets with regional leads', 'Hardik Bhatt', '2026-01-20', TRUE, '2026-01-20T16:00:00Z', '2026-01-10T08:00:00Z'),
  ('00000000-0000-4000-c001-000000000002', '00000000-0000-4000-a000-000000000001', 'Align automation roadmap with IT and Operations', 'Hardik Bhatt', '2026-02-01', FALSE, NULL, '2026-01-12T09:00:00Z'),
  ('00000000-0000-4000-c001-000000000003', '00000000-0000-4000-a000-000000000001', 'Present innovation pipeline to executive committee', 'Elena Schoeman', '2026-03-15', FALSE, NULL, '2026-01-15T10:00:00Z'),
  ('00000000-0000-4000-c001-000000000004', '00000000-0000-4000-a000-000000000001', 'Conduct competitive landscape analysis for top 3 markets', 'Deepa Abi', '2026-03-30', FALSE, NULL, '2026-01-18T11:00:00Z');

-- Child OKRs for Global 1
INSERT INTO okrs (id, display_id, objective, created_at, parent_id, area, owner, status, challenges, needs)
VALUES
  ('00000000-0000-4000-a001-000000000001', NULL, 'Deliver savings', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000001', 'GCC India', 'Deepa Abi', 'on-track', NULL, NULL),
  ('00000000-0000-4000-a001-000000000002', NULL, 'Become a trusted Business Partner by delivering strong operational results and top tier stakeholder NPS through consistent excellence', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000001', 'GCC Mexico', 'Juan Montoya', 'progressing', 'Stakeholder alignment across regions is taking longer than expected. Different teams have conflicting priorities which slows down decision-making.', 'Need cross-functional support from Finance and Operations leadership to align on shared KPIs and reporting cadence.'),
  ('00000000-0000-4000-a001-000000000003', NULL, 'Improve process efficiency', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000001', 'GPL', 'Elena Schoeman', 'on-track', NULL, NULL);

INSERT INTO key_results (id, okr_id, metric_name, from_value, to_value, current_value, status, sort_order)
VALUES
  -- Child 1-1 (GCC India)
  ('00000000-0000-4000-b011-000000000001', '00000000-0000-4000-a001-000000000001', 'Cost reduction', 10, 30, 28, 'on-track', 0),
  ('00000000-0000-4000-b011-000000000002', '00000000-0000-4000-a001-000000000001', 'Automated processes', 19, 25, 21, 'progressing', 1),
  -- Child 1-2 (GCC Mexico)
  ('00000000-0000-4000-b012-000000000001', '00000000-0000-4000-a001-000000000002', 'Adherence to agreed Finance WoW, measured through cycle reviews and stakeholder feedback across all regional teams', 10, 40, 32, 'on-track', 0),
  ('00000000-0000-4000-b012-000000000002', '00000000-0000-4000-a001-000000000002', 'Revenue', 10, 20, 12, 'off-track', 1),
  ('00000000-0000-4000-b012-000000000003', '00000000-0000-4000-a001-000000000002', 'NPS', 40, 75, 58, 'progressing', 2),
  -- Child 1-3 (GPL)
  ('00000000-0000-4000-b013-000000000001', '00000000-0000-4000-a001-000000000003', 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions across all business units', 0, 100, 75, 'on-track', 0);

-- Actions for Child 1-2 (GCC Mexico)
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c012-000000000001', '00000000-0000-4000-a001-000000000002', 'Finalize Q1 revenue forecast and present to leadership', 'Juan Montoya', '2026-01-25', TRUE, '2026-01-24T14:00:00Z', '2026-01-10T10:00:00Z'),
  ('00000000-0000-4000-c012-000000000002', '00000000-0000-4000-a001-000000000002', 'Schedule NPS deep-dive workshop with regional teams', 'Juan Montoya', '2026-02-01', FALSE, NULL, '2026-01-12T09:00:00Z'),
  ('00000000-0000-4000-c012-000000000003', '00000000-0000-4000-a001-000000000002', 'Launch stakeholder feedback survey for Q1', 'Elena Schoeman', '2026-03-01', FALSE, NULL, '2026-01-15T11:00:00Z');

-- ============================================
-- Global OKR 2 - Talent Development
-- ============================================
INSERT INTO okrs (id, display_id, objective, created_at, parent_id, area, owner, status)
VALUES
  ('00000000-0000-4000-a000-000000000002', 'OKR-2', 'Build a high performing GBS team that becomes a KHC talent pipeline', '2026-01-10T17:15:11.172Z', NULL, NULL, 'Mariana Avila', 'on-track');

INSERT INTO key_results (id, okr_id, metric_name, from_value, to_value, current_value, status, sort_order)
VALUES
  ('00000000-0000-4000-b002-000000000001', '00000000-0000-4000-a000-000000000002', 'Top talent', 10, 30, 24, 'on-track', 0),
  ('00000000-0000-4000-b002-000000000002', '00000000-0000-4000-a000-000000000002', 'Adherence to agreed Finance WoW, measured through cycle reviews and stakeholder feedback', 45, 65, 52, 'progressing', 1);

-- Actions for Global OKR 2
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c002-000000000001', '00000000-0000-4000-a000-000000000002', 'Define talent pipeline criteria with HR leadership', 'Mariana Avila', '2026-01-25', TRUE, '2026-01-25T14:00:00Z', '2026-01-08T09:00:00Z'),
  ('00000000-0000-4000-c002-000000000002', '00000000-0000-4000-a000-000000000002', 'Launch GBS-wide skills assessment survey', 'Mariana Avila', '2026-01-31', FALSE, NULL, '2026-01-10T10:00:00Z'),
  ('00000000-0000-4000-c002-000000000003', '00000000-0000-4000-a000-000000000002', 'Set up quarterly talent review board with business partners', 'Amanda Jones', '2026-03-20', FALSE, NULL, '2026-01-14T11:00:00Z');

-- Child OKRs for Global 2
INSERT INTO okrs (id, display_id, objective, created_at, parent_id, area, owner, status)
VALUES
  ('00000000-0000-4000-a002-000000000001', NULL, 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions across all regions and business units', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000002', 'GCC India', 'Sanjay Dora', 'progressing'),
  ('00000000-0000-4000-a002-000000000002', NULL, 'Grow talent', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000002', 'GCC Mexico', 'Thiago Pinheiro', 'off-track'),
  ('00000000-0000-4000-a002-000000000003', NULL, 'Build leadership capabilities across all levels', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000002', 'GBS Onshore', 'Amanda Jones', 'on-track');

INSERT INTO key_results (id, okr_id, metric_name, from_value, to_value, current_value, status, sort_order)
VALUES
  -- Child 2-1 (GCC India)
  ('00000000-0000-4000-b021-000000000001', '00000000-0000-4000-a002-000000000001', 'Savings', 10, 30, 15, 'progressing', 0),
  ('00000000-0000-4000-b021-000000000002', '00000000-0000-4000-a002-000000000001', 'Team engagement score improvement', 19, 25, 22, 'on-track', 1),
  -- Child 2-2 (GCC Mexico)
  ('00000000-0000-4000-b022-000000000001', '00000000-0000-4000-a002-000000000002', 'Employees promoted to senior roles within organization demonstrating clear career progression pathways', 10, 40, 22, 'progressing', 0),
  ('00000000-0000-4000-b022-000000000002', '00000000-0000-4000-a002-000000000002', 'Revenue', 10, 20, 14, 'off-track', 1),
  -- Child 2-3 (GBS Onshore)
  ('00000000-0000-4000-b023-000000000001', '00000000-0000-4000-a002-000000000003', 'Leaders trained', 0, 50, 28, 'on-track', 0),
  ('00000000-0000-4000-b023-000000000002', '00000000-0000-4000-a002-000000000003', 'Succession readiness', 30, 80, 48, 'on-track', 1),
  ('00000000-0000-4000-b023-000000000003', '00000000-0000-4000-a002-000000000003', 'Internal mobility rate tracking career moves across departments and functions measured quarterly', 15, 35, 21, 'progressing', 2);

-- Actions for Child 2-1 (GCC India)
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c021-000000000001', '00000000-0000-4000-a002-000000000001', 'Map decision rights for SC governance framework', 'Sanjay Dora', '2026-01-25', FALSE, NULL, '2026-01-08T09:00:00Z'),
  ('00000000-0000-4000-c021-000000000002', '00000000-0000-4000-a002-000000000001', 'Draft RACI matrix for cross-functional forums', 'Sanjay Dora', '2026-03-10', FALSE, NULL, '2026-01-12T10:00:00Z');

-- Actions for Child 2-2 (GCC Mexico)
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c022-000000000001', '00000000-0000-4000-a002-000000000002', 'Launch mentorship pairing program for high-potential employees', 'Thiago Pinheiro', '2026-02-01', TRUE, '2026-02-01T15:00:00Z', '2026-01-10T08:00:00Z'),
  ('00000000-0000-4000-c022-000000000002', '00000000-0000-4000-a002-000000000002', 'Set up quarterly talent review cadence with leadership', 'Thiago Pinheiro', '2026-03-15', FALSE, NULL, '2026-01-14T11:00:00Z');

-- ============================================
-- Global OKR 3 - Business Partnership
-- ============================================
INSERT INTO okrs (id, display_id, objective, created_at, parent_id, area, owner, status)
VALUES
  ('00000000-0000-4000-a000-000000000003', 'OKR-3', 'Become a trusted Business Partner by delivering strong operational results and top-tier stakeholder NPS', '2026-01-10T17:15:11.172Z', NULL, NULL, 'Jack Shu', 'progressing');

INSERT INTO key_results (id, okr_id, metric_name, from_value, to_value, current_value, status, sort_order)
VALUES
  ('00000000-0000-4000-b003-000000000001', '00000000-0000-4000-a000-000000000003', 'Stakeholder NPS', 40, 70, 62, 'on-track', 0),
  ('00000000-0000-4000-b003-000000000002', '00000000-0000-4000-a000-000000000003', 'All critical payroll controls documented, tested, and signed off', 60, 85, 68, 'off-track', 1);

-- Actions for Global OKR 3
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c003-000000000001', '00000000-0000-4000-a000-000000000003', 'Kick off NPS baseline measurement across all regions', 'Jack Shu', '2026-02-05', TRUE, '2026-02-05T15:00:00Z', '2026-01-12T08:00:00Z'),
  ('00000000-0000-4000-c003-000000000002', '00000000-0000-4000-a000-000000000003', 'Establish payroll controls testing cadence', 'Jack Shu', '2026-02-10', FALSE, NULL, '2026-01-14T09:00:00Z'),
  ('00000000-0000-4000-c003-000000000003', '00000000-0000-4000-a000-000000000003', 'Draft stakeholder communication plan for Q2', 'Alex Komrakov', '2026-04-01', FALSE, NULL, '2026-01-18T10:00:00Z');

-- Child OKRs for Global 3
INSERT INTO okrs (id, display_id, objective, created_at, parent_id, area, owner, status, challenges, needs)
VALUES
  ('00000000-0000-4000-a003-000000000001', NULL, 'Enhance stakeholder engagement', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000003', 'GCC India', 'Alex Komrakov', NULL, NULL, NULL),
  ('00000000-0000-4000-a003-000000000002', NULL, 'Drive operational excellence through continuous improvement initiatives and best practice implementation across all service delivery teams', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000003', 'GCC Mexico', 'Elena Schoeman', 'on-track', 'SLA measurement is inconsistent across teams. Some regions define SLA differently, making it hard to benchmark and compare.', 'Need a unified SLA tracking tool and standardized definitions across all service delivery regions.'),
  ('00000000-0000-4000-a003-000000000003', NULL, 'Reduce escalations', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000003', 'Capabilities/Tech', 'Dylan Jetha', 'progressing', NULL, NULL),
  ('00000000-0000-4000-a003-000000000004', NULL, 'Improve customer satisfaction and loyalty metrics across all touchpoints by implementing feedback-driven enhancements', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000003', 'GPL', 'Preeti Naval Kumar', NULL, NULL, NULL);

INSERT INTO key_results (id, okr_id, metric_name, from_value, to_value, current_value, status, sort_order)
VALUES
  -- Child 3-1 (GCC India) - intentionally no data
  ('00000000-0000-4000-b031-000000000001', '00000000-0000-4000-a003-000000000001', 'Stakeholder satisfaction score measured through quarterly surveys and feedback sessions with key business partners', 10, 30, NULL, NULL, 0),
  ('00000000-0000-4000-b031-000000000002', '00000000-0000-4000-a003-000000000001', 'Response time', 19, 25, NULL, NULL, 1),
  -- Child 3-2 (GCC Mexico)
  ('00000000-0000-4000-b032-000000000001', '00000000-0000-4000-a003-000000000002', 'SLA', 10, 40, 35, 'on-track', 0),
  ('00000000-0000-4000-b032-000000000002', '00000000-0000-4000-a003-000000000002', 'CSAT', 10, 20, 14, 'progressing', 1),
  ('00000000-0000-4000-b032-000000000003', '00000000-0000-4000-a003-000000000002', 'First contact resolution rate', 60, 90, 72, 'progressing', 2),
  -- Child 3-3 (Capabilities/Tech)
  ('00000000-0000-4000-b033-000000000001', '00000000-0000-4000-a003-000000000003', 'Escalation rate', 25, 10, 18, 'progressing', 0),
  -- Child 3-4 (GPL) - intentionally no data
  ('00000000-0000-4000-b034-000000000001', '00000000-0000-4000-a003-000000000004', 'Net Promoter Score improvement across customer segments with focus on strategic accounts', 35, 65, NULL, NULL, 0),
  ('00000000-0000-4000-b034-000000000002', '00000000-0000-4000-a003-000000000004', 'Retention', 85, 95, NULL, NULL, 1);

-- Actions for Child 3-2 (GCC Mexico)
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c032-000000000001', '00000000-0000-4000-a003-000000000002', 'Audit current SLA compliance across all teams', 'Elena Schoeman', '2026-01-20', FALSE, NULL, '2026-01-05T08:00:00Z'),
  ('00000000-0000-4000-c032-000000000002', '00000000-0000-4000-a003-000000000002', 'Roll out first-contact resolution training program', 'Elena Schoeman', '2026-02-05', FALSE, NULL, '2026-01-10T10:00:00Z'),
  ('00000000-0000-4000-c032-000000000003', '00000000-0000-4000-a003-000000000002', 'Set up automated CSAT survey after ticket resolution', 'Dylan Jetha', '2026-01-31', TRUE, '2026-01-28T16:30:00Z', '2026-01-08T09:00:00Z'),
  ('00000000-0000-4000-c032-000000000004', '00000000-0000-4000-a003-000000000002', 'Publish best practices playbook for service delivery', 'Elena Schoeman', '2026-03-15', FALSE, NULL, '2026-01-15T14:00:00Z');

-- Actions for Child 3-3 (Capabilities/Tech)
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c033-000000000001', '00000000-0000-4000-a003-000000000003', 'Analyze top 10 escalation root causes from Q4', 'Dylan Jetha', '2026-01-28', FALSE, NULL, '2026-01-06T09:00:00Z'),
  ('00000000-0000-4000-c033-000000000002', '00000000-0000-4000-a003-000000000003', 'Implement escalation auto-routing rules in ticketing system', 'Dylan Jetha', '2026-02-10', TRUE, '2026-02-03T14:00:00Z', '2026-01-10T10:00:00Z'),
  ('00000000-0000-4000-c033-000000000003', '00000000-0000-4000-a003-000000000003', 'Train L1 support on new triage protocol', 'Alex Komrakov', '2026-03-01', FALSE, NULL, '2026-01-15T11:00:00Z');

-- ============================================
-- Global OKR 4 - Company Launch
-- ============================================
INSERT INTO okrs (id, display_id, objective, created_at, parent_id, area, owner, status)
VALUES
  ('00000000-0000-4000-a000-000000000004', 'OKR-4', 'Launch both companies with a compelling narrative', '2026-01-10T17:15:11.172Z', NULL, NULL, 'Evan Sams', 'off-track');

INSERT INTO key_results (id, okr_id, metric_name, from_value, to_value, current_value, status, sort_order)
VALUES
  ('00000000-0000-4000-b004-000000000001', '00000000-0000-4000-a000-000000000004', 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions', 20, 60, 32, 'progressing', 0),
  ('00000000-0000-4000-b004-000000000002', '00000000-0000-4000-a000-000000000004', 'Media coverage', 8, 28, 14, 'off-track', 1);

-- Actions for Global OKR 4
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c004-000000000001', '00000000-0000-4000-a000-000000000004', 'Finalize brand narrative and key messaging framework', 'Evan Sams', '2026-01-28', FALSE, NULL, '2026-01-08T09:00:00Z'),
  ('00000000-0000-4000-c004-000000000002', '00000000-0000-4000-a000-000000000004', 'Brief PR agency on launch timeline and milestones', 'Evan Sams', '2026-03-10', FALSE, NULL, '2026-01-12T10:00:00Z');

-- Child OKRs for Global 4
INSERT INTO okrs (id, display_id, objective, created_at, parent_id, area, owner, status)
VALUES
  ('00000000-0000-4000-a004-000000000001', NULL, 'Execute communication plan', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000004', 'GCC India', 'Preeti Naval Kumar', 'progressing'),
  ('00000000-0000-4000-a004-000000000002', NULL, 'Ensure seamless brand transition across all customer-facing channels and internal platforms while maintaining service continuity', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000004', 'GCC Mexico', 'Serge De Vos', 'off-track'),
  ('00000000-0000-4000-a004-000000000003', NULL, 'Build excitement', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000004', 'GBS Onshore', 'Juan Ramon Triana', NULL);

INSERT INTO key_results (id, okr_id, metric_name, from_value, to_value, current_value, status, sort_order)
VALUES
  -- Child 4-1 (GCC India)
  ('00000000-0000-4000-b041-000000000001', '00000000-0000-4000-a004-000000000001', 'Employee awareness score measured through pulse surveys conducted monthly during transition period', 13, 30, 20, 'progressing', 0),
  ('00000000-0000-4000-b041-000000000002', '00000000-0000-4000-a004-000000000001', 'Comms delivered', 14, 25, 18, 'off-track', 1),
  -- Child 4-2 (GCC Mexico)
  ('00000000-0000-4000-b042-000000000001', '00000000-0000-4000-a004-000000000002', 'Brand consistency score', 10, 40, 18, 'off-track', 0),
  ('00000000-0000-4000-b042-000000000002', '00000000-0000-4000-a004-000000000002', 'Revenue', 10, 20, 13, 'off-track', 1),
  ('00000000-0000-4000-b042-000000000003', '00000000-0000-4000-a004-000000000002', 'Customer awareness of new brand identity measured through recognition surveys and social media sentiment analysis', 20, 80, 32, 'progressing', 2),
  -- Child 4-3 (GBS Onshore) - intentionally no data
  ('00000000-0000-4000-b043-000000000001', '00000000-0000-4000-a004-000000000003', 'Event attendance', 50, 90, NULL, NULL, 0),
  ('00000000-0000-4000-b043-000000000002', '00000000-0000-4000-a004-000000000003', 'Social engagement', 100, 500, NULL, NULL, 1);

-- Actions for Child 4-1 (GCC India)
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c041-000000000001', '00000000-0000-4000-a004-000000000001', 'Send first all-hands transition update email', 'Preeti Naval Kumar', '2026-02-01', FALSE, NULL, '2026-01-12T09:00:00Z'),
  ('00000000-0000-4000-c041-000000000002', '00000000-0000-4000-a004-000000000001', 'Create FAQ document for employee questions about the transition', 'Preeti Naval Kumar', '2026-02-28', FALSE, NULL, '2026-01-15T10:00:00Z');

-- Actions for Child 4-2 (GCC Mexico)
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c042-000000000001', '00000000-0000-4000-a004-000000000002', 'Complete brand asset migration checklist', 'Serge De Vos', '2026-01-30', TRUE, '2026-01-30T12:00:00Z', '2026-01-08T08:00:00Z'),
  ('00000000-0000-4000-c042-000000000002', '00000000-0000-4000-a004-000000000002', 'Brief customer-facing teams on new brand guidelines', 'Serge De Vos', '2026-03-05', FALSE, NULL, '2026-01-14T09:00:00Z');

-- ============================================
-- Global OKR 5 - GBS Separation
-- ============================================
INSERT INTO okrs (id, display_id, objective, created_at, parent_id, area, owner, status)
VALUES
  ('00000000-0000-4000-a000-000000000005', 'OKR-5', 'Deliver a successful GBS Separation', '2026-01-10T17:15:11.172Z', NULL, NULL, 'Morne Fouche', 'on-track');

INSERT INTO key_results (id, okr_id, metric_name, from_value, to_value, current_value, status, sort_order)
VALUES
  ('00000000-0000-4000-b005-000000000001', '00000000-0000-4000-a000-000000000005', 'Separation milestones', 0, 100, 45, 'progressing', 0),
  ('00000000-0000-4000-b005-000000000002', '00000000-0000-4000-a000-000000000005', 'Supply Chain Governance Model (decision rights, RACI, forums, cadence) formally approved and communicated for SC functions', 10, 40, 28, 'on-track', 1);

-- Actions for Global OKR 5
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c005-000000000001', '00000000-0000-4000-a000-000000000005', 'Complete separation readiness checklist for all workstreams', 'Morne Fouche', '2026-02-01', TRUE, '2026-02-01T17:00:00Z', '2026-01-10T08:00:00Z'),
  ('00000000-0000-4000-c005-000000000002', '00000000-0000-4000-a000-000000000005', 'Secure sign-off on Day 1 operating model', 'Morne Fouche', '2026-02-08', FALSE, NULL, '2026-01-12T09:00:00Z'),
  ('00000000-0000-4000-c005-000000000003', '00000000-0000-4000-a000-000000000005', 'Conduct end-to-end separation dry run', 'Thiago Marchi', '2026-03-25', FALSE, NULL, '2026-01-15T10:00:00Z');

-- Child OKRs for Global 5
INSERT INTO okrs (id, display_id, objective, created_at, parent_id, area, owner, status, challenges, needs)
VALUES
  ('00000000-0000-4000-a005-000000000001', NULL, 'Complete technology migration', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000005', 'GCC India', 'Thiago Marchi', 'progressing', 'Legacy system complexity is higher than estimated. Some integrations have undocumented dependencies that surface during migration testing.', 'Need additional vendor support for the legacy ERP decommissioning and extended access to staging environments for parallel testing.'),
  ('00000000-0000-4000-a005-000000000002', NULL, 'Ensure business continuity throughout the separation process with zero critical service interruptions for stakeholders and customers', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000005', 'GCC Mexico', 'Eric Ruys', 'off-track', NULL, NULL),
  ('00000000-0000-4000-a005-000000000003', NULL, 'Finalize legal and compliance requirements for both entities including regulatory filings and contractual obligations', '2026-01-10T17:15:11.172Z', '00000000-0000-4000-a000-000000000005', 'GPL', 'Juan Ramon Triana', 'on-track', 'Regulatory timeline for entity B filing is uncertain due to pending government review. This could delay the overall separation schedule.', 'Need additional legal counsel bandwidth to handle parallel filings across multiple jurisdictions.'),
  ('00000000-0000-4000-a005-000000000004', NULL, 'Train teams', '2026-01-11T18:38:15.684Z', '00000000-0000-4000-a000-000000000005', 'GBS Onshore', 'Amanda Jones', 'progressing', NULL, NULL),
  ('00000000-0000-4000-a005-000000000005', NULL, 'Migrate critical infrastructure', '2026-01-12T13:18:49.497Z', '00000000-0000-4000-a000-000000000005', 'Capabilities/Tech', 'Dylan Jetha', NULL, NULL, NULL);

INSERT INTO key_results (id, okr_id, metric_name, from_value, to_value, current_value, status, sort_order)
VALUES
  -- Child 5-1 (GCC India)
  ('00000000-0000-4000-b051-000000000001', '00000000-0000-4000-a005-000000000001', 'Systems migrated', 10, 30, 22, 'on-track', 0),
  ('00000000-0000-4000-b051-000000000002', '00000000-0000-4000-a005-000000000001', 'Data integrity validation completion rate across all critical business systems and applications', 19, 25, 20, 'off-track', 1),
  -- Child 5-2 (GCC Mexico)
  ('00000000-0000-4000-b052-000000000001', '00000000-0000-4000-a005-000000000002', 'Uptime', 10, 40, 28, 'progressing', 0),
  ('00000000-0000-4000-b052-000000000002', '00000000-0000-4000-a005-000000000002', 'Incidents', 10, 20, 15, 'off-track', 1),
  -- Child 5-3 (GPL)
  ('00000000-0000-4000-b053-000000000001', '00000000-0000-4000-a005-000000000003', 'Contracts reviewed and updated to reflect new organizational structure and legal entity requirements', 13, 34, 30, 'on-track', 0),
  ('00000000-0000-4000-b053-000000000002', '00000000-0000-4000-a005-000000000003', 'Compliance score', 24, 25, 24, 'off-track', 1),
  ('00000000-0000-4000-b053-000000000003', '00000000-0000-4000-a005-000000000003', 'Audit readiness', 50, 100, 85, 'on-track', 2),
  -- Child 5-4 (GBS Onshore)
  ('00000000-0000-4000-b054-000000000001', '00000000-0000-4000-a005-000000000004', 'Comprehensive training program completion rate for all affected employees across both new organizations', 10, 50, 30, 'progressing', 0),
  ('00000000-0000-4000-b054-000000000002', '00000000-0000-4000-a005-000000000004', 'Readiness assessment score for day one operations including process knowledge and system access verification', 13, 15, 14, 'on-track', 1),
  ('00000000-0000-4000-b054-000000000003', '00000000-0000-4000-a005-000000000004', 'Knowledge transfer', 11, 100, 45, 'progressing', 2),
  -- Child 5-5 (Capabilities/Tech) - intentionally no data
  ('00000000-0000-4000-b055-000000000001', '00000000-0000-4000-a005-000000000005', 'Infrastructure components successfully transitioned to new environment', 14, 20, NULL, NULL, 0);

-- Actions for Child 5-1 (GCC India)
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c051-000000000001', '00000000-0000-4000-a005-000000000001', 'Complete data migration dry-run for ERP system', 'Thiago Marchi', '2026-01-15', FALSE, NULL, '2026-01-05T08:00:00Z'),
  ('00000000-0000-4000-c051-000000000002', '00000000-0000-4000-a005-000000000001', 'Validate data integrity checksums for batch 1', 'Thiago Marchi', '2026-01-28', TRUE, '2026-01-27T11:00:00Z', '2026-01-10T09:00:00Z'),
  ('00000000-0000-4000-c051-000000000003', '00000000-0000-4000-a005-000000000001', 'Coordinate downtime window with infrastructure team', 'Dylan Jetha', '2026-02-20', FALSE, NULL, '2026-01-12T14:00:00Z');

-- Actions for Child 5-2 (GCC Mexico)
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c052-000000000001', '00000000-0000-4000-a005-000000000002', 'Document critical service dependencies and failover paths', 'Eric Ruys', '2026-01-20', FALSE, NULL, '2026-01-05T09:00:00Z'),
  ('00000000-0000-4000-c052-000000000002', '00000000-0000-4000-a005-000000000002', 'Run failover test for primary services', 'Eric Ruys', '2026-02-25', FALSE, NULL, '2026-01-12T10:00:00Z');

-- Actions for Child 5-3 (GPL)
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c053-000000000001', '00000000-0000-4000-a005-000000000003', 'Submit regulatory filings for new entity A', 'Juan Ramon Triana', '2026-01-30', TRUE, '2026-01-29T10:00:00Z', '2026-01-10T08:00:00Z'),
  ('00000000-0000-4000-c053-000000000002', '00000000-0000-4000-a005-000000000003', 'Review vendor contracts for entity reassignment', 'Juan Ramon Triana', '2026-02-01', FALSE, NULL, '2026-01-10T08:30:00Z'),
  ('00000000-0000-4000-c053-000000000003', '00000000-0000-4000-a005-000000000003', 'Conduct internal audit readiness assessment', 'Amanda Jones', '2026-02-28', FALSE, NULL, '2026-01-15T09:00:00Z');

-- Actions for Child 5-4 (GBS Onshore)
INSERT INTO actions (id, okr_id, text, owner, due_date, completed, completed_at, created_at)
VALUES
  ('00000000-0000-4000-c054-000000000001', '00000000-0000-4000-a005-000000000004', 'Complete training curriculum design for both entities', 'Amanda Jones', '2026-02-05', TRUE, '2026-02-05T16:00:00Z', '2026-01-10T08:00:00Z'),
  ('00000000-0000-4000-c054-000000000002', '00000000-0000-4000-a005-000000000004', 'Schedule first wave of team training sessions', 'Amanda Jones', '2026-03-01', FALSE, NULL, '2026-01-15T09:00:00Z');

-- ============================================
-- Quality Checklist Data
-- ============================================
-- child-1-1 (GCC India, OKR-1): 8/8
INSERT INTO quality_checklist (okr_id, item_id, checked) VALUES
  ('00000000-0000-4000-a001-000000000001', 'direction', TRUE),
  ('00000000-0000-4000-a001-000000000001', 'stakeholder-alignment', TRUE),
  ('00000000-0000-4000-a001-000000000001', 'cascading', TRUE),
  ('00000000-0000-4000-a001-000000000001', 'understanding', TRUE),
  ('00000000-0000-4000-a001-000000000001', 'measurability', TRUE),
  ('00000000-0000-4000-a001-000000000001', 'prioritization', TRUE),
  ('00000000-0000-4000-a001-000000000001', 'ownership', TRUE),
  ('00000000-0000-4000-a001-000000000001', 'strategic-thinking', TRUE);

-- child-1-2 (GCC Mexico, OKR-1): 7/8
INSERT INTO quality_checklist (okr_id, item_id, checked) VALUES
  ('00000000-0000-4000-a001-000000000002', 'direction', TRUE),
  ('00000000-0000-4000-a001-000000000002', 'stakeholder-alignment', TRUE),
  ('00000000-0000-4000-a001-000000000002', 'cascading', TRUE),
  ('00000000-0000-4000-a001-000000000002', 'understanding', TRUE),
  ('00000000-0000-4000-a001-000000000002', 'measurability', TRUE),
  ('00000000-0000-4000-a001-000000000002', 'prioritization', FALSE),
  ('00000000-0000-4000-a001-000000000002', 'ownership', TRUE),
  ('00000000-0000-4000-a001-000000000002', 'strategic-thinking', TRUE);

-- child-1-3 (GPL, OKR-1): 5/8
INSERT INTO quality_checklist (okr_id, item_id, checked) VALUES
  ('00000000-0000-4000-a001-000000000003', 'direction', TRUE),
  ('00000000-0000-4000-a001-000000000003', 'stakeholder-alignment', FALSE),
  ('00000000-0000-4000-a001-000000000003', 'cascading', TRUE),
  ('00000000-0000-4000-a001-000000000003', 'understanding', FALSE),
  ('00000000-0000-4000-a001-000000000003', 'measurability', TRUE),
  ('00000000-0000-4000-a001-000000000003', 'prioritization', FALSE),
  ('00000000-0000-4000-a001-000000000003', 'ownership', TRUE),
  ('00000000-0000-4000-a001-000000000003', 'strategic-thinking', TRUE);

-- child-2-1 (GCC India, OKR-2): 3/8
INSERT INTO quality_checklist (okr_id, item_id, checked) VALUES
  ('00000000-0000-4000-a002-000000000001', 'direction', TRUE),
  ('00000000-0000-4000-a002-000000000001', 'stakeholder-alignment', FALSE),
  ('00000000-0000-4000-a002-000000000001', 'cascading', FALSE),
  ('00000000-0000-4000-a002-000000000001', 'understanding', FALSE),
  ('00000000-0000-4000-a002-000000000001', 'measurability', TRUE),
  ('00000000-0000-4000-a002-000000000001', 'prioritization', FALSE),
  ('00000000-0000-4000-a002-000000000001', 'ownership', TRUE),
  ('00000000-0000-4000-a002-000000000001', 'strategic-thinking', FALSE);

-- child-2-2 (GCC Mexico, OKR-2): 7/8
INSERT INTO quality_checklist (okr_id, item_id, checked) VALUES
  ('00000000-0000-4000-a002-000000000002', 'direction', TRUE),
  ('00000000-0000-4000-a002-000000000002', 'stakeholder-alignment', TRUE),
  ('00000000-0000-4000-a002-000000000002', 'cascading', TRUE),
  ('00000000-0000-4000-a002-000000000002', 'understanding', TRUE),
  ('00000000-0000-4000-a002-000000000002', 'measurability', TRUE),
  ('00000000-0000-4000-a002-000000000002', 'prioritization', TRUE),
  ('00000000-0000-4000-a002-000000000002', 'ownership', TRUE),
  ('00000000-0000-4000-a002-000000000002', 'strategic-thinking', FALSE);

-- child-2-3 (GBS Onshore, OKR-2): 8/8
INSERT INTO quality_checklist (okr_id, item_id, checked) VALUES
  ('00000000-0000-4000-a002-000000000003', 'direction', TRUE),
  ('00000000-0000-4000-a002-000000000003', 'stakeholder-alignment', TRUE),
  ('00000000-0000-4000-a002-000000000003', 'cascading', TRUE),
  ('00000000-0000-4000-a002-000000000003', 'understanding', TRUE),
  ('00000000-0000-4000-a002-000000000003', 'measurability', TRUE),
  ('00000000-0000-4000-a002-000000000003', 'prioritization', TRUE),
  ('00000000-0000-4000-a002-000000000003', 'ownership', TRUE),
  ('00000000-0000-4000-a002-000000000003', 'strategic-thinking', TRUE);

-- child-3-2 (GCC Mexico, OKR-3): 6/8
INSERT INTO quality_checklist (okr_id, item_id, checked) VALUES
  ('00000000-0000-4000-a003-000000000002', 'direction', TRUE),
  ('00000000-0000-4000-a003-000000000002', 'stakeholder-alignment', TRUE),
  ('00000000-0000-4000-a003-000000000002', 'cascading', TRUE),
  ('00000000-0000-4000-a003-000000000002', 'understanding', FALSE),
  ('00000000-0000-4000-a003-000000000002', 'measurability', TRUE),
  ('00000000-0000-4000-a003-000000000002', 'prioritization', TRUE),
  ('00000000-0000-4000-a003-000000000002', 'ownership', TRUE),
  ('00000000-0000-4000-a003-000000000002', 'strategic-thinking', FALSE);

-- child-3-3 (Capabilities/Tech, OKR-3): 4/8
INSERT INTO quality_checklist (okr_id, item_id, checked) VALUES
  ('00000000-0000-4000-a003-000000000003', 'direction', TRUE),
  ('00000000-0000-4000-a003-000000000003', 'stakeholder-alignment', TRUE),
  ('00000000-0000-4000-a003-000000000003', 'cascading', FALSE),
  ('00000000-0000-4000-a003-000000000003', 'understanding', FALSE),
  ('00000000-0000-4000-a003-000000000003', 'measurability', TRUE),
  ('00000000-0000-4000-a003-000000000003', 'prioritization', FALSE),
  ('00000000-0000-4000-a003-000000000003', 'ownership', TRUE),
  ('00000000-0000-4000-a003-000000000003', 'strategic-thinking', FALSE);

-- child-4-1 (GCC India, OKR-4): 2/8
INSERT INTO quality_checklist (okr_id, item_id, checked) VALUES
  ('00000000-0000-4000-a004-000000000001', 'direction', TRUE),
  ('00000000-0000-4000-a004-000000000001', 'stakeholder-alignment', FALSE),
  ('00000000-0000-4000-a004-000000000001', 'cascading', FALSE),
  ('00000000-0000-4000-a004-000000000001', 'understanding', FALSE),
  ('00000000-0000-4000-a004-000000000001', 'measurability', TRUE),
  ('00000000-0000-4000-a004-000000000001', 'prioritization', FALSE),
  ('00000000-0000-4000-a004-000000000001', 'ownership', FALSE),
  ('00000000-0000-4000-a004-000000000001', 'strategic-thinking', FALSE);

-- child-4-2 (GCC Mexico, OKR-4): 5/8
INSERT INTO quality_checklist (okr_id, item_id, checked) VALUES
  ('00000000-0000-4000-a004-000000000002', 'direction', TRUE),
  ('00000000-0000-4000-a004-000000000002', 'stakeholder-alignment', TRUE),
  ('00000000-0000-4000-a004-000000000002', 'cascading', TRUE),
  ('00000000-0000-4000-a004-000000000002', 'understanding', FALSE),
  ('00000000-0000-4000-a004-000000000002', 'measurability', TRUE),
  ('00000000-0000-4000-a004-000000000002', 'prioritization', FALSE),
  ('00000000-0000-4000-a004-000000000002', 'ownership', TRUE),
  ('00000000-0000-4000-a004-000000000002', 'strategic-thinking', FALSE);

-- child-5-1 (GCC India, OKR-5): 7/8
INSERT INTO quality_checklist (okr_id, item_id, checked) VALUES
  ('00000000-0000-4000-a005-000000000001', 'direction', TRUE),
  ('00000000-0000-4000-a005-000000000001', 'stakeholder-alignment', TRUE),
  ('00000000-0000-4000-a005-000000000001', 'cascading', TRUE),
  ('00000000-0000-4000-a005-000000000001', 'understanding', TRUE),
  ('00000000-0000-4000-a005-000000000001', 'measurability', TRUE),
  ('00000000-0000-4000-a005-000000000001', 'prioritization', TRUE),
  ('00000000-0000-4000-a005-000000000001', 'ownership', FALSE),
  ('00000000-0000-4000-a005-000000000001', 'strategic-thinking', TRUE);

-- child-5-2 (GCC Mexico, OKR-5): 3/8
INSERT INTO quality_checklist (okr_id, item_id, checked) VALUES
  ('00000000-0000-4000-a005-000000000002', 'direction', TRUE),
  ('00000000-0000-4000-a005-000000000002', 'stakeholder-alignment', FALSE),
  ('00000000-0000-4000-a005-000000000002', 'cascading', TRUE),
  ('00000000-0000-4000-a005-000000000002', 'understanding', FALSE),
  ('00000000-0000-4000-a005-000000000002', 'measurability', FALSE),
  ('00000000-0000-4000-a005-000000000002', 'prioritization', FALSE),
  ('00000000-0000-4000-a005-000000000002', 'ownership', TRUE),
  ('00000000-0000-4000-a005-000000000002', 'strategic-thinking', FALSE);

-- child-5-3 (GPL, OKR-5): 8/8
INSERT INTO quality_checklist (okr_id, item_id, checked) VALUES
  ('00000000-0000-4000-a005-000000000003', 'direction', TRUE),
  ('00000000-0000-4000-a005-000000000003', 'stakeholder-alignment', TRUE),
  ('00000000-0000-4000-a005-000000000003', 'cascading', TRUE),
  ('00000000-0000-4000-a005-000000000003', 'understanding', TRUE),
  ('00000000-0000-4000-a005-000000000003', 'measurability', TRUE),
  ('00000000-0000-4000-a005-000000000003', 'prioritization', TRUE),
  ('00000000-0000-4000-a005-000000000003', 'ownership', TRUE),
  ('00000000-0000-4000-a005-000000000003', 'strategic-thinking', TRUE);

-- child-5-4 (GBS Onshore, OKR-5): 6/8
INSERT INTO quality_checklist (okr_id, item_id, checked) VALUES
  ('00000000-0000-4000-a005-000000000004', 'direction', TRUE),
  ('00000000-0000-4000-a005-000000000004', 'stakeholder-alignment', TRUE),
  ('00000000-0000-4000-a005-000000000004', 'cascading', TRUE),
  ('00000000-0000-4000-a005-000000000004', 'understanding', TRUE),
  ('00000000-0000-4000-a005-000000000004', 'measurability', TRUE),
  ('00000000-0000-4000-a005-000000000004', 'prioritization', FALSE),
  ('00000000-0000-4000-a005-000000000004', 'ownership', TRUE),
  ('00000000-0000-4000-a005-000000000004', 'strategic-thinking', FALSE);

-- Verify the migration
SELECT 'OKRs inserted: ' || COUNT(*) FROM okrs;
SELECT 'Key Results inserted: ' || COUNT(*) FROM key_results;
SELECT 'Actions inserted: ' || COUNT(*) FROM actions;
SELECT 'Quality checklist items inserted: ' || COUNT(*) FROM quality_checklist;
