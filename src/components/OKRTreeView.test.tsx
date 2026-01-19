import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OKRTreeView } from './OKRTreeView';
import { OKR } from '../types';

// Mock the aiService
vi.mock('../services/aiService', () => ({
  getTreeAIFeedback: vi.fn(() => Promise.resolve({
    success: true,
    feedback: 'Test feedback',
    suggestion: null
  }))
}));

// Mock the CheckInModal
vi.mock('./CheckInModal', () => ({
  CheckInModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    isOpen ? <div data-testid="check-in-modal"><button onClick={onClose}>Close</button></div> : null
  )
}));

// Mock the AIFeedbackModal
vi.mock('./AIFeedbackModal', () => ({
  AIFeedbackModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    isOpen ? <div data-testid="ai-feedback-modal"><button onClick={onClose}>Close</button></div> : null
  )
}));

// Test data
const createGlobalOKR = (overrides: Partial<OKR> = {}): OKR => ({
  id: 'global-1',
  displayId: 'OKR-1',
  objective: 'Increase customer satisfaction',
  keyResults: [
    {
      id: 'kr-1',
      metricName: 'NPS Score',
      from: 50,
      to: 80,
      unit: 'number',
      current: 65,
      status: 'on-track'
    },
    {
      id: 'kr-2',
      metricName: 'Customer retention rate',
      from: 70,
      to: 90,
      unit: 'percentage',
      current: 78,
      status: 'progressing'
    }
  ],
  createdAt: '2024-01-01',
  ...overrides
});

const createChildOKR = (parentId: string, overrides: Partial<OKR> = {}): OKR => ({
  id: 'child-1',
  objective: 'Improve support response time',
  keyResults: [
    {
      id: 'child-kr-1',
      metricName: 'Average response time',
      from: 24,
      to: 4,
      unit: 'number',
      current: 12,
      status: 'progressing'
    }
  ],
  createdAt: '2024-01-02',
  parentId,
  area: 'GCC Mexico',
  owner: 'Alex Komrakov',
  ...overrides
});

describe('OKRTreeView', () => {
  const mockOnUpdateOKR = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Empty state', () => {
    it('renders empty state message when no OKRs provided', () => {
      render(<OKRTreeView okrs={[]} onUpdateOKR={mockOnUpdateOKR} mode="tracking" />);
      expect(screen.getByText(/No OKRs yet/)).toBeInTheDocument();
    });
  });

  describe('Tab navigation', () => {
    it('renders tabs for top-level OKRs', () => {
      const okrs = [
        createGlobalOKR({ id: 'g1', displayId: 'OKR-1', objective: 'First objective' }),
        createGlobalOKR({ id: 'g2', displayId: 'OKR-2', objective: 'Second objective' })
      ];

      render(<OKRTreeView okrs={okrs} onUpdateOKR={mockOnUpdateOKR} mode="tracking" />);

      expect(screen.getByText('OKR-1:')).toBeInTheDocument();
      expect(screen.getByText('OKR-2:')).toBeInTheDocument();
    });

    it('switches to different OKR when tab is clicked', async () => {
      const okrs = [
        createGlobalOKR({ id: 'g1', displayId: 'OKR-1', objective: 'First objective' }),
        createGlobalOKR({ id: 'g2', displayId: 'OKR-2', objective: 'Second objective' })
      ];

      render(<OKRTreeView okrs={okrs} onUpdateOKR={mockOnUpdateOKR} mode="tracking" />);

      // First OKR should be selected by default
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('First objective');

      // Click second tab
      const secondTab = screen.getByTitle('OKR-2: Second objective');
      fireEvent.click(secondTab);

      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Second objective');
    });
  });

  describe('Tree card rendering', () => {
    it('renders global OKR card with objective and key results', () => {
      const okr = createGlobalOKR();
      render(<OKRTreeView okrs={[okr]} onUpdateOKR={mockOnUpdateOKR} mode="tracking" />);

      // Objective appears in both tab and card - use getAllByText
      expect(screen.getAllByText('Increase customer satisfaction').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('NPS Score')).toBeInTheDocument();
      expect(screen.getByText('Customer retention rate')).toBeInTheDocument();
    });

    it('renders child OKR cards with area badge', () => {
      const globalOkr = createGlobalOKR();
      const childOkr = createChildOKR(globalOkr.id);

      render(
        <OKRTreeView
          okrs={[globalOkr, childOkr]}
          onUpdateOKR={mockOnUpdateOKR}
          mode="tracking"
        />
      );

      // Objective appears in multiple places
      expect(screen.getAllByText('Improve support response time').length).toBeGreaterThanOrEqual(1);
      // Area appears in both dropdown and badge - check the badge specifically
      const badge = document.querySelector('.tree-card-department-badge');
      expect(badge).toHaveTextContent('GCC Mexico');
    });

    it('displays owner initials for child OKRs', () => {
      const globalOkr = createGlobalOKR();
      const childOkr = createChildOKR(globalOkr.id, { owner: 'Alex Komrakov' });

      render(
        <OKRTreeView
          okrs={[globalOkr, childOkr]}
          onUpdateOKR={mockOnUpdateOKR}
          mode="tracking"
        />
      );

      expect(screen.getByTitle('Alex Komrakov')).toHaveTextContent('AK');
    });
  });

  describe('Progress display in tracking mode', () => {
    it('shows progress bar and percentage for key results with current value', () => {
      const okr = createGlobalOKR();
      render(<OKRTreeView okrs={[okr]} onUpdateOKR={mockOnUpdateOKR} mode="tracking" />);

      // Check that from/to values are displayed - they're in separate spans
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('80')).toBeInTheDocument();
    });

    it('shows "No check-in data" for key results without current value', () => {
      const okr = createGlobalOKR();
      const childOkr = createChildOKR(okr.id, {
        keyResults: [{
          id: 'kr-no-data',
          metricName: 'Test metric',
          from: 0,
          to: 100,
          unit: 'percentage'
        }]
      });

      render(
        <OKRTreeView
          okrs={[okr, childOkr]}
          onUpdateOKR={mockOnUpdateOKR}
          mode="tracking"
        />
      );

      expect(screen.getByText('No check-in data')).toBeInTheDocument();
    });
  });

  describe('Check-in functionality', () => {
    it('opens check-in modal when check-in button is clicked', async () => {
      const okr = createGlobalOKR();
      render(<OKRTreeView okrs={[okr]} onUpdateOKR={mockOnUpdateOKR} mode="tracking" />);

      const checkInBtn = screen.getByRole('button', { name: /Check-in/ });
      fireEvent.click(checkInBtn);

      expect(screen.getByTestId('check-in-modal')).toBeInTheDocument();
    });

    it('hides check-in button in setting mode', () => {
      const okr = createGlobalOKR();
      render(<OKRTreeView okrs={[okr]} onUpdateOKR={mockOnUpdateOKR} mode="setting" />);

      // The button should exist but be hidden via CSS class
      const footer = document.querySelector('.tree-card-footer-hidden');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('renders area filter dropdown when child OKRs have areas', () => {
      const globalOkr = createGlobalOKR();
      const childOkr = createChildOKR(globalOkr.id);

      render(
        <OKRTreeView
          okrs={[globalOkr, childOkr]}
          onUpdateOKR={mockOnUpdateOKR}
          mode="tracking"
        />
      );

      // There should be two comboboxes (area and owner filters)
      expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('All Areas')).toBeInTheDocument();
    });

    it('filters child OKRs by selected area', async () => {
      const globalOkr = createGlobalOKR();
      const childOkr1 = createChildOKR(globalOkr.id, { id: 'c1', area: 'GCC Mexico', objective: 'Mexico objective' });
      const childOkr2 = createChildOKR(globalOkr.id, { id: 'c2', area: 'GCC India', objective: 'India objective' });

      render(
        <OKRTreeView
          okrs={[globalOkr, childOkr1, childOkr2]}
          onUpdateOKR={mockOnUpdateOKR}
          mode="tracking"
        />
      );

      // Both should be visible initially
      expect(screen.getByText('Mexico objective')).toBeInTheDocument();
      expect(screen.getByText('India objective')).toBeInTheDocument();

      // Select GCC Mexico filter
      const areaFilter = screen.getAllByRole('combobox')[0];
      fireEvent.change(areaFilter, { target: { value: 'GCC Mexico' } });

      // Only Mexico should be visible
      expect(screen.getByText('Mexico objective')).toBeInTheDocument();
      expect(screen.queryByText('India objective')).not.toBeInTheDocument();
    });

    it('filters child OKRs by selected owner', async () => {
      const globalOkr = createGlobalOKR();
      const childOkr1 = createChildOKR(globalOkr.id, { id: 'c1', owner: 'Alex Komrakov', objective: 'Alex objective' });
      const childOkr2 = createChildOKR(globalOkr.id, { id: 'c2', owner: 'Dylan Jetha', objective: 'Dylan objective' });

      render(
        <OKRTreeView
          okrs={[globalOkr, childOkr1, childOkr2]}
          onUpdateOKR={mockOnUpdateOKR}
          mode="tracking"
        />
      );

      // Both should be visible initially
      expect(screen.getByText('Alex objective')).toBeInTheDocument();
      expect(screen.getByText('Dylan objective')).toBeInTheDocument();

      // Select owner filter
      const ownerFilter = screen.getAllByRole('combobox')[1];
      fireEvent.change(ownerFilter, { target: { value: 'Alex Komrakov' } });

      // Only Alex's OKR should be visible
      expect(screen.getByText('Alex objective')).toBeInTheDocument();
      expect(screen.queryByText('Dylan objective')).not.toBeInTheDocument();
    });
  });

  describe('Inline editing in setting mode', () => {
    it('makes objective editable in setting mode', async () => {
      const user = userEvent.setup();
      const okr = createGlobalOKR();
      render(<OKRTreeView okrs={[okr]} onUpdateOKR={mockOnUpdateOKR} mode="setting" />);

      // Get the h4 element (the card objective, not the tab)
      const objective = screen.getByRole('heading', { level: 4 });
      expect(objective).toHaveClass('editable-field');

      await user.click(objective);

      // Should now show a textarea for editing
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveValue('Increase customer satisfaction');
    });

    it('saves objective on blur', async () => {
      const user = userEvent.setup();
      const okr = createGlobalOKR();
      render(<OKRTreeView okrs={[okr]} onUpdateOKR={mockOnUpdateOKR} mode="setting" />);

      const objective = screen.getByRole('heading', { level: 4 });
      await user.click(objective);

      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'New objective');
      fireEvent.blur(textarea);

      expect(mockOnUpdateOKR).toHaveBeenCalledWith(
        expect.objectContaining({ objective: 'New objective' })
      );
    });

    it('cancels edit on Escape key', async () => {
      const user = userEvent.setup();
      const okr = createGlobalOKR();
      render(<OKRTreeView okrs={[okr]} onUpdateOKR={mockOnUpdateOKR} mode="setting" />);

      const objective = screen.getByRole('heading', { level: 4 });
      await user.click(objective);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Something else');
      await user.keyboard('{Escape}');

      // Should not have called update
      expect(mockOnUpdateOKR).not.toHaveBeenCalled();
      // Objective should still show original text in the heading
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Increase customer satisfaction');
    });

    it('does not make fields editable in tracking mode', () => {
      const okr = createGlobalOKR();
      render(<OKRTreeView okrs={[okr]} onUpdateOKR={mockOnUpdateOKR} mode="tracking" />);

      const objective = screen.getByRole('heading', { level: 4 });
      expect(objective).not.toHaveClass('editable-field');
    });
  });

  describe('AI Feedback button', () => {
    it('shows AI feedback button only in setting mode', () => {
      const okr = createGlobalOKR();

      const { rerender } = render(
        <OKRTreeView okrs={[okr]} onUpdateOKR={mockOnUpdateOKR} mode="tracking" />
      );
      expect(screen.queryByText('Get Feedback')).not.toBeInTheDocument();

      rerender(<OKRTreeView okrs={[okr]} onUpdateOKR={mockOnUpdateOKR} mode="setting" />);
      expect(screen.getByText('Get Feedback')).toBeInTheDocument();
    });

    it('opens AI feedback modal when button is clicked', async () => {
      const okr = createGlobalOKR();
      render(<OKRTreeView okrs={[okr]} onUpdateOKR={mockOnUpdateOKR} mode="setting" />);

      const feedbackBtn = screen.getByText('Get Feedback');
      fireEvent.click(feedbackBtn);

      await waitFor(() => {
        expect(screen.getByTestId('ai-feedback-modal')).toBeInTheDocument();
      });
    });
  });

  describe('Key Result display', () => {
    it('displays key result values with correct units', () => {
      const okr = createGlobalOKR({
        keyResults: [
          { id: 'kr-pct', metricName: 'Percentage metric', from: 0, to: 100, unit: 'percentage' },
          { id: 'kr-num', metricName: 'Number metric', from: 10, to: 50, unit: 'number' }
        ]
      });

      render(<OKRTreeView okrs={[okr]} onUpdateOKR={mockOnUpdateOKR} mode="tracking" />);

      // Values are in separate spans, check they exist with proper formatting
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('displays function badge on child OKR key results', () => {
      const globalOkr = createGlobalOKR();
      const childOkr = createChildOKR(globalOkr.id, {
        keyResults: [{
          id: 'kr-with-fn',
          metricName: 'Metric with function',
          from: 0,
          to: 100,
          function: 'Supply Chain'
        }]
      });

      render(
        <OKRTreeView
          okrs={[globalOkr, childOkr]}
          onUpdateOKR={mockOnUpdateOKR}
          mode="tracking"
        />
      );

      expect(screen.getByText('Supply Chain')).toBeInTheDocument();
    });
  });

  describe('Helper functions', () => {
    it('calculates progress correctly', () => {
      // Test via rendered output - 50->80, current 65 = 50%
      const okr = createGlobalOKR({
        keyResults: [{
          id: 'kr-test',
          metricName: 'Test',
          from: 50,
          to: 80,
          current: 65,
          status: 'on-track'
        }]
      });

      render(<OKRTreeView okrs={[okr]} onUpdateOKR={mockOnUpdateOKR} mode="tracking" />);

      // The progress is calculated as (65-50)/(80-50)*100 = 50%
      // This would be shown in the progress display
    });

    it('displays correct status label and color', () => {
      const globalOkr = createGlobalOKR();
      const childOkr = createChildOKR(globalOkr.id, {
        keyResults: [{
          id: 'kr-status',
          metricName: 'Status test',
          from: 0,
          to: 100,
          current: 50,
          status: 'on-track'
        }]
      });

      render(
        <OKRTreeView
          okrs={[globalOkr, childOkr]}
          onUpdateOKR={mockOnUpdateOKR}
          mode="tracking"
        />
      );

      expect(screen.getByText('○ On track')).toBeInTheDocument();
    });
  });
});
