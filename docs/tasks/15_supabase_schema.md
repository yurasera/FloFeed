# Supabase Schema Proposal for FloFeed

## Overview

This document maps the current frontend models into a Supabase-ready schema for future backend integration while preserving the current anonymous feedback behavior.

## Model Mapping

| Frontend model | Supabase table | Notes |
| --- | --- | --- |
| Mentor | `public.mentors` | Stores mentor identity and contact info |
| Class | `public.classes` | Stores class metadata and relation to a mentor |
| FeedbackSession | `public.feedback_sessions` | Optional session-level record for each feedback attempt |
| FeedbackResponse | `public.feedback_responses` | Stores anonymous feedback payload |

## Recommended Tables

### 1. mentors

Stores mentor accounts and profile information.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, default `gen_random_uuid()` | Matches frontend `mentor.id` |
| `name` | `text` | NOT NULL | Maps to `mentor.name` |
| `email` | `text` | NOT NULL, unique | Maps to `mentor.email` |
| `created_at` | `timestamptz` | default `now()` | Audit field |
| `updated_at` | `timestamptz` | default `now()` | Audit field |

### 2. classes

Stores class information created by mentors.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, default `gen_random_uuid()` | Matches frontend `class.id` |
| `code` | `text` | NOT NULL, unique | Learner joins via this code |
| `name` | `text` | NOT NULL | Maps to `class.name` |
| `mentor_id` | `uuid` | FK -> `mentors.id`, NOT NULL | Maps to `class.mentorId` |
| `created_at` | `timestamptz` | default `now()` | Maps to `createdAt` |
| `is_active` | `boolean` | default `true` | Maps to `isActive` |
| `updated_at` | `timestamptz` | default `now()` | Audit field |

### 3. feedback_sessions

Optional table to represent a learner feedback attempt before submission.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, default `gen_random_uuid()` | Session identifier |
| `class_id` | `uuid` | FK -> `classes.id`, NOT NULL | Maps to `classId` |
| `selected_mood` | `text` | NOT NULL | Stores learner mood |
| `reflection_answers` | `jsonb` | default `'{}'::jsonb` | Stores reflection answers |
| `created_at` | `timestamptz` | default `now()` | Maps to `createdAt` |

### 4. feedback_responses

Stores the anonymous feedback response submitted by a learner.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, default `gen_random_uuid()` | Maps to `feedbackResponse.id` |
| `class_id` | `uuid` | FK -> `classes.id`, NOT NULL | Maps to `classId` |
| `selected_mood` | `text` | NOT NULL | Maps to `selectedMood` |
| `reflection_answers` | `jsonb` | default `'{}'::jsonb` | Maps to `reflectionAnswers` |
| `created_at` | `timestamptz` | default `now()` | Maps to `createdAt` |
| `is_anonymous` | `boolean` | default `true` | Ensures anonymity |

## Suggested SQL

```sql
create extension if not exists "pgcrypto";

create table if not exists public.mentors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  mentor_id uuid not null references public.mentors(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_active boolean not null default true
);

create table if not exists public.feedback_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  selected_mood text not null,
  reflection_answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback_responses (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  selected_mood text not null,
  reflection_answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  is_anonymous boolean not null default true
);
```

## Indexes

```sql
create index if not exists idx_classes_mentor_id on public.classes(mentor_id);
create index if not exists idx_classes_code on public.classes(code);
create index if not exists idx_feedback_sessions_class_id on public.feedback_sessions(class_id);
create index if not exists idx_feedback_responses_class_id on public.feedback_responses(class_id);
create index if not exists idx_feedback_responses_created_at on public.feedback_responses(created_at desc);
```

## Notes for Anonymous Feedback

- Do not store learner identity in `feedback_responses`.
- Keep `is_anonymous` as a hardcoded `true` flag for now.
- If future authentication is added, store learner identity separately in a different table and avoid linking it to anonymous feedback rows.

## Future Extension Notes

This schema is intentionally simple so it can evolve into:
- role-based access with `profiles` or `auth.users`
- feedback insights materialized views
- analytics tables for mood trends and reflection summaries
- Supabase Realtime or Edge Functions for dashboard updates
