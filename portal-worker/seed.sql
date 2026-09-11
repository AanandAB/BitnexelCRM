-- Seed a test client + project bound to the studio owner's Google email,
-- so the portal shows real data immediately after first sign-in.
-- Phase 4 replaces this with live CRM-synced data.

INSERT OR REPLACE INTO clients (id, email, name, company, created_at)
VALUES ('client-test', 'aanandab44@gmail.com', 'Aanand AB', 'Bitnexel Studio', '2026-09-12T00:00:00.000Z');

INSERT OR REPLACE INTO projects (id, client_email, name, category, status, stage, summary, created_at)
VALUES (
  'proj-test',
  'aanandab44@gmail.com',
  'Theyyam Trails — Field Guide & Calendar',
  'Custom Software',
  'active',
  'design',
  'Offline-first Flutter field guide to Kerala''s Theyyam tradition — 973 venues mapped.',
  '2026-09-12T00:00:00.000Z'
);

INSERT OR REPLACE INTO milestones (id, project_id, name, status, due_date) VALUES ('ms-1', 'proj-test', 'Discovery & Spec Definition', 'done', '2026-09-14');
INSERT OR REPLACE INTO milestones (id, project_id, name, status, due_date) VALUES ('ms-2', 'proj-test', 'Bespoke UI/UX Design', 'current', '2026-09-28');
INSERT OR REPLACE INTO milestones (id, project_id, name, status, due_date) VALUES ('ms-3', 'proj-test', 'Sprint Engineering', 'upcoming', '2026-10-19');
