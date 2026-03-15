-- SmartDesk — Initial Schema
-- Run this in your Supabase SQL editor or via supabase db push

-- ─── Enable pgvector ─────────────────────────────────────────────────────────
create extension if not exists vector;

-- ─── Table 1: knowledge_chunks ───────────────────────────────────────────────
create table if not exists knowledge_chunks (
  id           uuid primary key default gen_random_uuid(),
  content      text          not null,
  embedding    vector(512),              -- voyage-3-lite outputs 512 dims
  source_file  text          not null,
  chunk_index  integer       not null,
  created_at   timestamptz   not null default now()
);

-- Index for fast ANN similarity search
create index if not exists knowledge_chunks_embedding_idx
  on knowledge_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Index for filtering/deleting by source file
create index if not exists knowledge_chunks_source_idx
  on knowledge_chunks (source_file);

-- ─── Table 2: conversations ──────────────────────────────────────────────────
create table if not exists conversations (
  id               uuid primary key default gen_random_uuid(),
  session_id       text          not null,
  role             text          not null check (role in ('user', 'assistant')),
  content          text          not null,
  confidence       real,                  -- 0.0–1.0, null for user messages
  retrieved_chunks text[],                -- chunk IDs used to generate answer
  created_at       timestamptz   not null default now()
);

create index if not exists conversations_session_idx
  on conversations (session_id);

create index if not exists conversations_created_idx
  on conversations (created_at desc);

create index if not exists conversations_confidence_idx
  on conversations (confidence)
  where confidence is not null;

-- ─── Table 3: bot_config ─────────────────────────────────────────────────────
create table if not exists bot_config (
  id                  uuid primary key default gen_random_uuid(),
  bot_name            text  not null default 'SmartDesk Assistant',
  persona             text  not null default 'friendly'
                        check (persona in ('friendly', 'professional', 'concise')),
  escalation_message  text  not null default 'Please contact us directly and we''ll be happy to help.',
  welcome_message     text  not null default 'Hi! I''m your AI assistant. How can I help you today?',
  updated_at          timestamptz not null default now()
);

-- Insert default config row (bot_config is always a single row)
insert into bot_config (id)
  values (gen_random_uuid())
  on conflict do nothing;

-- ─── RPC: match_chunks ───────────────────────────────────────────────────────
-- Called by lib/rag.ts → retrieveChunks()
-- Returns top-K chunks ordered by cosine similarity to the query embedding
create or replace function match_chunks(
  query_embedding  vector(512),
  match_count      int     default 4,
  match_threshold  float   default 0.3
)
returns table (
  id          uuid,
  content     text,
  source_file text,
  similarity  float
)
language sql stable
as $$
  select
    id,
    content,
    source_file,
    1 - (embedding <=> query_embedding) as similarity
  from knowledge_chunks
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
