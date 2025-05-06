# API Endpoint Implementation Plan: POST /api/generation-sessions

## 1. Przegląd punktu końcowego
`POST /api/generation-sessions` umożliwia utworzenie nowej sesji generowania fiszek na podstawie dostarczonego tekstu źródłowego. Po walidacji tekstu endpoint:
- mierzy czas generacji
- wywołuje usługę AI przez Openrouter.ai
- parsuje i zwraca tymczasowe fiszki z unikalnymi ID
- zapisuje sesję w bazie (Supabase)

Auth wymagane: tak (używamy `context.locals.supabase`)

## 2. Szczegóły żądania
- Metoda HTTP: POST
- Ścieżka: `/api/generation-sessions`
- Nagłówki: `Content-Type: application/json`, token autoryzacji (np. cookie lub Bearer)
- Parametry:
  - Wymagane:
    - `source_text` (string) – długość między 1000 a 10000 znaków
  - Opcjonalne: brak
- Request Body Schema (Zod):
  ```ts
  z.object({ source_text: z.string().min(1000).max(10000) })
  ```

## 3. Wykorzystywane typy
- Request DTO: `CreationGenerationSessionCommand`
- Response DTO: `CreateGenerationSessionResponseDto`
- Modele: `CreatedGenerationSessionDto`, tymczasowy typ `{ id: string; front: string; back: string }`

## 4. Szczegóły odpowiedzi
- Kody statusu:
  - 201 – utworzenie zakończone sukcesem
  - 400 – błąd walidacji
  - 401 – brak uwierzytelnienia
  - 429 – przekroczono limit
  - 500 – błąd serwera
- Struktura odpowiedzi:
  ```json
  {
    "session": { /* CreatedGenerationSessionDto */ },
    "suggested_flashcards": [ { id, front, back }, ... ]
  }
  ```

## 5. Przepływ danych
1. Autoryzacja: pobranie user_id z `context.locals.supabase`.
2. Walidacja `source_text` (Zod, długość, typ).
3. Pomiar czasu start.
4. Wywołanie usługi AI (Openrouter.ai) z `source_text`.
5. Parsowanie surowej odpowiedzi AI na listę `{ front, back }`.
6. Pomiar czasu zakończenia, przygotowanie metadanych sesji.
7. Transakcja Supabase:
   - INSERT do `generation_sessions`
   - wygenerowanie `temp-uuid` dla każdej fiszki (np. `uuidv4()`)
8. Odpowiedź z kodem 201.

## 6. Względy bezpieczeństwa
- Uwzględnienie uwierzytelnienia i autoryzacji (`context.locals.supabase`).
- Ochrona przed atakami typu injection: korzystanie z parametrów Supabase.
- Ograniczenie wielkości `source_text` i obrona przed DoS.

## 7. Obsługa błędów
- Błędne dane wejściowe → 400 + szczegóły walidacji.
- Brak uwierzytelnienia → 401.
- Limit wywołań AI lub zapytań → 429.
- Błąd w usłudze AI → 502 lub 500.
- Błąd DB → 500 + logowanie.

## 8. Wydajność
- Asynchroniczne wywołanie AI z pomiarem czasu.
- Ograniczenie puli połączeń do Supabase.
- Parsowanie na strumieniach, gdyby odpowiedź AI była duża.

## 9. Kroki implementacji
1. Utworzyć plik API: `src/pages/api/generation-sessions.ts`.
2. Zdefiniować Zod schema i DTO w tym pliku.
3. Ekstrakcja logiki do `src/lib/services/generation-sessions.ts`:
   - funkcja `createGenerationSession(userId, sourceText): Promise<CreateGenerationSessionResponseDto>`
4. Właściwe wywołanie AI w serwisie (Openrouter.ai client).
5. Implementacja wstawiania do Supabase (transakcja) w serwisie.
6. Obsługa błędów i zwrot statusów w API.
7. Dodanie testów jednostkowych: testy walidacji, serwisu, API.
8. Uzupełnić dokumentację w README i zaktualizować `.ai/tech-stack.md` jeśli potrzeba.
9. Code review i deployment.
