import { useState } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`help-accordion ${isOpen ? 'help-accordion-open' : ''}`}>
      <button
        className="help-accordion-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className="help-accordion-icon">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="help-accordion-content">
          {children}
        </div>
      )}
    </div>
  );
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="changelog-overlay" onClick={handleOverlayClick}>
      <div className="changelog-modal">
        <div className="changelog-header">
          <h2>Help Guide</h2>
          <button className="changelog-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="changelog-content">
          {/* Introduction */}
          <section className="help-intro">
            <h3>What is Vector<span className="help-arrow">↗</span>?</h3>
            <p>
              Vector is an AI-powered OKR platform that helps leadership create high-quality OKRs faster,
              in one place, with clear structure - and keeps governance alive throughout the year in an easy way.
            </p>
          </section>

          {/* Key Concepts */}
          <section className="help-guides">
            <h3>Key Concepts</h3>

            <Accordion title="Understanding OKRs" defaultOpen>
              <ul className="help-list">
                <li>
                  <strong>Global OKRs</strong>
                  <p>Organization-wide strategic objectives that define top priorities. These are your north star goals.</p>
                </li>
                <li>
                  <strong>Area OKRs</strong>
                  <p>Department or team-level objectives that cascade from Global OKRs. Each area contributes to the bigger picture.</p>
                </li>
                <li>
                  <strong>Key Results</strong>
                  <p>Measurable outcomes with specific targets (e.g., "10% → 30%"). Track progress with status indicators.</p>
                </li>
                <li>
                  <strong>Quality Checklist</strong>
                  <p>8-item checklist covering Direction, Stakeholder Alignment, Cascading, Understanding, Measurability, Prioritization, Ownership, and Strategic Thinking.</p>
                </li>
              </ul>
            </Accordion>
          </section>

          {/* Pages Guide */}
          <section className="help-guides">
            <h3>Navigating Vector</h3>

            <Accordion title="Home">
              <p className="help-description">
                Your dashboard with quick statistics: Global OKRs count, total Key Results, and On Track percentage.
              </p>
            </Accordion>

            <Accordion title="OKR List">
              <p className="help-description">
                The primary workspace for creating and managing OKRs in a list format.
              </p>
              <ul className="help-list">
                <li>
                  <strong>Create Global OKRs</strong>
                  <p>Click "+ New OKR" to create organization-level objectives.</p>
                </li>
                <li>
                  <strong>Create Area OKRs</strong>
                  <p>Click the "+" action button on a Global OKR to add department-level objectives.</p>
                </li>
                <li>
                  <strong>Quality Column</strong>
                  <p>View checklist completion (e.g., "3/8") for each Area OKR. Hover to see details.</p>
                </li>
                <li>
                  <strong>Search</strong>
                  <p>Find OKRs by objective text, area, or owner name.</p>
                </li>
              </ul>
            </Accordion>

            <Accordion title="OKR Map">
              <p className="help-description">
                Visual tree hierarchy with two modes for different workflows.
              </p>
              <ul className="help-list">
                <li>
                  <strong>OKR Setting Mode</strong>
                  <p>Edit objectives and key results inline. Click any text to modify directly.</p>
                </li>
                <li>
                  <strong>OKR Tracking Mode</strong>
                  <p>Check in on progress. Update current values, set status, and record governance notes.</p>
                </li>
                <li>
                  <strong>Filter by Area/Owner</strong>
                  <p>Use dropdowns to focus on specific areas or owners.</p>
                </li>
                <li>
                  <strong>AI Feedback</strong>
                  <p>Click "Get Feedback" to receive AI-powered suggestions on OKR quality with one-click apply.</p>
                </li>
              </ul>
            </Accordion>

            <Accordion title="Dashboards & Users">
              <p className="help-description">
                Coming soon! We are cooking up something great for you.
              </p>
            </Accordion>
          </section>

          {/* Check-in Feature */}
          <section className="help-guides">
            <h3>Check-in & Governance</h3>

            <Accordion title="How Check-ins Work">
              <ul className="help-list">
                <li>
                  <strong>Update Key Results</strong>
                  <p>Enter current values and select status (On Track, Progressing, Off Track).</p>
                </li>
                <li>
                  <strong>What challenges are you facing?</strong>
                  <p>Document blockers, risks, or obstacles preventing progress.</p>
                </li>
                <li>
                  <strong>What do you need to achieve your OKRs?</strong>
                  <p>Record decisions, support, or resources needed from leadership.</p>
                </li>
                <li>
                  <strong>Comments</strong>
                  <p>Add any additional context or notes.</p>
                </li>
              </ul>
            </Accordion>
          </section>

          {/* AI Features */}
          <section className="help-guides">
            <h3>AI-Powered Features</h3>

            <Accordion title="AI Feedback">
              <ul className="help-list">
                <li>
                  <strong>Get Feedback</strong>
                  <p>Click "Get Feedback" on the OKR Map to analyze your OKR tree against best practices.</p>
                </li>
                <li>
                  <strong>Assessment</strong>
                  <p>Receive strengths, areas for improvement, and alignment analysis.</p>
                </li>
                <li>
                  <strong>Suggestions</strong>
                  <p>Get specific improvement suggestions with one-click Apply to update your OKRs instantly.</p>
                </li>
              </ul>
            </Accordion>
          </section>

          {/* Tips */}
          <section className="help-guides">
            <h3>Best Practices</h3>

            <Accordion title="OKR Tips">
              <ul className="help-list">
                <li>
                  <strong>Keep Objectives Ambitious</strong>
                  <p>Objectives should inspire and challenge, pushing the organization forward.</p>
                </li>
                <li>
                  <strong>Limit Key Results</strong>
                  <p>Stick to 2-3 key results per objective to maintain focus.</p>
                </li>
                <li>
                  <strong>Use the Quality Checklist</strong>
                  <p>Complete all 8 items to ensure well-defined and aligned OKRs.</p>
                </li>
                <li>
                  <strong>Check in Regularly</strong>
                  <p>Update progress weekly or bi-weekly to keep governance alive.</p>
                </li>
              </ul>
            </Accordion>
          </section>
        </div>
      </div>
    </div>
  );
}
