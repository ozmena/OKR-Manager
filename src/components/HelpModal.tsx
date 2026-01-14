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
              Vector is an OKR (Objectives and Key Results) management platform designed to
              align your organization around strategic objectives. It helps leadership set
              direction, enables teams to create supporting goals, and provides visibility
              into progress across the entire organization.
            </p>
          </section>

          {/* Key Concepts */}
          <section className="help-guides">
            <h3>Key Concepts</h3>

            <Accordion title="Understanding OKRs" defaultOpen>
              <ul className="help-list">
                <li>
                  <strong>Global OKRs</strong>
                  <p>Company-wide strategic objectives that define the organization's top priorities. These are your north star goals that everyone works toward.</p>
                </li>
                <li>
                  <strong>Area OKRs</strong>
                  <p>Department or team-level objectives that support and cascade from Global OKRs. Each area creates objectives that contribute to the bigger picture.</p>
                </li>
                <li>
                  <strong>Key Results</strong>
                  <p>Measurable outcomes that indicate progress toward an objective. Each OKR can have up to 3 key results with specific targets (e.g., "Increase from 50% to 80%").</p>
                </li>
                <li>
                  <strong>Quality Checklist</strong>
                  <p>An 8-item checklist for Area OKRs covering Direction, Stakeholder Alignment, Cascading, Understanding, Measurability, Prioritization, Ownership, and Strategic Thinking.</p>
                </li>
              </ul>
            </Accordion>
          </section>

          {/* Use Cases */}
          <section className="help-guides">
            <h3>Who Benefits from Vector?</h3>

            <Accordion title="Use Cases by Role">
              <ul className="help-list">
                <li>
                  <strong>For Leadership</strong>
                  <p>Set company direction with Global OKRs, monitor organizational alignment, and quickly assess OKR quality across all areas using the Quality column and hover tooltips.</p>
                </li>
                <li>
                  <strong>For Area Leads</strong>
                  <p>Create team objectives that align with company goals, use the quality checklist to ensure well-defined OKRs, and track your team's key results in the visual tree view.</p>
                </li>
                <li>
                  <strong>For Team Members</strong>
                  <p>Understand organizational priorities, see how your work connects to company objectives, and track progress on key results that matter.</p>
                </li>
              </ul>
            </Accordion>
          </section>

          {/* Pages Guide */}
          <section className="help-guides">
            <h3>Navigating Vector</h3>

            <Accordion title="Home">
              <p className="help-description">
                Your dashboard showing an overview of all OKRs with quick statistics and navigation to other pages.
              </p>
            </Accordion>

            <Accordion title="2026 OKRs - Management View">
              <p className="help-description">
                The primary workspace for creating and organizing your OKRs in a list format.
              </p>
              <ul className="help-list">
                <li>
                  <strong>Create Global OKRs</strong>
                  <p>Click "+ New OKR" to create company-level objectives.</p>
                </li>
                <li>
                  <strong>Add Key Results</strong>
                  <p>Click the "+" on the left side of any OKR row to add measurable key results.</p>
                </li>
                <li>
                  <strong>Create Area OKRs</strong>
                  <p>Click the "+" action button on a Global OKR to create department-level objectives.</p>
                </li>
                <li>
                  <strong>Edit Inline</strong>
                  <p>Click any objective or key result text to edit directly. Press Enter to save, Escape to cancel.</p>
                </li>
                <li>
                  <strong>Search</strong>
                  <p>Use the search bar to find OKRs by objective text, area, or owner name.</p>
                </li>
                <li>
                  <strong>Quality Column</strong>
                  <p>View the quality checklist completion (e.g., "3/8") for each Area OKR. Hover to see which items are checked.</p>
                </li>
              </ul>
            </Accordion>

            <Accordion title="OKR Tracking - Visual View">
              <p className="help-description">
                A visual tree hierarchy for monitoring OKR progress across the organization.
              </p>
              <ul className="help-list">
                <li>
                  <strong>Switch Between OKRs</strong>
                  <p>Use the tabs at the top to view different Global OKRs.</p>
                </li>
                <li>
                  <strong>Filter by Area</strong>
                  <p>Use the dropdown filters to show only specific areas or owners.</p>
                </li>
                <li>
                  <strong>View Progress</strong>
                  <p>Each key result card shows current progress with color-coded status indicators.</p>
                </li>
              </ul>
            </Accordion>

            <Accordion title="Dashboards">
              <p className="help-description">
                Coming soon! We are cooking up something great for you.
              </p>
            </Accordion>
          </section>

          {/* Features */}
          <section className="help-guides">
            <h3>Key Features</h3>

            <Accordion title="Features Overview">
              <ul className="help-list">
                <li>
                  <strong>Quality Checklist</strong>
                  <p>8-item checklist for Area OKRs ensures well-defined objectives. Items with 7-8 checks show a green badge.</p>
                </li>
                <li>
                  <strong>Search & Filter</strong>
                  <p>Search across objectives, key results, areas, and owners. Filter by area or owner in tracking view.</p>
                </li>
                <li>
                  <strong>Inline Editing</strong>
                  <p>Click any text to edit in place without opening forms.</p>
                </li>
                <li>
                  <strong>Auto-Save</strong>
                  <p>All changes are automatically saved to your browser's local storage.</p>
                </li>
                <li>
                  <strong>Expand/Collapse</strong>
                  <p>Use arrows to show or hide key results and child OKRs for focused viewing.</p>
                </li>
              </ul>
            </Accordion>
          </section>

          {/* Tips */}
          <section className="help-guides">
            <h3>Tips & Best Practices</h3>

            <Accordion title="OKR Best Practices">
              <ul className="help-list">
                <li>
                  <strong>Keep Objectives Ambitious</strong>
                  <p>Objectives should be inspiring and challenging, pushing the organization forward.</p>
                </li>
                <li>
                  <strong>Limit Key Results</strong>
                  <p>Stick to 2-3 key results per objective to maintain focus.</p>
                </li>
                <li>
                  <strong>Make Results Measurable</strong>
                  <p>Key results should have clear metrics so progress is objective, not subjective.</p>
                </li>
                <li>
                  <strong>Use the Quality Checklist</strong>
                  <p>Complete the quality checklist to ensure your OKRs are well-defined and aligned.</p>
                </li>
                <li>
                  <strong>Review Regularly</strong>
                  <p>Check in on OKRs weekly or bi-weekly to update progress and adjust as needed.</p>
                </li>
              </ul>
            </Accordion>
          </section>
        </div>
      </div>
    </div>
  );
}
