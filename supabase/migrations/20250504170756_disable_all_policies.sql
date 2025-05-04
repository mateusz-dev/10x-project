-- Migration: Disable RLS Policies
-- Description: Drops all RLS policies from flashcards and generation_sessions tables
-- Timestamp: 2025-05-04 17:07:56 UTC

-- Drop policies from flashcards table
drop policy if exists "Authenticated users can view their own flashcards" on flashcards;
drop policy if exists "Anon users cannot view any flashcards" on flashcards;
drop policy if exists "Authenticated users can create their own flashcards" on flashcards;
drop policy if exists "Anon users cannot create flashcards" on flashcards;
drop policy if exists "Authenticated users can update their own flashcards" on flashcards;
drop policy if exists "Anon users cannot update flashcards" on flashcards;
drop policy if exists "Authenticated users can delete their own flashcards" on flashcards;
drop policy if exists "Anon users cannot delete flashcards" on flashcards;

-- Drop policies from generation_sessions table
drop policy if exists "Authenticated users can view their own generation sessions" on generation_sessions;
drop policy if exists "Anon users cannot view generation sessions" on generation_sessions;
drop policy if exists "Authenticated users can create their own generation sessions" on generation_sessions;
drop policy if exists "Anon users cannot create generation sessions" on generation_sessions;
drop policy if exists "Authenticated users can delete their own generation sessions" on generation_sessions;
drop policy if exists "Anon users cannot delete generation sessions" on generation_sessions;