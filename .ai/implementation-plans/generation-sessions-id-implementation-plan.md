# API Endpoint Implementation Plan: POST /api/generation-sessions/{id}/flashcards

## 1. Przegląd punktu końcowego
Endpoint umożliwia akceptację, edycję lub odrzucenie fiszek wygenerowanych w ramach sesji generowania. Użytkownik po uwierzytelnieniu przekazuje listę operacji na tymczasowych fiszkach, a serwer zwraca zaktualizowane statystyki sesji oraz nowo utworzone fiszki.

## 2. Szczegóły żądania
- Metoda HTTP: POST
- Ścieżka: `/api/generation-sessions/{id}/flashcards`
- Auth required: tak (token w nagłówku lub ciasteczko, `context.locals.supabase`)
- Parametry ścieżki: `id` (UUID sesji generowania)
- Request Body (application/json):
  ```json
  {
    "flashcards": [
      {
        "temp_id": "temp-uuid-1",
        "action": "accept_original",  // accept_original | accept_edited | reject
        "front": "Generated question 1",
        "back": "Generated answer 1"
      },
      {
        "temp_id": "temp-uuid-2",
        "action": "accept_edited",
        "front": "Edited question 2",
        "back": "Edited answer 2"
      },
      {
        "temp_id": "temp-uuid-3",
        "action": "reject"
      }
    ]
  }
  ```
- Weryfikacja danych (Zod):
  - `flashcards`: niepusta tablica obiektów
  - Każdy obiekt zawiera:
    - `temp_id`: string (UUID tymczasowy)
    - `action`: enum ["accept_original","accept_edited","reject"]
    - `front` i `back`: string (max 1000 znaków), wymagane gdy `action` ≠ "reject"

## 3. Szczegóły odpowiedzi
- Status 200: operacja udana
- Struktura odpowiedzi:
  ```json
  {
    "session": {
      "id": "uuid",
      "flashcards_accepted_original": 6,
      "flashcards_accepted_edited": 4,
      "flashcards_rejected": 3
    },
    "created_flashcards": [
      {
        "id": "uuid-1",
        "front": "Generated question 1",
        "back": "Generated answer 1",
        "origin_type": "ai_generated_original"
      },
      {
        "id": "uuid-2",
        "front": "Edited question 2",
        "back": "Edited answer 2",
        "origin_type": "ai_generated_edited"
      }
    ]
  }
  ```
- Błędy: 400 (walidacja), 401 (unauthorized), 404 (session not found), 500 (server error)

## 4. Przepływ danych
1. Autoryzacja: pobranie `user_id` z `context.locals.supabase`
2. Parsowanie i walidacja `sessionId` z URL oraz ciała żądania (Zod)
3. Pobranie sesji z bazy i weryfikacja przynależności do użytkownika → 401/404
4. Przetworzenie listy fiszek:
   - Dla `accept_original` i `accept_edited`: przygotowanie rekordów do INSERT (z `origin_type`, `user_id`, `generation_session_id`)
   - Dla `reject`: zliczenie, bez wstawiania
5. Transakcja Supabase:
   - Aktualizacja `generation_sessions` (inkrementacja liczników)
   - Batch INSERT do `flashcards`
6. Pobranie zaktualizowanych liczników i utworzonych fiszek
7. Zwrócenie odpowiedzi 200

## 5. Względy bezpieczeństwa
- Autoryzacja: tylko właściciel sesji
- Parametryzowane zapytania Supabase przeciwko SQL injection
- Walidacja długości i typów zapobiegająca DoS i nieprawidłowym danym

## 6. Obsługa błędów
- 400: niepoprawne dane wejściowe (Zod)
- 401: brak/domyślny token lub brak dostępu do sesji
- 404: nieznaleziona sesja
- 500: nieoczekiwany błąd serwera

## 7. Wydajność
- Batch INSERT/UPDATE w jednej transakcji Supabase
- Limit liczby fiszek w ciele żądania (np. max 100)
- Unikanie wielu round-tripów do DB

## 8. Kroki implementacji
1. Utworzyć plik API: `src/pages/api/generation-sessions/[id]/flashcards.ts`
2. Zdefiniować Zod schema i użyć istniejących typów `AcceptFlashcardsCommand` oraz `AcceptFlashcardsResponseDto`
3. W API:
   - Pobranie `sessionId` i `userId`
   - Walidacja żądania
   - Wywołanie serwisu `acceptFlashcards`
   - Zwrócenie odpowiedzi
4. W `src/lib/services/generation-sessions.ts`:
   - Dodać `async function acceptFlashcards(sessionId, userId, dto): Promise<AcceptFlashcardsResponseDto>`
   - Zaimplementować transakcję Supabase (UPDATE + INSERT)
5. Dodać logowanie błędów w `src/lib/utils/logger.ts`
6. Zaktualizować dokumentację i `.ai/tech-stack.md` jeśli potrzebne