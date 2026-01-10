# Product Roadmap

> **Purpose**: High-level product roadmap with phases and milestones

---

## Vision

Build a simple, elegant OKR management tool that enterprises love - combining Notion's clean UX with enterprise-grade security and compliance.

---

## Current Status

**Phase**: Prototype / MVP
**Users**: Single-user (localStorage)
**Readiness**: Not production-ready

### Completed Features
- [x] Create, edit, delete OKRs
- [x] Key Results with metrics (from % → to %)
- [x] Cascading/nested OKRs (parent-child)
- [x] Tree visualization view
- [x] Inline editing (click to edit)
- [x] Notion-style UI
- [x] Hover actions (+, edit, delete)
- [x] Left-side add button for key results

---

## Role & Permission System

### Overview

The application requires a role-based access control (RBAC) system to manage who can create, edit, and view different types of OKRs.

### Defined Roles

| Role | Description | Typical User |
|------|-------------|--------------|
| **Admin** | Full access, manage users/roles | IT Admin, HR Lead |
| **Executive** | Create/edit Global OKRs only | C-suite, VPs |
| **Manager** | Create/edit Area OKRs (children) | Department heads, Team leads |
| **Contributor** | Edit assigned OKRs, add Key Results | Individual contributors |
| **Viewer** | Read-only access to all OKRs | Stakeholders, new employees |

### Permission Matrix

| Action | Admin | Executive | Manager | Contributor | Viewer |
|--------|-------|-----------|---------|-------------|--------|
| View all OKRs | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create Global OKR | ✓ | ✓ | ✗ | ✗ | ✗ |
| Edit Global OKR | ✓ | ✓ | ✗ | ✗ | ✗ |
| Delete Global OKR | ✓ | ✓ | ✗ | ✗ | ✗ |
| Create Area OKR | ✓ | ✓ | ✓ | ✗ | ✗ |
| Edit Area OKR | ✓ | ✓ | ✓ | ✗ | ✗ |
| Delete Area OKR | ✓ | ✓ | ✓ | ✗ | ✗ |
| Add/Edit Key Results | ✓ | ✓ | ✓ | ✓* | ✗ |
| Manage users | ✓ | ✗ | ✗ | ✗ | ✗ |
| View audit logs | ✓ | ✓ | ✗ | ✗ | ✗ |

*Contributor can only edit OKRs they own or are assigned to

### Implementation Strategy

**Stage 1 (Phase 2):** Basic Roles
- Admin, Manager, Viewer only
- Simple permission checks
- ~1 week additional work

**Stage 2 (Phase 3):** Advanced Permissions
- Executive, Contributor roles
- Fine-grained OKR type permissions
- Custom roles (enterprise feature)
- ~1-2 weeks additional work

---

## Phase 1: Multi-User Foundation (2-4 weeks)

**Goal**: Enable multiple users to use the app with their own data

### Milestone 1.1: Backend Setup
- [ ] Set up Supabase project
- [ ] Create database schema (okrs, key_results tables)
- [ ] Configure Row Level Security policies
- [ ] Set up development environment

### Milestone 1.2: Authentication
- [ ] Implement email/password auth
- [ ] Add login/logout UI
- [ ] Add signup flow
- [ ] Implement session management

### Milestone 1.3: Data Migration
- [ ] Replace localStorage with Supabase client
- [ ] Update CRUD operations
- [ ] Test data persistence
- [ ] Add loading states

### Milestone 1.4: Error Handling
- [ ] Add Error Boundary component
- [ ] Implement try-catch for all async operations
- [ ] Add user-friendly error messages
- [ ] Add toast notifications

**Exit Criteria**:
- Multiple users can sign up and manage their own OKRs
- Data persists across sessions and devices
- Errors are handled gracefully

---

## Phase 2: Team Collaboration & Basic Permissions (3-4 weeks)

**Goal**: Enable teams to share and collaborate on OKRs with role-based access

### Milestone 2.1: Organizations
- [ ] Create organizations table
- [ ] Organization creation flow
- [ ] Invite team members
- [ ] Organization switching

### Milestone 2.2: Basic Role System (Stage 1)
- [ ] Create roles table (Admin, Manager, Viewer)
- [ ] Create user_roles table
- [ ] Implement role assignment UI
- [ ] Add `usePermission` hook for frontend

### Milestone 2.3: Permission Enforcement
- [ ] Add permission checks to all API endpoints
- [ ] Hide/disable UI elements based on role
- [ ] Show "permission denied" messages
- [ ] Test all role combinations

### Milestone 2.4: Shared OKRs
- [ ] Add OKR ownership (owner_id)
- [ ] Add OKR type field (global vs area)
- [ ] View team OKRs
- [ ] Filter by owner

**Exit Criteria**:
- Teams can collaborate on shared OKRs
- Admin, Manager, Viewer roles working
- No permission bypass vulnerabilities

---

## Phase 3: Enterprise Security & Advanced Permissions (3-4 weeks)

**Goal**: Meet enterprise security requirements with full RBAC

### Milestone 3.1: Advanced Permissions (Stage 2)
- [ ] Add Executive role (Global OKR access)
- [ ] Add Contributor role (assigned OKRs only)
- [ ] Implement fine-grained permission matrix
- [ ] Add permission inheritance rules

### Milestone 3.2: User Management
- [ ] Admin user management UI
- [ ] Bulk role assignment
- [ ] Role change audit logging
- [ ] User deactivation (not delete)

### Milestone 3.3: SSO Integration
- [ ] SAML configuration
- [ ] Azure AD integration
- [ ] Okta integration
- [ ] SSO-only mode option

### Milestone 3.4: Audit Logging
- [ ] Log all CRUD operations
- [ ] Log permission changes
- [ ] Include user, timestamp, changes
- [ ] Audit log viewer (admin)
- [ ] Export audit logs

### Milestone 3.5: Security Hardening
- [ ] Input validation (all fields)
- [ ] XSS prevention
- [ ] Rate limiting
- [ ] Security headers

**Exit Criteria**:
- All 5 roles fully functional
- SSO working with major providers
- Complete audit trail
- Security assessment passed

---

## Phase 4: Polish & Scale (2-3 weeks)

**Goal**: Production-ready for 100+ users

### Milestone 4.1: Performance
- [ ] Pagination for large lists
- [ ] React.memo optimization
- [ ] Virtual scrolling (if needed)
- [ ] Database query optimization

### Milestone 4.2: User Experience
- [ ] Loading skeletons
- [ ] Offline support (optional)
- [ ] Keyboard shortcuts
- [ ] Accessibility (ARIA)
- [ ] Permission-aware empty states

### Milestone 4.3: Testing
- [ ] Unit tests (components)
- [ ] Integration tests (API)
- [ ] E2E tests (critical flows)
- [ ] **Permission matrix tests (all roles × all actions)**
- [ ] Load testing

**Exit Criteria**:
- App performs well with 1000+ OKRs
- 80%+ test coverage
- Accessibility audit passed
- All role/permission combinations tested

---

## Phase 5: Advanced Features (Future)

### Potential Features
- [ ] Progress tracking (current value)
- [ ] Check-ins / updates
- [ ] Comments on OKRs
- [ ] @mentions and notifications
- [ ] Slack/Teams integration
- [ ] Mobile app
- [ ] API for integrations
- [ ] Custom fields
- [ ] Templates
- [ ] Time periods (Q1, Q2, etc.)
- [ ] Reporting dashboards
- [ ] Export (CSV, PDF)
- [ ] Bulk operations
- [ ] **Custom roles (enterprise)**
- [ ] **Permission delegation**

---

## Timeline Overview

```
Week 1-2:   Phase 1 - Multi-User Foundation
Week 3-4:   Phase 1 (continued) + Phase 2 start
Week 5-7:   Phase 2 - Team Collaboration & Basic Permissions
Week 8-10:  Phase 3 - Enterprise Security & Advanced Permissions
Week 11-12: Phase 4 - Polish & Scale
Week 13+:   Phase 5 - Advanced Features
```

**Target**: Production-ready for 100 users in **10-12 weeks**

---

## Success Metrics

### Phase 1
- [ ] 10 test users onboarded
- [ ] Zero data loss incidents
- [ ] < 2s page load time

### Phase 2
- [ ] 3 teams actively using
- [ ] All 3 basic roles tested
- [ ] No permission bypass bugs
- [ ] Role assignment < 30 seconds

### Phase 3
- [ ] All 5 roles fully functional
- [ ] SSO login success rate > 99%
- [ ] All operations logged
- [ ] Zero privilege escalation vulnerabilities

### Phase 4
- [ ] Handle 1000 OKRs without lag
- [ ] 80%+ test coverage
- [ ] 100% permission matrix coverage
- [ ] Zero critical bugs

---

## Database Schema for Permissions

```sql
-- Roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Full access, manage users and roles'),
  ('executive', 'Create and edit Global OKRs'),
  ('manager', 'Create and edit Area OKRs'),
  ('contributor', 'Edit assigned OKRs and Key Results'),
  ('viewer', 'Read-only access to all OKRs');

-- User roles in organization
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id),
  assigned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- OKR type for permission checks
ALTER TABLE okrs ADD COLUMN okr_type TEXT
  GENERATED ALWAYS AS (
    CASE WHEN parent_id IS NULL THEN 'global' ELSE 'area' END
  ) STORED;

-- Audit log for permission changes
CREATE TABLE permission_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  target_user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  old_role TEXT,
  new_role TEXT,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase limitations | High | Self-host option available |
| SSO complexity | Medium | Use Supabase enterprise features |
| Performance at scale | Medium | Early load testing |
| Security vulnerabilities | High | Regular security audits |
| **Permission bypass bugs** | **Critical** | **Comprehensive permission tests** |
| **Role confusion for users** | **Medium** | **Clear UI, tooltips, documentation** |

---

## Decision Points

- [ ] **Week 2**: Confirm Supabase vs alternatives
- [ ] **Week 4**: Decide on SSO provider priority
- [ ] **Week 5**: Finalize role definitions with stakeholders
- [ ] **Week 6**: Evaluate need for real-time features
- [ ] **Week 8**: Review permission matrix with security team
- [ ] **Week 10**: Go/no-go for production launch

---

*Last Updated: [Current Date]*
