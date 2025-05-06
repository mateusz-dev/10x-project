# Architektura UI dla 10x-cards

## 1. Przegląd struktury UI
Projekt UI składa się z trzech głównych stron Astro (`/login`, `/generate`, `/flashcards`) oraz wspólnego layoutu (`Layout.astro`) zarządzającego autoryzacją, bannerami i responsywnością. Interaktywne elementy realizowane w React, statyczne w Astro.

## 2. Lista widoków

### 2.1 Logowanie
- Ścieżka: `/login`
- Cel: autoryzacja użytkownika
- Kluczowe informacje: pola e-mail, hasło; komunikaty błędów/sukcesu
- Komponenty: `LoginForm` (React), `Banner`
- UX/dostępność/bezpieczeństwo: aria-labels dla pól, role form, ochrona przeciw CSRF, focus management

### 2.2 Generowanie fiszek
- Ścieżka: `/generate`
- Cel: wprowadzenie tekstu, generowanie propozycji, selekcja i zapis
- Kluczowe informacje: textarea z licznikiem (1000–10000), przycisk Generuj, lista propozycji z checkboxami, przycisk Zapisz, sticky `Banner`
- Komponenty: `CharacterCounter`, `FlashcardProposalList`, `Checkbox`, `Banner`
- UX/dostępność/bezpieczeństwo: aria-live dla bannerów, aria-required dla textarea, disabled button podczas fetch, walidacja w hooku

### 2.3 Moje fiszki
- Ścieżka: `/flashcards`
- Cel: wyświetlenie paginowanej listy zapisanych fiszek
- Kluczowe informacje: lista kart (front/back), paginacja Next/Prev, dropdown sortowania created_at asc/desc, `EmptyState`
- Komponenty: `FlashcardList`, `Pagination`, `SortDropdown`, `EmptyState`, `Banner` (błędy ładowania)
- UX/dostępność/bezpieczeństwo: semantyczne listy, aria-controls dla paginacji, ochrona RLS po stronie middleware

## 3. Mapa podróży użytkownika
1. Użytkownik wchodzi na `/login`, wprowadza dane → POST `/api/auth/login` → sukces → redirect `/generate` + banner „Zalogowano pomyślnie”.
2. Na `/generate` wkleja tekst, walidacja 1000–10000 → klik „Generuj” → POST `/api/generation-sessions` → GET propozycji → wyświetlenie listy z checkboxami.
3. Użytkownik wybiera checkboxy → klik „Zapisz” → POST `/api/generation-sessions/[id]/flashcards` → sukces → redirect `/flashcards` + banner „Fiszki zostały zapisane”.
4. Na `/flashcards` widzi zapisaną listę, nawigacja paginacją i sortowaniem.

## 4. Układ i struktura nawigacji
- Brak persistentnego menu w MVP; nawigacja realizowana przez redirecty i przyciski akcji.
- Wspólny `Layout.astro` chroni ścieżki `/generate` i `/flashcards` za pomocą middleware.
- Breadcrumb lub proste linki Next/Prev w paginacji.

## 5. Kluczowe komponenty
- Banner: sticky container z `aria-live` dla komunikatów błędów/sukcesu.
- CharacterCounter: liczy i waliduje długość tekstu.
- FlashcardProposalList: lista propozycji z checkboxami.
- FlashcardList: wyświetla front/back zapisanych fiszek.
- Pagination: Next/Prev, aria-controls.
- SortDropdown: wybór kierunku sortowania.
- EmptyState: komunikat „Brak zapisanych fiszek”.
- AuthContext: przechowuje token i udostępnia fetch z nagłówkami.
