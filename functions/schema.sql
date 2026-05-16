-- Doubt & Belief D1 Schema
-- Run with: npx wrangler d1 execute doubt-belief-db --file=functions/schema.sql

CREATE TABLE IF NOT EXISTS rounds (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  start_time       INTEGER NOT NULL UNIQUE,  -- unix seconds, midnight UTC
  end_time         INTEGER NOT NULL,
  start_market_cap REAL,                     -- MC snapshot when round opened
  end_market_cap   REAL,
  winner           TEXT,                     -- 'doubt' | 'believe' | null
  created_at       INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS votes (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  round_id       INTEGER NOT NULL REFERENCES rounds(id),
  wallet_address TEXT    NOT NULL DEFAULT '',
  fingerprint    TEXT    NOT NULL,
  side           TEXT    NOT NULL CHECK(side IN ('doubt', 'believe')),
  voted_at       INTEGER DEFAULT (unixepoch()),
  UNIQUE(round_id, fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_votes_round_side ON votes(round_id, side);

CREATE TABLE IF NOT EXISTS price_cache (
  id         INTEGER PRIMARY KEY DEFAULT 1,
  data       TEXT    NOT NULL,
  fetched_at INTEGER NOT NULL
);
