# Plan Testów dla Projektu Flashcards AI

## 1. Wprowadzenie i Cele Testowania

### 1.1. Wprowadzenie

Niniejszy dokument opisuje plan testów dla aplikacji webowej Flashcards AI. Aplikacja umożliwia użytkownikom tworzenie, zarządzanie oraz naukę przy użyciu fiszek. Kluczową funkcjonalnością jest możliwość automatycznego generowania fiszek na podstawie dostarczonego tekstu, z wykorzystaniem zewnętrznego API sztucznej inteligencji (OpenRouter). Projekt zbudowany jest w oparciu o nowoczesny stos technologiczny, w tym Astro, React, TypeScript, Supabase oraz Tailwind CSS.

### 1.2. Cele Testowania

Główne cele procesu testowania to:

*   Zapewnienie wysokiej jakości i niezawodności aplikacji.
*   Weryfikacja, czy wszystkie funkcjonalności działają zgodnie ze specyfikacją i oczekiwaniami użytkownika.
*   Identyfikacja i zaraportowanie defektów aplikacji.
*   Ocena wydajności, bezpieczeństwa i użyteczności aplikacji.
*   Zapewnienie, że integracje z usługami zewnętrznymi (Supabase, OpenRouter AI) działają poprawnie.
*   Weryfikacja zgodności z dobrymi praktykami tworzenia oprogramowania, w tym dostępności (a11y).

## 2. Zakres Testów

### 2.1. Funkcjonalności objęte testami:

*   **Moduł Uwierzytelniania:**
    *   Rejestracja użytkownika (jeśli zostanie zaimplementowana - obecnie tylko logowanie).
    *   Logowanie użytkownika.
    *   Wylogowywanie użytkownika.
    *   Ochrona ścieżek wymagających autentykacji.
    *   Obsługa błędów logowania (np. nieprawidłowe dane, nieistniejący użytkownik).
*   **Moduł Generowania Fiszek (AI):**
    *   Wprowadzanie tekstu źródłowego (walidacja długości).
    *   Inicjowanie procesu generowania fiszek.
    *   Komunikacja z API AI (OpenRouter).
    *   Wyświetlanie propozycji fiszek.
    *   Możliwość edycji treści (front/back) proponowanych fiszek.
    *   Akceptacja oryginalnych propozycji.
    *   Akceptacja edytowanych propozycji.
    *   Odrzucanie propozycji.
    *   Zapisywanie zaakceptowanych/edytowanych fiszek w bazie danych.
    *   Obsługa błędów generowania (np. błędy API AI, problemy z połączeniem, niepoprawny format odpowiedzi AI).
*   **Moduł Zarządzania Fiszkami:**
    *   Wyświetlanie listy fiszek użytkownika.
    *   Paginacja listy fiszek.
    *   Sortowanie listy fiszek (np. po dacie utworzenia).
    *   (Potencjalnie, jeśli zostanie zaimplementowane) Tworzenie manualne fiszek.
    *   (Potencjalnie) Edycja istniejących fiszek.
    *   (Potencjalnie) Usuwanie fiszek.
*   **Interfejs Użytkownika (UI) i Doświadczenie Użytkownika (UX):**
    *   Nawigacja po aplikacji.
    *   Responsywność interfejsu na różnych urządzeniach (desktop, tablet, mobile).
    *   Czytelność i spójność wizualna.
    *   Obsługa komunikatów (błędy, sukcesy, informacje).
    *   Dostępność (a11y) zgodnie ze standardami WCAG.
*   **API Backendowe:**
    *   Poprawność działania wszystkich endpointów API (autentykacja, fiszki, sesje generowania).
    *   Walidacja danych wejściowych (schematy Zod).
    *   Poprawność formatu odpowiedzi i kodów statusu HTTP.
    *   Obsługa błędów na poziomie API.
    *   Integracja z serwisami i bazą danych Supabase.

### 2.2. Funkcjonalności nieobjęte testami (lub o niższym priorytecie):

*   Testowanie samego modelu AI (OpenRouter) pod kątem jakości generowanych treści (poza zakresem QA aplikacji).
*   Zaawansowane testy penetracyjne (mogą być przeprowadzone w późniejszej fazie przez specjalistów).
*   Testy specyficzne dla konkretnych, bardzo starych przeglądarek (jeśli nie są wspierane).

## 3. Typy Testów do Przeprowadzenia

*   **Testy Jednostkowe (Unit Tests):**
    *   **Cel:** Weryfikacja poprawności działania małych, izolowanych fragmentów kodu (funkcje, komponenty React, hooki, serwisy, schematy Zod).
    *   **Zakres:**
        *   Logika biznesowa w serwisach (`src/lib/services`).
        *   Funkcje pomocnicze (`src/lib/utils`).
        *   Schematy walidacji Zod (`src/lib/schemas`).
        *   Komponenty React (logika, renderowanie warunkowe, obsługa zdarzeń) przy użyciu React Testing Library.
        *   Customowe hooki React (`src/components/hooks`).
        *   Logika wewnątrz plików `.astro` (jeśli dotyczy).
*   **Testy Integracyjne (Integration Tests):**
    *   **Cel:** Weryfikacja poprawnej współpracy między różnymi modułami i komponentami systemu.
    *   **Zakres:**
        *   Integracja komponentów React (np. formularz z jego polami i przyciskiem).
        *   Integracja frontend <-> API backendowe (np. wysyłanie formularza logowania i otrzymywanie odpowiedzi).
        *   Integracja API backendowe <-> Serwisy <-> Baza danych (Supabase).
        *   Integracja z API AI (OpenRouter) – mockowanie odpowiedzi AI.
        *   Testowanie middleware Astro (autentykacja, przekierowania).
*   **Testy End-to-End (E2E Tests):**
    *   **Cel:** Symulacja rzeczywistych scenariuszy użytkownika, testowanie całej aplikacji z perspektywy użytkownika.
    *   **Zakres:**
        *   Pełne przepływy użytkownika: rejestracja (jeśli jest) -> logowanie -> generowanie fiszek -> przeglądanie fiszek -> wylogowanie.
        *   Interakcje z UI na kluczowych stronach.
        *   Weryfikacja poprawności renderowania stron Astro i interaktywnych wysp React.
        *   Testowanie nawigacji i przejść między stronami (w tym View Transitions, jeśli używane).
*   **Testy API (API Tests):**
    *   **Cel:** Bezpośrednie testowanie endpointów API backendowego.
    *   **Zakres:**
        *   Weryfikacja poprawności żądań i odpowiedzi (kody statusu, format danych).
        *   Testowanie walidacji danych wejściowych.
        *   Testowanie autentykacji i autoryzacji na poziomie API.
        *   Obsługa błędów.
*   **Testy Wydajnościowe (Performance Tests):**
    *   **Cel:** Ocena szybkości działania i responsywności aplikacji pod obciążeniem.
    *   **Zakres (podstawowy):**
        *   Czas ładowania kluczowych stron.
        *   Czas odpowiedzi API dla typowych zapytań.
        *   (Potencjalnie) Testy obciążeniowe dla API generowania fiszek.
*   **Testy Bezpieczeństwa (Security Tests):**
    *   **Cel:** Identyfikacja potencjalnych luk bezpieczeństwa.
    *   **Zakres (podstawowy):**
        *   Weryfikacja konfiguracji Row Level Security (RLS) w Supabase (szczególnie w kontekście migracji `disable_all_policies.sql`).
        *   Testowanie ochrony przed podstawowymi atakami (np. XSS poprzez wprowadzanie danych, SQL Injection – Supabase powinien chronić).
        *   Sprawdzenie poprawnego zarządzania sesją i tokenami.
        *   Weryfikacja, czy wrażliwe dane (API keys) nie są eksponowane po stronie klienta.
*   **Testy Użyteczności (Usability Tests):**
    *   **Cel:** Ocena łatwości obsługi i intuicyjności interfejsu użytkownika.
    *   **Zakres:** Przeprowadzane manualnie, potencjalnie z udziałem grupy testowych użytkowników. Ocena nawigacji, zrozumiałości komunikatów, ogólnego wrażenia z użytkowania.
*   **Testy Dostępności (Accessibility Tests - a11y):**
    *   **Cel:** Zapewnienie, że aplikacja jest użyteczna dla osób z różnymi niepełnosprawnościami.
    *   **Zakres:**
        *   Użycie automatycznych narzędzi do skanowania (np. Axe).
        *   Manualna weryfikacja (nawigacja klawiaturą, kontrast, semantyka HTML, atrybuty ARIA).
*   **Testy Wizualne (Visual Regression Tests):**
    *   **Cel:** Wykrywanie niezamierzonych zmian w wyglądzie interfejsu użytkownika.
    *   **Zakres:** Porównywanie zrzutów ekranu kluczowych komponentów i stron z ich wersjami bazowymi.

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

(Przykładowe scenariusze, lista nie jest wyczerpująca)

### 4.1. Logowanie Użytkownika

*   **TC_AUTH_001:** Pomyślne logowanie przy użyciu poprawnych danych.
    *   **Kroki:** 1. Otwórz stronę /login. 2. Wprowadź poprawny email. 3. Wprowadź poprawne hasło. 4. Kliknij "Log in".
    *   **Oczekiwany rezultat:** Użytkownik zostaje przekierowany na stronę /flashcards. Wyświetla się nawigacja dla zalogowanego użytkownika.
*   **TC_AUTH_002:** Nieudane logowanie przy użyciu nieprawidłowego hasła.
    *   **Kroki:** 1. Otwórz stronę /login. 2. Wprowadź poprawny email. 3. Wprowadź niepoprawne hasło. 4. Kliknij "Log in".
    *   **Oczekiwany rezultat:** Wyświetla się komunikat błędu "Invalid login credentials" (lub podobny). Użytkownik pozostaje na stronie /login.
*   **TC_AUTH_003:** Nieudane logowanie przy użyciu nieistniejącego emaila.
    *   **Kroki:** 1. Otwórz stronę /login. 2. Wprowadź nieistniejący email. 3. Wprowadź dowolne hasło. 4. Kliknij "Log in".
    *   **Oczekiwany rezultat:** Wyświetla się komunikat błędu. Użytkownik pozostaje na stronie /login.
*   **TC_AUTH_004:** Walidacja pól formularza logowania (pusty email, niepoprawny format emaila, puste hasło).
    *   **Kroki:** Testuj różne kombinacje niepoprawnych danych wejściowych.
    *   **Oczekiwany rezultat:** Wyświetlają się odpowiednie komunikaty walidacyjne przy polach.
*   **TC_AUTH_005:** Próba dostępu do chronionej strony (/flashcards) bez logowania.
    *   **Kroki:** 1. Wpisz bezpośrednio w pasku adresu URL /flashcards.
    *   **Oczekiwany rezultat:** Użytkownik zostaje przekierowany na stronę /login.
*   **TC_AUTH_006:** Pomyślne wylogowanie.
    *   **Kroki:** 1. Zaloguj się. 2. Kliknij przycisk "Logout" w nawigacji.
    *   **Oczekiwany rezultat:** Użytkownik zostaje przekierowany na stronę /login. Sesja zostaje zakończona.

### 4.2. Generowanie Fiszek

*   **TC_GEN_001:** Pomyślne wygenerowanie i zapisanie oryginalnych propozycji fiszek.
    *   **Kroki:** 1. Zaloguj się. 2. Przejdź do /generate. 3. Wprowadź poprawny tekst źródłowy (1000-10000 znaków). 4. Kliknij "Generate Flashcards". 5. Poczekaj na propozycje. 6. Zaakceptuj kilka propozycji jako "original". 7. Kliknij "Save Proposals".
    *   **Oczekiwany rezultat:** Wyświetla się komunikat sukcesu. Użytkownik jest przekierowywany do /flashcards, gdzie widoczne są nowo zapisane fiszki.
*   **TC_GEN_002:** Generowanie fiszek, edycja propozycji i zapisanie.
    *   **Kroki:** ... 5. Wybierz propozycję, kliknij "Edit". 6. Zmień treść front/back. 7. Kliknij "Done". 8. Zaakceptuj edytowaną propozycję. 9. Kliknij "Save Proposals".
    *   **Oczekiwany rezultat:** Zapisana fiszka zawiera edytowaną treść.
*   **TC_GEN_003:** Odrzucenie wszystkich propozycji.
    *   **Kroki:** ... 5. Odrzuć wszystkie propozycje. 6. Kliknij "Save Proposals".
    *   **Oczekiwany rezultat:** Żadne nowe fiszki nie są tworzone. Przycisk "Save Proposals" może być nieaktywny.
*   **TC_GEN_004:** Walidacja długości tekstu źródłowego (za krótki, za długi).
    *   **Kroki:** Wprowadź tekst <1000 znaków, >10000 znaków.
    *   **Oczekiwany rezultat:** Przycisk "Generate Flashcards" jest nieaktywny lub wyświetla się komunikat walidacyjny.
*   **TC_GEN_005:** Obsługa błędu podczas komunikacji z API AI.
    *   **Kroki:** (Wymaga mockowania błędu od API AI) Zasymuluj błąd odpowiedzi od OpenRouter.
    *   **Oczekiwany rezultat:** Wyświetla się czytelny komunikat błędu dla użytkownika. Formularz pozostaje edytowalny.
*   **TC_GEN_006:** Sprawdzenie licznika znaków i stanu przycisku "Generate".
    *   **Kroki:** Wpisuj tekst i obserwuj licznik oraz aktywność przycisku.
    *   **Oczekiwany rezultat:** Licznik aktualizuje się poprawnie. Przycisk jest aktywny tylko dla poprawnej długości tekstu.

### 4.3. Przeglądanie Fiszek

*   **TC_LIST_001:** Wyświetlanie listy fiszek.
    *   **Kroki:** 1. Zaloguj się. 2. Przejdź do /flashcards.
    *   **Oczekiwany rezultat:** Wyświetla się lista fiszek użytkownika z poprawnymi danymi (front, back, statystyki).
*   **TC_LIST_002:** Paginacja listy fiszek.
    *   **Kroki:** (Wymaga >N fiszek, gdzie N to limit na stronę) 1. Przejdź do /flashcards. 2. Użyj kontrolek paginacji.
    *   **Oczekiwany rezultat:** Wyświetlają się kolejne/poprzednie strony z fiszkami.
*   **TC_LIST_003:** Sortowanie listy fiszek.
    *   **Kroki:** 1. Przejdź do /flashcards. 2. Zmień kryterium sortowania (np. rosnąco/malejąco po dacie).
    *   **Oczekiwany rezultat:** Lista fiszek jest sortowana zgodnie z wybranym kryterium.
*   **TC_LIST_004:** Wyświetlanie pustego stanu, gdy użytkownik nie ma fiszek.
    *   **Kroki:** (Dla nowego użytkownika lub po usunięciu wszystkich fiszek) 1. Przejdź do /flashcards.
    *   **Oczekiwany rezultat:** Wyświetla się komponent `EmptyState` z odpowiednim komunikatem.

## 5. Środowisko Testowe

*   **Środowisko Deweloperskie (Lokalne):**
    *   System operacyjny: Windows, macOS, Linux.
    *   Przeglądarki: Najnowsze wersje Chrome, Firefox, Safari, Edge.
    *   Node.js: Wersja zgodna z projektem (np. z `package.json` lub `astro.config.mjs`).
    *   Dostęp do lokalnej instancji Supabase (lub mockowanej) oraz kluczy API dla OpenRouter (deweloperskich/testowych).
*   **Środowisko Staging/Testowe (Jeśli dostępne):**
    *   Oddzielna instancja aplikacji wdrożona na serwerze zbliżonym do produkcyjnego.
    *   Oddzielna instancja Supabase (testowa baza danych).
    *   Testowe klucze API dla usług zewnętrznych.
*   **Środowisko Produkcyjne:**
    *   Testy dymne (Smoke Tests) po każdym wdrożeniu.
    *   Monitoring i logowanie w celu wykrywania problemów.

## 6. Narzędzia do Testowania

*   **Testy Jednostkowe:**
    *   Framework: Vitest (popularny w ekosystemie Vite, którego używa Astro) lub Jest.
    *   Biblioteka do testowania React: React Testing Library (`@testing-library/react`).
*   **Testy Integracyjne:**
    *   Framework: Vitest
    *   Biblioteki: React Testing Library, Supertest (dla testów API Astro).
    *   Mockowanie: `vi.mock` (Vitest), `jest.mock` (Jest), `msw` (Mock Service Worker) do mockowania API.
*   **Testy E2E:**
    *   Framework: Playwright
*   **Testy API:**
    *   Narzędzia: Postman, Insomnia, lub skrypty z użyciem bibliotek jak `axios`/`node-fetch` w połączeniu z Vitest/Jest.
*   **Testy Wydajnościowe:**
    *   Narzędzia: Lighthouse (wbudowane w Chrome DevTools), k6, Apache JMeter (dla bardziej zaawansowanych testów).
*   **Testy Dostępności:**
    *   Narzędzia: Axe DevTools (rozszerzenie przeglądarki), Storybook z dodatkiem a11y (jeśli Storybook jest używany).
*   **Testy Wizualne:**
    *   Narzędzia: Percy, Applitools, Chromatic (jeśli Storybook jest używany).
*   **CI/CD:**
    *   Platforma: GitHub Actions, GitLab CI, Jenkins.
    *   Integracja testów automatycznych z pipeline CI/CD.
*   **Zarządzanie Testami i Błędami:**
    *   Narzędzia: Jira, TestRail, Xray (lub prostsze rozwiązania jak GitHub Issues).

## 7. Harmonogram Testów

(Przykładowy harmonogram, do dostosowania)

*   **Faza Rozwoju (Sprinty):**
    *   Testy jednostkowe i integracyjne pisane są na bieżąco przez deweloperów.
    *   QA wykonuje testy eksploracyjne i testy nowych funkcjonalności pod koniec sprintu.
*   **Faza Stabilizacji (Przed Wydaniem):**
    *   Pełna regresja (manualna i automatyczna).
    *   Testy E2E.
    *   Testy wydajnościowe i bezpieczeństwa (podstawowe).
    *   Testy użyteczności i dostępności.
*   **Po Wydaniu:**
    *   Testy dymne na produkcji.
    *   Monitoring i analiza logów.

Dokładny harmonogram będzie zależał od planu rozwoju projektu i dostępnych zasobów.

## 8. Kryteria Akceptacji Testów

### 8.1. Kryteria Wejścia (Rozpoczęcia Testów):

*   Kod źródłowy jest dostępny i skompilowany.
*   Środowisko testowe jest przygotowane i skonfigurowane.
*   Dokumentacja (jeśli istnieje) jest dostępna.
*   Kluczowe funkcjonalności są zaimplementowane (przynajmniej w wersji deweloperskiej).

### 8.2. Kryteria Wyjścia (Zakończenia Testów):

*   Wszystkie zaplanowane testy zostały wykonane.
*   Określony procent testów automatycznych zakończył się sukcesem (np. 95-100%).
*   Wszystkie krytyczne i wysokie błędy zostały naprawione i przetestowane ponownie (re-test).
*   Liczba otwartych błędów o niższym priorytecie jest akceptowalna przez zespół projektowy.
*   Dokumentacja testowa (raporty z testów) jest kompletna.
*   Ryzyka związane z jakością zostały ocenione i zaakceptowane.

## 9. Role i Odpowiedzialności w Procesie Testowania

*   **Inżynier QA / Tester:**
    *   Tworzenie i utrzymanie planu testów.
    *   Projektowanie i wykonywanie scenariuszy testowych (manualnych i automatycznych).
    *   Raportowanie i śledzenie błędów.
    *   Współpraca z deweloperami w celu rozwiązywania problemów.
    *   Przygotowywanie raportów z testów.
    *   Dbanie o jakość procesu testowania.
*   **Deweloperzy:**
    *   Pisanie testów jednostkowych i integracyjnych dla swojego kodu.
    *   Naprawianie zgłoszonych błędów.
    *   Uczestnictwo w przeglądach kodu pod kątem testowalności.
    *   Wsparcie QA w diagnozowaniu problemów.
*   **Product Owner / Manager Projektu:**
    *   Definiowanie wymagań i kryteriów akceptacji.
    *   Priorytetyzacja błędów.
    *   Podejmowanie decyzji o wydaniu produktu na podstawie wyników testów.

## 10. Procedury Raportowania Błędów

### 10.1. Cykl Życia Błędu:

1.  **Nowy (New):** Błąd został zgłoszony.
2.  **Otwarty (Open/Assigned):** Błąd został przeanalizowany i przypisany do dewelopera.
3.  **W Trakcie Naprawy (In Progress/Fixed):** Deweloper pracuje nad naprawą błędu / błąd został naprawiony.
4.  **Do Testowania (Resolved/Ready for QA):** Błąd został naprawiony i jest gotowy do ponownego testowania.
5.  **Ponownie Otwarty (Reopened):** Testy wykazały, że błąd nie został naprawiony lub pojawiły się problemy regresyjne.
6.  **Zamknięty (Closed):** Błąd został pomyślnie naprawiony i zweryfikowany.
7.  **Odrzucony (Rejected):** Zgłoszenie nie jest błędem lub jest duplikatem.
8.  **Odroczony (Deferred):** Naprawa błędu została odłożona na później.

### 10.2. Szablon Raportu Błędu:

*   **ID Błędu:** Unikalny identyfikator.
*   **Tytuł:** Krótki, zwięzły opis problemu.
*   **Środowisko:** Wersja aplikacji, przeglądarka, system operacyjny, urządzenie.
*   **Kroki do Reprodukcji:** Szczegółowa lista kroków potrzebnych do odtworzenia błędu.
*   **Obserwowany Rezultat:** Co faktycznie się stało.
*   **Oczekiwany Rezultat:** Co powinno się stać.
*   **Priorytet:** (np. Krytyczny, Wysoki, Średni, Niski) - wpływ na użytkownika/biznes.
*   **Dotkliwość (Severity):** (np. Krytyczna, Duża, Średnia, Mała) - techniczny wpływ błędu.
*   **Załączniki:** Zrzuty ekranu, nagrania wideo, logi.
*   **Zgłaszający:** Osoba, która znalazła błąd.
*   **Data Zgłoszenia:**
*   **Przypisany Do:** Deweloper odpowiedzialny za naprawę.

### 10.3. Narzędzie do Śledzenia Błędów:

Zostanie wykorzystane narzędzie takie jak GitHub Issues, Jira lub inne dedykowane narzędzie do zarządzania projektami i śledzenia błędów, zgodnie z ustaleniami zespołu.
