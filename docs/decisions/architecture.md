# Architecture Decisions

> **Purpose**: Document technical decisions (database, auth, hosting, etc.) and the reasoning behind them

---

## Current Architecture

### Overview

```
┌─────────────────────────────────────────┐
│              Browser                     │
│  ┌─────────────────────────────────┐    │
│  │     React Application           │    │
│  │  ┌───────────┐ ┌─────────────┐  │    │
│  │  │Components │ │   State     │  │    │
│  │  └───────────┘ └─────────────┘  │    │
│  │         │              │        │    │
│  │         └──────┬───────┘        │    │
│  │                ▼                │    │
│  │        ┌─────────────┐          │    │
│  │        │  storage.ts │          │    │
│  │        └──────┬──────┘          │    │
│  └───────────────│─────────────────┘    │
│                  ▼                       │
│          ┌─────────────┐                │
│          │localStorage │                │
│          └─────────────┘                │
└─────────────────────────────────────────┘
```

### Tech Stack (Current)

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | React 18 | With TypeScript |
| Build Tool | Vite | Fast development |
| Styling | CSS | Global stylesheet |
| State | useState/useEffect | Local component state |
| Storage | localStorage | Browser-only |
| Auth | None | - |
| Backend | None | - |

### Current Limitations

1. **No multi-user support** - Data isolated per browser
2. **No authentication** - Anyone can access
3. **No data sync** - Can't share across devices
4. **Limited storage** - 5-10MB localStorage limit
5. **No audit trail** - Can't track changes

---

## Target Architecture

### Recommended: Supabase Backend

```
┌─────────────────┐     ┌──────────────────────────────┐
│  React App      │     │         Supabase             │
│  (Frontend)     │────▶│  ┌────────────────────────┐  │
│                 │     │  │   Auth (Email, SSO)    │  │
│  - Components   │     │  └────────────────────────┘  │
│  - State        │     │  ┌────────────────────────┐  │
│  - Supabase SDK │◀────│  │   PostgreSQL Database  │  │
│                 │     │  │   - okrs table         │  │
│                 │     │  │   - key_results table  │  │
│                 │     │  │   - users table        │  │
│                 │     │  └────────────────────────┘  │
│                 │     │  ┌────────────────────────┐  │
│                 │     │  │   Row Level Security   │  │
│                 │     │  │   (User isolation)     │  │
│                 │     │  └────────────────────────┘  │
└─────────────────┘     └──────────────────────────────┘
```

### Why Supabase?

| Consideration | Supabase | Firebase | Custom Backend |
|---------------|----------|----------|----------------|
| Setup Time | Hours | Hours | Weeks |
| Auth Built-in | ✓ | ✓ | Build yourself |
| SSO/SAML | ✓ (Enterprise) | ✓ | Build yourself |
| PostgreSQL | ✓ | NoSQL only | Your choice |
| Row-level Security | ✓ | ✓ | Build yourself |
| Real-time | ✓ | ✓ | Build yourself |
| Self-host Option | ✓ | ✗ | ✓ |
| Pricing | Generous free tier | Generous free tier | Server costs |

**Decision**: Use Supabase for faster time-to-market with enterprise features built-in.

---

## Database Schema (Planned)

```sql
-- Users (managed by Supabase Auth)
-- Supabase creates auth.users automatically

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization Members
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('admin', 'manager', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OKRs
CREATE TABLE okrs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  owner_id UUID REFERENCES auth.users(id),
  parent_id UUID REFERENCES okrs(id),
  objective TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Key Results
CREATE TABLE key_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  okr_id UUID REFERENCES okrs(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  from_value INTEGER DEFAULT 0,
  to_value INTEGER DEFAULT 100,
  current_value INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Authentication Strategy

### Phase 1: Basic Auth
- Email/password via Supabase Auth
- Magic link (passwordless) option

### Phase 2: Enterprise SSO
- SAML integration for enterprise customers
- Azure AD, Okta support via Supabase

### Authorization Model

```
Organization
├── Admin (full access, manage members)
├── Manager (create OKRs, edit team OKRs)
└── Member (view all, edit own OKRs)
```

---

## Decision Log

### ADR-001: Use Supabase for Backend

**Date**: [Current Date]
**Status**: Proposed
**Context**: Need multi-user support with authentication for enterprise deployment
**Decision**: Use Supabase as backend-as-a-service
**Consequences**:
- Faster development (weeks vs months)
- Built-in auth, SSO support
- PostgreSQL with row-level security
- Vendor dependency (mitigated by self-host option)

### ADR-002: Keep React Frontend

**Date**: [Current Date]
**Status**: Accepted
**Context**: Evaluated whether to rebuild or keep existing frontend
**Decision**: Keep existing React frontend, only replace data layer
**Consequences**:
- Preserve 40-60 hours of UI work
- Minimal refactoring needed
- Replace localStorage calls with Supabase client

### ADR-003: [Future Decision]

**Date**:
**Status**:
**Context**:
**Decision**:
**Consequences**:

---

## Code Quality Assessment Summary

### Current Score: 3-4/10

**Critical Issues Identified**:
1. No backend/database (localStorage only)
2. No authentication/authorization
3. No error handling for storage operations
4. XSS vulnerability risk (no input sanitization)
5. No audit logging

**Strengths**:
1. Clean React/TypeScript code
2. Good component structure
3. Polished UI/UX
4. Strict TypeScript configuration

**Path to Enterprise**: 2-4 weeks with Supabase integration

---

## Performance Considerations

### Current Concerns
- Full dataset loaded on every operation
- No pagination for large OKR lists
- Recursive rendering without depth limits

### Planned Optimizations
- [ ] Implement pagination (50 OKRs per page)
- [ ] Add React.memo to row components
- [ ] Use useCallback for event handlers
- [ ] Implement virtual scrolling for 1000+ OKRs

---

## Security Considerations

See: [docs/research/enterprise-requirements.md](../research/enterprise-requirements.md)

---

*Last Updated: [Date]*
