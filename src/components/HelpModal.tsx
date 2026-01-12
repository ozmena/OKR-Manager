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
            <h3>What is Vector?</h3>
            <p>
              Vector is an OKR (Objectives and Key Results) management tool that helps
              you define, track, and achieve your organizational goals. Create company-wide
              objectives and break them down into measurable key results.
            </p>
          </section>

          {/* Page Guides */}
          <section className="help-guides">
            <h3>Pages</h3>

            <Accordion title="2026 OKRs - Management View" defaultOpen>
              <p className="help-description">
                The management view is where you create and organize your OKRs in a list format.
              </p>
              <ul className="help-list">
                <li>
                  <strong>Create Global OKRs</strong>
                  <p>Click "+ New" to create company-level objectives. These are your top-level strategic goals.</p>
                </li>
                <li>
                  <strong>Add Key Results</strong>
                  <p>Click the "+" button on the left of any OKR row to add measurable key results with target percentages.</p>
                </li>
                <li>
                  <strong>Create Area OKRs</strong>
                  <p>Click the "+" button on the right of a Global OKR to create department-level objectives that support it.</p>
                </li>
                <li>
                  <strong>Edit Inline</strong>
                  <p>Click on any objective or key result text to edit it directly. Press Enter to save or Escape to cancel.</p>
                </li>
                <li>
                  <strong>Expand/Collapse</strong>
                  <p>Click the arrow (▶/▼) to show or hide key results and child OKRs.</p>
                </li>
              </ul>
            </Accordion>

            <Accordion title="OKR Tracking - Visual View">
              <p className="help-description">
                The tracking view displays your OKRs in a visual tree hierarchy for easy monitoring.
              </p>
              <ul className="help-list">
                <li>
                  <strong>Switch Between OKRs</strong>
                  <p>Use the tabs at the top to switch between different Global OKRs.</p>
                </li>
                <li>
                  <strong>Filter by Area</strong>
                  <p>Use the "Filter by Area" dropdown to show only Area OKRs from a specific department.</p>
                </li>
                <li>
                  <strong>View Progress</strong>
                  <p>Each key result card shows current progress with color-coded status indicators.</p>
                </li>
                <li>
                  <strong>Hover for Details</strong>
                  <p>Hover over truncated text to see the full content in a tooltip.</p>
                </li>
              </ul>
            </Accordion>

            <Accordion title="Tips & Shortcuts">
              <ul className="help-list">
                <li>
                  <strong>Sidebar Navigation</strong>
                  <p>Use the sidebar to switch between pages. Click the collapse button («) to minimize it.</p>
                </li>
                <li>
                  <strong>Best Practices</strong>
                  <p>Keep objectives ambitious but achievable. Limit key results to 3-5 per objective for focus.</p>
                </li>
                <li>
                  <strong>Data Persistence</strong>
                  <p>Your OKRs are saved automatically in your browser's local storage.</p>
                </li>
              </ul>
            </Accordion>
          </section>
        </div>
      </div>
    </div>
  );
}
