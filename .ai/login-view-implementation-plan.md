# Plan implementacji widoku Logowanie

## 1. Przegląd
Widok logowania umożliwia użytkownikom autoryzację w aplikacji. Składa się z formularza logowania, który przyjmuje adres e-mail i hasło, oraz wyświetla komunikaty o błędach lub sukcesie. Widok zapewnia bezpieczeństwo danych użytkownika oraz zgodność z wymaganiami RODO.

## 2. Routing widoku
Ścieżka: `/login`

## 3. Struktura komponentów
- `LoginForm` (React): Formularz logowania.
- `Banner` (React): Komponent wyświetlający baner informacyjny.

## 4. Szczegóły komponentów
### LoginForm
- **Opis komponentu**: Formularz logowania umożliwiający użytkownikowi wprowadzenie adresu e-mail i hasła.
- **Główne elementy**:
  - Pole tekstowe dla e-maila.
  - Pole tekstowe dla hasła (typ `password`).
  - Przycisk „Zaloguj się”.
  - Komunikaty błędów/sukcesu.
- **Obsługiwane interakcje**:
  - Wprowadzenie danych do pól formularza.
  - Kliknięcie przycisku „Zaloguj się”.
  - Wyświetlanie komunikatów o błędach/sukcesie.
- **Obsługiwana walidacja**:
  - Wymagane pola: e-mail i hasło.
  - Walidacja formatu e-maila.
  - Obsługa błędów zwracanych przez API (np. nieprawidłowe dane logowania).
- **Typy**:
  - `LoginRequestDto`: `{ email: string; password: string; }`
  - `LoginResponseDto`: `{ user: { id: string; email: string; }; token: string; }`
- **Propsy**:
  - Brak (komponent samodzielny).

### Banner
- **Opis komponentu**: Wyświetla baner informacyjny lub promocyjny.
- **Główne elementy**:
  - Obrazek lub tekst promocyjny.
- **Obsługiwane interakcje**:
  - Brak (statyczny komponent).
- **Obsługiwana walidacja**:
  - Brak.
- **Typy**:
  - Brak.
- **Propsy**:
  - `message: string` - Treść banera.

## 5. Typy
- `LoginRequestDto`: `{ email: string; password: string; }`
- `LoginResponseDto`: `{ user: { id: string; email: string; }; token: string; }`

## 6. Zarządzanie stanem
Stan formularza logowania będzie zarządzany za pomocą hooka React `useState`. Obsługa błędów i sukcesów będzie realizowana za pomocą lokalnego stanu komponentu.

## 7. Integracja API
- Endpoint: `POST /api/auth/login`
- **Żądanie**:
  - Typ: `LoginRequestDto`
  - Dane: `{ email: string; password: string; }`
- **Odpowiedź**:
  - Typ: `LoginResponseDto`
  - Dane: `{ user: { id: string; email: string; }; token: string; }`

## 8. Interakcje użytkownika
- Wprowadzenie danych do pól formularza.
- Kliknięcie przycisku „Zaloguj się”.
- Wyświetlenie komunikatów o błędach lub sukcesie.

## 9. Warunki i walidacja
- Walidacja formatu e-maila.
- Sprawdzenie, czy pola e-mail i hasło nie są puste.
- Obsługa błędów zwracanych przez API (np. nieprawidłowe dane logowania).

## 10. Obsługa błędów
- Wyświetlanie komunikatów o błędach w przypadku:
  - Nieprawidłowego formatu e-maila.
  - Pustych pól formularza.
  - Błędnych danych logowania zwróconych przez API.
- Logowanie błędów w konsoli dla celów debugowania.

## 11. Kroki implementacji
1. Utwórz komponent `LoginForm` w `src/components`.
2. Dodaj walidację pól formularza (e-mail, hasło).
3. Zaimplementuj obsługę żądania do API (`POST /api/auth/login`).
4. Wyświetlaj komunikaty o błędach/sukcesie na podstawie odpowiedzi API.
5. Utwórz komponent `Banner` w `src/components`.
6. Dodaj routing dla ścieżki `/login` w `src/pages`.