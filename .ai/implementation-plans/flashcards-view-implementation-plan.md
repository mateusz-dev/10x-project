# Plan implementacji widoku Moje fiszki

## 1. Przegląd
Widok "Moje fiszki" umożliwia użytkownikowi przeglądanie zapisanych fiszek w formie paginowanej listy. Użytkownik może sortować fiszki według daty utworzenia (rosnąco/malejąco). Widok obsługuje również stan pustej listy oraz wyświetla komunikaty o błędach ładowania danych.

## 2. Routing widoku
Ścieżka: `/flashcards`

## 3. Struktura komponentów
- `FlashcardList`
  - `FlashcardItem`
- `Pagination`
- `SortDropdown`
- `EmptyState`
- `Banner` (błędy ładowania)

## 4. Szczegóły komponentów
### FlashcardList
- **Opis**: Wyświetla listę fiszek w formie semantycznej listy.
- **Główne elementy**: Lista `<ul>` z elementami `<li>` reprezentującymi fiszki.
- **Obsługiwane interakcje**: Brak.
- **Obsługiwana walidacja**: Brak.
- **Typy**: `FlashcardDto[]`.
- **Propsy**:
  - `flashcards: FlashcardDto[]`

### Pagination
- **Opis**: Umożliwia nawigację między stronami listy fiszek.
- **Główne elementy**: Przyciski "Next" i "Prev" z atrybutami `aria-controls`.
- **Obsługiwane interakcje**: Kliknięcia przycisków nawigacyjnych.
- **Obsługiwana walidacja**: Brak.
- **Typy**: `Pagination`.
- **Propsy**:
  - `pagination: Pagination`
  - `onPageChange: (page: number) => void`

### SortDropdown
- **Opis**: Dropdown umożliwiający sortowanie fiszek według daty utworzenia.
- **Główne elementy**: Element `<select>` z opcjami sortowania.
- **Obsługiwane interakcje**: Zmiana wartości dropdown.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak.
- **Propsy**:
  - `sortOrder: 'asc' | 'desc'`
  - `onSortChange: (order: 'asc' | 'desc') => void`

### EmptyState
- **Opis**: Wyświetla komunikat, gdy lista fiszek jest pusta.
- **Główne elementy**: Prosty komunikat tekstowy.
- **Obsługiwane interakcje**: Brak.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak.
- **Propsy**: Brak.

### Banner
- **Opis**: Wyświetla komunikaty o błędach ładowania danych.
- **Główne elementy**: Element `<div>` z komunikatem o błędzie.
- **Obsługiwane interakcje**: Brak.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak.
- **Propsy**:
  - `message: string`

## 5. Typy
- `FlashcardDto`: Typ reprezentujący fiszkę.
- `Pagination`: Typ reprezentujący dane paginacji.

## 6. Zarządzanie stanem
Stan widoku będzie zarządzany za pomocą hooków Reacta:
- `useState` do przechowywania aktualnej strony i kolejności sortowania.
- `useEffect` do pobierania danych z API przy zmianie strony lub sortowania.

## 7. Integracja API
- **Endpoint**: `GET /api/flashcards`
- **Parametry zapytania**:
  - `page`: numer strony
  - `limit`: liczba elementów na stronę
  - `sort_by`: pole do sortowania (domyślnie `created_at`)
  - `sort_order`: kolejność sortowania (`asc` lub `desc`)
- **Typy odpowiedzi**:
  - `FlashcardsListResponseDto`

## 8. Interakcje użytkownika
- Kliknięcie przycisków paginacji zmienia stronę.
- Zmiana wartości w dropdown sortowania zmienia kolejność sortowania.

## 9. Warunki i walidacja
- Walidacja parametrów zapytania do API odbywa się po stronie backendu za pomocą schematu Zod.
- Komponenty frontendowe nie wymagają dodatkowej walidacji.

## 10. Obsługa błędów
- Wyświetlenie komponentu `Banner` z komunikatem o błędzie w przypadku niepowodzenia zapytania do API.
- Wyświetlenie komponentu `EmptyState`, gdy lista fiszek jest pusta.

## 11. Kroki implementacji
1. Utwórz routing dla ścieżki `/flashcards` w pliku `src/pages/flashcards.astro`.
2. Zaimplementuj komponent `FlashcardList` w `src/components/FlashcardList.tsx`.
3. Zaimplementuj komponent `Pagination` w `src/components/Pagination.tsx`.
4. Zaimplementuj komponent `SortDropdown` w `src/components/SortDropdown.tsx`.
5. Zaimplementuj komponent `EmptyState` w `src/components/EmptyState.tsx`.
6. Zaimplementuj komponent `Banner` w `src/components/Banner.tsx`.
7. Stwórz hook `useFlashcards` w `src/components/hooks/useFlashcards.ts` do zarządzania stanem i integracji z API.
8. Połącz komponenty w widoku `flashcards.astro`.