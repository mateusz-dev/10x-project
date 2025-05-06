# API Endpoint Implementation Plan: GET /api/flashcards

## 1. Przegląd punktu końcowego
Pobranie paginowanej, posortowanej i opcjonalnie filtrowanej listy fiszek (flashcards) przypisanych do uwierzytelnionego użytkownika.

## 2. Szczegóły żądania
- Metoda HTTP: GET  
- Ścieżka URL: `/api/flashcards`  
- Parametry zapytania:
  - Wymagane: brak (domyślne wartości stosowane, gdy nie podane)  
  - Opcjonalne:
    - `page` (number, default: 1)  
    - `limit` (number, default: 20)  
    - `sort_by` (string, default: `created_at`)  
    - `sort_order` (enum: `asc` | `desc`, default: `desc`)  
    - `origin_type` (enum: `manual` | `ai_generated_original` | `ai_generated_edited`)
- Request Body: brak

## 3. Wykorzystywane typy
- DTO: `FlashcardDto`, `FlashcardsListResponseDto`, `Pagination`
- Modele komend: brak (GET nie wymaga ciała)

## 4. Szczegóły odpowiedzi
- Kody statusu:
  - 200 OK – pomyślne zwrócenie listy fiszek  
  - 400 Bad Request – błędy walidacji parametrów  
  - 401 Unauthorized – brak lub nieprawidłowe uwierzytelnienie  
  - 500 Internal Server Error – błąd serwera lub zapytania do bazy
- Struktura JSON:
  ```json
  {
    "data": FlashcardDto[],
    "pagination": { "total": number, "page": number, "limit": number, "pages": number }
  }
  ```

## 5. Przepływ danych
1. Uzyskanie `supabase` i `user` z `context.locals` w Astro API Route  
2. Parsowanie i walidacja parametrów zapytania za pomocą Zod  
3. Guard clauses: wczesne zwroty dla błędów uwierzytelnienia i walidacji  
4. Wywołanie serwisu:
   - `supabase.from('flashcards').select(..., { count: 'exact' })`
   - Filtr: `eq('user_id', user.id)`
   - Opcjonalny filtr: `eq('origin_type', origin_type)`
   - Sortowanie: `.order(sort_by, { ascending: sort_order === 'asc' })`
   - Paginacja: `.range((page-1)*limit, page*limit - 1)`
5. Mapowanie danych na `FlashcardDto` i obliczenie (`total`, `pages`)  
6. Zwrócenie struktury JSON z `data` i `pagination`

## 6. Względy bezpieczeństwa
- Autoryzacja: 401 przy braku lub nieprawidłowym `user`  
- Walidacja wejścia Zod: ochrona przed nieprawidłowymi wartościami i SQL Injection  
- Użycie `supabase` z kontekstu, nie bezpośredni import klienta  

## 7. Obsługa błędów
- 400: szczegóły błędów walidacji Zod (`error.format()` w ciele)  
- 401: brak `user` w `context.locals`  
- 500: nieprzewidziane wyjątki lub błędy Supabase – logowanie i zwrot ogólnego komunikatu

## 8. Wydajność
- Indeksy na kolumnach: `user_id`, `created_at`, `origin_type`  
- Offset-pagination vs. cursor-pagination – rozważyć kursory dla dużych zbiorów  
- Selekcja tylko potrzebnych kolumn odpowiadających `FlashcardDto`

## 9. Kroki implementacji
1. Utworzyć schemat Zod w `src/lib/schemas/flashcards.ts`  
2. Dodać serwis w `src/lib/services/flashcards.ts` z funkcją `getFlashcards(params)`  
3. Utworzyć plik API route `src/pages/api/flashcards.ts`:
   - Import: Zod, `context.locals.supabase`, schematu i serwisu  
   - Parsowanie, autoryzacja, wywołanie serwisu, zwrot JSON  
4. Implementacja logowania błędów w serwisie lub route  
5. Napisać testy jednostkowe i integracyjne dla walidacji i odpowiedzi  
6. Zaktualizować dokumentację (`README.md` lub OpenAPI)  