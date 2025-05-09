-- Migration: Create Flashcards System Tables
-- Description: Creates the core tables for the flashcard system including:
--   - generation_sessions: Tracks AI-powered flashcard generation sessions
--   - flashcards: Stores individual flashcards with spaced repetition metadata
-- Timestamp: 2025-05-04 16:58:30 UTC

-- Create generation_sessions table
create table generation_sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    source_text_size integer not null,
    generation_time_ms integer not null,
    total_flashcards_generated integer not null,
    flashcards_accepted_original integer not null,
    flashcards_accepted_edited integer not null,
    flashcards_rejected integer not null,
    created_at timestamptz not null default now()
);

-- Create flashcards table
create table flashcards (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    front text not null check (char_length(front) <= 1000),
    back text not null check (char_length(back) <= 1000),
    origin_type text not null check (origin_type in ('manual', 'ai_generated_original', 'ai_generated_edited')),
    generation_session_id uuid references generation_sessions(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    last_studied_at timestamptz,
    next_review_at timestamptz,
    review_count integer not null default 0,
    successful_reviews integer not null default 0
);

-- Create indexes
create index flashcards_user_id_idx on flashcards(user_id);
create index generation_sessions_user_id_idx on generation_sessions(user_id);

-- Enable Row Level Security
alter table flashcards enable row level security;
alter table generation_sessions enable row level security;

-- Flashcards RLS Policies
-- Note: Separate policies for authenticated and anon users for clarity and maintainability

-- Select policies
create policy "Authenticated users can view their own flashcards"
    on flashcards
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Anon users cannot view any flashcards"
    on flashcards
    for select
    to anon
    using (false);

-- Insert policies
create policy "Authenticated users can create their own flashcards"
    on flashcards
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Anon users cannot create flashcards"
    on flashcards
    for insert
    to anon
    with check (false);

-- Update policies
create policy "Authenticated users can update their own flashcards"
    on flashcards
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Anon users cannot update flashcards"
    on flashcards
    for update
    to anon
    using (false);

-- Delete policies
create policy "Authenticated users can delete their own flashcards"
    on flashcards
    for delete
    to authenticated
    using (auth.uid() = user_id);

create policy "Anon users cannot delete flashcards"
    on flashcards
    for delete
    to anon
    using (false);

-- Generation Sessions RLS Policies

-- Select policies
create policy "Authenticated users can view their own generation sessions"
    on generation_sessions
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Anon users cannot view generation sessions"
    on generation_sessions
    for select
    to anon
    using (false);

-- Insert policies
create policy "Authenticated users can create their own generation sessions"
    on generation_sessions
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Anon users cannot create generation sessions"
    on generation_sessions
    for insert
    to anon
    with check (false);

-- Update policies
create policy "Authenticated users can update their own generation sessions"
    on generation_sessions
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Anon users cannot update generation sessions"
    on generation_sessions
    for update
    to anon
    using (false);

-- Delete policies
create policy "Authenticated users can delete their own generation sessions"
    on generation_sessions
    for delete
    to authenticated
    using (auth.uid() = user_id);

create policy "Anon users cannot delete generation sessions"
    on generation_sessions
    for delete
    to anon
    using (false);

-- Create function to automatically update updated_at
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Create trigger for flashcards updated_at
create trigger update_flashcards_updated_at
    before update on flashcards
    for each row
    execute function update_updated_at_column();