# Schemat bazy danych dla projektu 10x-cards

## Tabele

### Tabela: flashcards
- **id** (UUID, PRIMARY KEY, NOT NULL) - unikalny identyfikator fiszki
- **user_id** (UUID, NOT NULL) - identyfikator użytkownika (klucz obcy do tabeli użytkowników Supabase)
- **front** (TEXT, NOT NULL) - treść przodu fiszki (maks. 1000 znaków)
- **back** (TEXT, NOT NULL) - treść tyłu fiszki (maks. 1000 znaków)
- **origin_type** (TEXT, NOT NULL) - typ pochodzenia fiszki (`manual`, `ai_generated_original`, `ai_generated_edited`)
- **generation_session_id** (UUID, NULLABLE) - identyfikator sesji generowania (klucz obcy do tabeli `generation_sessions`)
- **created_at** (TIMESTAMP WITH TIME ZONE, DEFAULT now(), NOT NULL) - data utworzenia
- **updated_at** (TIMESTAMP WITH TIME ZONE, DEFAULT now(), NOT NULL) - data ostatniej aktualizacji
- **last_studied_at** (TIMESTAMP WITH TIME ZONE, NULLABLE) - data ostatniej nauki
- **next_review_at** (TIMESTAMP WITH TIME ZONE, NULLABLE) - data następnej powtórki
- **review_count** (INTEGER, DEFAULT 0, NOT NULL) - licznik powtórek
- **successful_reviews** (INTEGER, DEFAULT 0, NOT NULL) - licznik poprawnych odpowiedzi

### Tabela: generation_sessions
- **id** (UUID, PRIMARY KEY, NOT NULL) - unikalny identyfikator sesji generowania
- **user_id** (UUID, NOT NULL) - identyfikator użytkownika (klucz obcy do tabeli użytkowników Supabase)
- **source_text_size** (INTEGER, NOT NULL) - rozmiar tekstu źródłowego
- **generation_time_ms** (INTEGER, NOT NULL) - czas generowania w milisekundach
- **total_flashcards_generated** (INTEGER, NOT NULL) - liczba wygenerowanych fiszek
- **flashcards_accepted_original** (INTEGER, NOT NULL) - liczba zaakceptowanych fiszek bez edycji
- **flashcards_accepted_edited** (INTEGER, NOT NULL) - liczba zaakceptowanych fiszek po edycji
- **flashcards_rejected** (INTEGER, NOT NULL) - liczba odrzuconych fiszek
- **created_at** (TIMESTAMP WITH TIME ZONE, DEFAULT now(), NOT NULL) - data utworzenia sesji

## Relacje między tabelami
- Jeden-do-wielu: `generation_sessions.id` → `flashcards.generation_session_id`
- Jeden-do-wielu: `users.id` → `flashcards.user_id`
- Jeden-do-wielu: `users.id` → `generation_sessions.user_id`

## Indeksy
- **flashcards_user_id_idx**: indeks na kolumnie `user_id` w tabeli `flashcards`
- **generation_sessions_user_id_idx**: indeks na kolumnie `user_id` w tabeli `generation_sessions`

## Zasady PostgreSQL (RLS)
### Tabela: flashcards
- **SELECT**: Użytkownik może wyświetlać tylko swoje fiszki (`auth.uid() = user_id`)
- **INSERT**: Użytkownik może dodawać fiszki tylko dla swojego `user_id`
- **UPDATE**: Użytkownik może aktualizować tylko swoje fiszki (`auth.uid() = user_id`)
- **DELETE**: Użytkownik może usuwać tylko swoje fiszki (`auth.uid() = user_id`)

### Tabela: generation_sessions
- **SELECT**: Użytkownik może wyświetlać tylko swoje sesje generowania (`auth.uid() = user_id`)
- **INSERT**: Użytkownik może dodawać sesje generowania tylko dla swojego `user_id`
- **UPDATE**: Użytkownik nie może aktualizować sesji generowania (tylko odczyt)
- **DELETE**: Użytkownik może usuwać tylko swoje sesje generowania (`auth.uid() = user_id`)

## Uwagi
- Wszystkie daty i czasy są przechowywane w strefie czasowej UTC.
- Pola tekstowe `front` i `back` mają ograniczenie długości do 1000 znaków.
- Polityki RLS są włączone domyślnie dla wszystkich tabel zawierających dane użytkownika.