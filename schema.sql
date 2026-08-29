-- Run this in Neon SQL Editor to create the fresher_entries table

create table fresher_entries (
  id uuid primary key default gen_random_uuid(),
  card_id text unique not null,
  name text not null,
  college text not null default 'KRCT',
  department text not null,
  fun_fact text not null,
  dream_job text not null,
  photo text,
  style text not null default 'futuristic',
  made_in_seconds numeric,
  consent_given boolean not null default false,
  created_at timestamptz not null default now()
);

-- Optional: Create an index for faster lookups by card_id
create index idx_fresher_entries_card_id on fresher_entries(card_id);

-- Optional: Create an index for ordering by created_at
create index idx_fresher_entries_created_at on fresher_entries(created_at desc);