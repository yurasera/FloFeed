# MVP - Learner Registration & Login

Goal:
Allow learners to authenticate while keeping feedback anonymous to mentors.

Flow:

Learner:
1. Register or log in.
2. Session is persisted.
3. Continue to feedback flow.

Create:

Data Models:
- Learner
- LearnerSession
- LearnerMembership

TypeScript interfaces:

Learner:
- id
- name
- email
- createdAt

LearnerSession:
- learnerId
- isAuthenticated
- lastActiveAt

LearnerMembership:
- learnerId
- classId
- joinedAt
- isActive

Architecture:

UI
↓
Auth Hooks
↓
Auth Service
↓
Data Models

Requirements:

- Create learner registration screen.
- Create learner login screen.
- Persist authentication state.
- Keep learner identity hidden from mentors.
- Keep existing anonymous feedback flow.
- Keep compatible with existing feedback flow.
- Prepare Supabase Auth-ready architecture.

Constraints:

- Frontend only.
- MVP only.
- No mentor-facing identity.
- No backend implementation.
- No unnecessary dependencies.