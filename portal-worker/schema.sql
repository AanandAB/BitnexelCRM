-- Bitnexel client portal schema (D1).
-- Phase 3 ships the schema; Phase 4 syncs real client/project data from the CRM.

CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  client_email TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  status TEXT,
  stage TEXT,
  summary TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT,
  due_date TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_email);
CREATE INDEX IF NOT EXISTS idx_milestones_project ON milestones(project_id);
