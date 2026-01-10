# Design System

> **Purpose**: Document UI/UX decisions, color palette, component styles, design inspirations

---

## Design Inspiration

### Primary Inspiration: Notion

The UI is designed to look and feel like Notion - clean, minimal, and focused on content.

Key Notion characteristics adopted:
- Clean white background with subtle gray accents
- Minimal borders and shadows
- Inline editing (click to edit)
- Hover-to-reveal actions
- Left-side "+" button for adding items
- Expandable/collapsible tree structure

---

## Color Palette

### CSS Variables (from App.css)

```css
:root {
  --notion-text: #37352f;        /* Primary text */
  --notion-text-light: #9b9a97;  /* Secondary text */
  --notion-bg: #ffffff;          /* Background */
  --notion-bg-gray: #f7f6f3;     /* Gray background */
  --notion-hover: #efefef;       /* Hover state */
  --notion-border: #e9e9e7;      /* Borders */
  --notion-icon: #9b9a97;        /* Icon color */
  --notion-blue: #2383e2;        /* Primary accent */
  --notion-red: #eb5757;         /* Danger/delete */
  --notion-orange: #d9730d;      /* Parent OKR indicator */
}
```

### Color Usage

| Color | CSS Variable | Usage |
|-------|--------------|-------|
| Dark Gray | `--notion-text` | Primary text, headings |
| Light Gray | `--notion-text-light` | Secondary text, placeholders |
| White | `--notion-bg` | Main background |
| Off-White | `--notion-bg-gray` | Row hover, input backgrounds |
| Light Gray | `--notion-hover` | Button hover states |
| Border Gray | `--notion-border` | Borders, dividers |
| Blue | `--notion-blue` | Primary actions, links, child OKR icons |
| Red | `--notion-red` | Delete actions, errors |
| Orange | `--notion-orange` | Parent/Global OKR icons |

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
```

### Font Sizes

| Element | Size | Weight |
|---------|------|--------|
| Page Title | 32px | 700 |
| Section Header | 20px | 600 |
| Table Header | 12px | 500 (uppercase) |
| Body Text | 14px | 400 |
| Small Text | 13px | 400 |

---

## Iconography

### OKR Type Icons

| Type | Icon | Color | Tooltip |
|------|------|-------|---------|
| Global/Parent OKR | ◎ | Orange | "Global OKR" |
| Area/Child OKR | ◎ | Blue | "Area OKR" |
| Key Result | ◉ | Blue | "Key Result" |

### Action Icons

| Action | Icon | Notes |
|--------|------|-------|
| Add | + | Left margin (Notion-style) |
| Edit | ✎ | Row actions |
| Delete | ✕ | Row actions, red on hover |
| Expand | ▶ | Collapsed state |
| Collapse | ▼ | Expanded state |

---

## Component Patterns

### Row Component

```
┌─────────────────────────────────────────────────────────┐
│ [+] [▶] [◎] Objective Title                    [✎] [✕] │
└─────────────────────────────────────────────────────────┘
     │    │    │                                  │
     │    │    │                                  └── Actions (on hover)
     │    │    └── Icon + Title
     │    └── Expand/Collapse toggle
     └── Add button (on hover, outside table)
```

### Hover Behavior

1. **Row hover**: Light gray background (`--notion-bg-gray`)
2. **Action buttons**: Appear only on row hover
3. **Add button (+)**: Appears in left margin on row hover
4. **Icon tooltip**: Shows on icon hover (cursor: default)

### Inline Editing

1. Click on text → transforms to input field
2. Input has blue bottom border (`--notion-blue`)
3. Enter → saves changes
4. Escape → cancels changes
5. Click away → saves changes

### Key Result Editing

```
┌─────────────────────────────────────────────────────────┐
│ [Metric Name] : [From]% → [To]%                         │
└─────────────────────────────────────────────────────────┘
```

- Metric name: flexible width input
- From/To: 50px fixed width, number inputs
- Separators styled with `--notion-text-light`

---

## Spacing & Layout

### App Layout

```css
.notion-app {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 60px;
}
```

### Row Indentation

- Base padding: 8px
- Per level: 24px
- Formula: `paddingLeft = level * 24 + 8`

### Button Sizes

| Type | Size | Notes |
|------|------|-------|
| Primary Button | 6px 12px padding | Blue background |
| Action Button | 24px × 24px | Icon buttons |
| Expand Button | 20px × 20px | Toggle |
| Add Button | 18px × 18px | Left margin |

---

## Interactive States

### Buttons

```css
/* Default */
background: none;
color: var(--notion-icon);

/* Hover */
background: var(--notion-hover);
color: var(--notion-text);

/* Danger Hover (delete) */
color: var(--notion-red);
```

### Inputs

```css
/* Default */
border: 1px solid var(--notion-border);

/* Focus */
border-color: var(--notion-blue);
```

### Inline Inputs

```css
/* Inline editing mode */
border: none;
border-bottom: 2px solid var(--notion-blue);
background: transparent;
```

---

## Animation & Transitions

```css
/* Standard transition */
transition: background-color 0.1s;
transition: opacity 0.1s;
```

Keep animations subtle and fast (100ms).

---

## Accessibility Considerations

### Current Status
- [ ] ARIA labels needed
- [ ] Keyboard navigation incomplete
- [ ] Focus states need improvement
- [ ] Screen reader support missing

### Planned Improvements
- Add `aria-label` to icon buttons
- Implement full keyboard navigation
- Add visible focus indicators
- Test with screen readers

---

## Design Decisions Log

### DD-001: Notion-Style Interface

**Decision**: Adopt Notion's visual language
**Rationale**:
- Familiar to many users
- Clean and professional
- Content-focused
- Works well for hierarchical data

### DD-002: Orange for Parent OKRs

**Decision**: Use orange color for Global/Parent OKRs, blue for children
**Rationale**:
- Visual hierarchy
- Quick identification of OKR level
- Consistent with "importance" color associations

### DD-003: Left-Side Add Button

**Decision**: Place "+" button in left margin (outside table)
**Rationale**:
- Matches Notion's pattern
- Doesn't interfere with row content
- Clear affordance for adding items

### DD-004: Inline Editing

**Decision**: Edit content in-place rather than modal/form
**Rationale**:
- Faster workflow
- Less context switching
- More intuitive

---

*Last Updated: [Date]*
