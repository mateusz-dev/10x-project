```markdown
# Plan implementacji widoku Generowania Fiszek

## 1. Przegląd
Widok "Generowanie Fiszek" umożliwia użytkownikom tworzenie zestawów fiszek edukacyjnych przy wsparciu AI. Użytkownik wprowadza tekst źródłowy, na podstawie którego generowane są propozycje fiszek. Następnie może on przeglądać, edytować, akceptować lub odrzucać te propozycje przed ich finalnym zapisem w systemie. Widok ten ma na celu usprawnienie i przyspieszenie procesu tworzenia materiałów do nauki.

## 2. Routing widoku
Widok będzie dostępny pod ścieżką: `/generate`

## 3. Struktura komponentów
```
/src/pages/generate.astro (Strona Astro)
└── GenerateFlashcardsForm.tsx (Główny komponent React dla interaktywności)
    ├── StickyBanner.tsx (Komponent do wyświetlania powiadomień)
    ├── SourceTextInput.tsx (Komponent pola tekstowego z licznikiem znaków)
    │   └── CharacterCounter.tsx (Sub-komponent licznika znaków, zintegrowany w SourceTextInput)
    ├── GenerateButton.tsx (Przycisk uruchamiający generowanie fiszek)
    ├── FlashcardProposalList.tsx (Lista propozycji fiszek)
    │   └── FlashcardProposalItem.tsx (Pojedynczy element listy propozycji)
    │       ├── (Elementy UI do edycji frontu/tyłu fiszki)
    │       └── (Elementy UI do wyboru akcji: akceptuj, edytuj, odrzuć)
    └── SaveProposalsButton.tsx (Przycisk zapisujący przetworzone propozycje)
```

## 4. Szczegóły komponentów

### `GenerateFlashcardsForm.tsx` (Klientowy komponent React)
- **Opis komponentu**: Główny komponent React zarządzający całym procesem generowania fiszek na stronie `/generate`. Odpowiada za interakcję z użytkownikiem, zarządzanie stanem formularza, komunikację z API oraz koordynację sub-komponentów.
- **Główne elementy**: `StickyBanner`, `SourceTextInput`, `GenerateButton`, `FlashcardProposalList`, `SaveProposalsButton`.
- **Obsługiwane interakcje**: Wprowadzanie tekstu, inicjowanie generowania fiszek, modyfikacja i selekcja propozycji, zapisywanie fiszek.
- **Obsługiwana walidacja**: Długość tekstu źródłowego (przekazywana do `SourceTextInput` i używana do włączania/wyłączania `GenerateButton`).
- **Typy**: Wewnętrznie zarządza stanem takim jak `sourceText`, `suggestedFlashcards`, `sessionId`, `isLoadingGeneration`, `isLoadingSaving`, `error`, `successMessage`.
- **Propsy**: Brak (jest to komponent najwyższego poziomu dla tej funkcjonalności na stronie).

### `SourceTextInput.tsx`
- **Opis komponentu**: Komponent React zawierający pole `textarea` do wprowadzania tekstu źródłowego przez użytkownika oraz licznik znaków.
- **Główne elementy**: `textarea`, element wyświetlający liczbę znaków (`CharacterCounter`).
- **Obsługiwane interakcje**: Wprowadzanie tekstu.
- **Obsługiwana walidacja**: Wizualne wskazanie przekroczenia minimalnej/maksymalnej liczby znaków (np. zmiana koloru licznika). `aria-required="true"`.
- **Typy**:
  - Props: `value: string`, `onChange: (value: string) => void`, `minLength: number`, `maxLength: number`, `placeholder?: string`.
- **Propsy**:
  - `value: string`: Aktualna wartość tekstu.
  - `onChange: (value: string) => void`: Funkcja zwrotna wywoływana przy zmianie tekstu.
  - `minLength: number`: Minimalna wymagana liczba znaków.
  - `maxLength: number`: Maksymalna dozwolona liczba znaków.
  - `placeholder?: string`: Tekst zastępczy dla pola textarea.

### `GenerateButton.tsx`
- **Opis komponentu**: Przycisk React służący do uruchomienia procesu generowania fiszek.
- **Główne elementy**: `button`.
- **Obsługiwane interakcje**: Kliknięcie.
- **Obsługiwana walidacja**: Przycisk jest nieaktywny (`disabled`), jeśli warunki walidacji tekstu źródłowego nie są spełnione lub trwa proces ładowania.
- **Typy**:
  - Props: `onClick: () => void`, `isLoading: boolean`, `disabled: boolean`.
- **Propsy**:
  - `onClick: () => void`: Funkcja zwrotna wywoływana po kliknięciu.
  - `isLoading: boolean`: Informuje, czy trwa proces generowania.
  - `disabled: boolean`: Informuje, czy przycisk powinien być nieaktywny.

### `FlashcardProposalList.tsx`
- **Opis komponentu**: Komponent React wyświetlający listę propozycji fiszek wygenerowanych przez AI.
- **Główne elementy**: Lista komponentów `FlashcardProposalItem`.
- **Obsługiwane interakcje**: Przekazuje zdarzenia z `FlashcardProposalItem` do komponentu nadrzędnego.
- **Obsługiwana walidacja**: Brak bezpośredniej walidacji; wyświetla dane.
- **Typy**:
  - Props: `proposals: SuggestedFlashcardViewModel[]`, `onUpdateProposal: (updatedProposal: SuggestedFlashcardViewModel) => void`.
  - `SuggestedFlashcardViewModel`: Zdefiniowany w sekcji "Typy".
- **Propsy**:
  - `proposals: SuggestedFlashcardViewModel[]`: Tablica propozycji fiszek do wyświetlenia.
  - `onUpdateProposal: (updatedProposal: SuggestedFlashcardViewModel) => void`: Funkcja zwrotna do aktualizacji pojedynczej propozycji.

### `FlashcardProposalItem.tsx`
- **Opis komponentu**: Komponent React reprezentujący pojedynczą propozycję fiszki na liście. Umożliwia edycję treści (przód, tył) oraz wybór akcji (akceptuj oryginalną, akceptuj edytowaną, odrzuć).
- **Główne elementy**: Pola tekstowe (lub `div` z `contentEditable`) dla przodu i tyłu fiszki, kontrolki do wyboru akcji (np. przyciski, radio buttons), przycisk do przełączania trybu edycji.
- **Obsługiwane interakcje**: Edycja tekstu fiszki, wybór akcji, przełączanie trybu edycji.
- **Obsługiwana walidacja**: Pola edycji mogą mieć walidację (np. niepuste), jeśli akcja to "akceptuj edytowaną".
- **Typy**:
  - Props: `proposal: SuggestedFlashcardViewModel`, `onUpdateProposal: (updatedProposal: SuggestedFlashcardViewModel) => void`.
- **Propsy**:
  - `proposal: SuggestedFlashcardViewModel`: Dane propozycji fiszki.
  - `onUpdateProposal: (updatedProposal: SuggestedFlashcardViewModel) => void`: Funkcja zwrotna do aktualizacji danych propozycji po interakcji użytkownika.

### `SaveProposalsButton.tsx`
- **Opis komponentu**: Przycisk React służący do zapisywania przetworzonych propozycji fiszek.
- **Główne elementy**: `button`.
- **Obsługiwane interakcje**: Kliknięcie.
- **Obsługiwana walidacja**: Przycisk jest nieaktywny (`disabled`), jeśli nie ma propozycji do zapisania lub trwa proces zapisywania.
- **Typy**:
  - Props: `onClick: () => void`, `isLoading: boolean`, `disabled: boolean`.
- **Propsy**:
  - `onClick: () => void`: Funkcja zwrotna wywoływana po kliknięciu.
  - `isLoading: boolean`: Informuje, czy trwa proces zapisywania.
  - `disabled: boolean`: Informuje, czy przycisk powinien być nieaktywny.

### `StickyBanner.tsx`
- **Opis komponentu**: Komponent React wyświetlający komunikaty (np. błędy, sukcesy) w formie "przyklejonego" banera. Zgodny z `shadcn/ui` lub stworzony na jego podstawie.
- **Główne elementy**: Kontener na komunikat, przycisk zamknięcia.
- **Obsługiwane interakcje**: Zamknięcie banera.
- **Obsługiwana walidacja**: Brak.
- **Typy**:
  - Props: `message: string | null`, `type: 'success' | 'error' | 'info'`, `onClose?: () => void`.
  - `aria-live` region dla komunikatów.
- **Propsy**:
  - `message: string | null`: Treść komunikatu. Jeśli `null`, baner jest ukryty.
  - `type: 'success' | 'error' | 'info'`: Typ komunikatu, wpływający na jego wygląd.
  - `onClose?: () => void`: Opcjonalna funkcja zwrotna po zamknięciu banera.

## 5. Typy

### `SuggestedFlashcardViewModel`
Model widoku dla pojedynczej propozycji fiszki, używany w komponencie `FlashcardProposalList` i `FlashcardProposalItem`.
```typescript
interface SuggestedFlashcardViewModel {
  temp_id: string; // Tymczasowe ID z odpowiedzi API (suggested_flashcards[].id)
  front: string; // Aktualna treść przodu fiszki (może być edytowana)
  originalFront: string; // Oryginalna treść przodu fiszki z API
  back: string; // Aktualna treść tyłu fiszki (może być edytowana)
  originalBack: string; // Oryginalna treść tyłu fiszki z API
  action: AcceptFlashcardAction | null; // Akcja wybrana przez użytkownika: "original", "edited", "reject", lub null jeśli brak akcji
  isEditing: boolean; // Lokalny stan UI wskazujący, czy fiszka jest w trybie edycji
}
```

### Typy DTO (Data Transfer Objects) - zgodne z types.ts
- **Do generowania sesji (Request):** `CreationGenerationSessionCommand` (zawiera `source_text: string`)
- **Do generowania sesji (Response):** `CreateGenerationSessionResponseDto`
  ```typescript
  // CreateGenerationSessionResponseDto
  // {
  //   session: CreatedGenerationSessionDto;
  //   suggested_flashcards: {
  //     id: string; // To będzie użyte jako temp_id w SuggestedFlashcardViewModel
  //     front: string;
  //     back: string;
  //   }[];
  // }
  ```
- **Do akceptacji fiszek (Request):** `AcceptFlashcardsCommand`
  ```typescript
  // AcceptFlashcardsCommand
  // {
  //   flashcards: AcceptFlashcardDto[];
  // }

  // AcceptFlashcardDto
  // {
  //   temp_id: string;
  //   action: AcceptFlashcardAction; // "original" | "edited" | "reject"
  //   front?: string; // Wymagane jeśli action === "edited"
  //   back?: string;  // Wymagane jeśli action === "edited"
  // }
  ```
- **Do akceptacji fiszek (Response):** `AcceptFlashcardsResponseDto`

## 6. Zarządzanie stanem
Stan widoku będzie zarządzany głównie przez niestandardowy hook React o nazwie `useGenerateFlashcards`, zlokalizowany w `src/components/hooks/useGenerateFlashcards.ts`.

### `useGenerateFlashcards`
- **Cel**: Hermetyzacja logiki biznesowej i stanu związanego z generowaniem i zarządzaniem propozycjami fiszek.
- **Zarządzany stan**:
  - `sourceText: string`: Tekst źródłowy wprowadzony przez użytkownika.
  - `charCount: number`: Liczba znaków w `sourceText`.
  - `isValidText: boolean`: Czy `sourceText` spełnia kryteria długości.
  - `suggestedFlashcards: SuggestedFlashcardViewModel[]`: Lista propozycji fiszek.
  - `sessionId: string | null`: ID aktywnej sesji generowania.
  - `isLoadingGeneration: boolean`: Status ładowania podczas generowania propozycji.
  - `isLoadingSaving: boolean`: Status ładowania podczas zapisywania zaakceptowanych fiszek.
  - `generationError: string | null`: Komunikat błędu z API generowania.
  - `savingError: string | null`: Komunikat błędu z API zapisywania.
  - `successMessage: string | null`: Komunikat o sukcesie (np. po zapisaniu fiszek).
- **Eksponowane funkcje**:
  - `handleSourceTextChange(text: string)`: Aktualizuje `sourceText`, `charCount`, `isValidText`.
  - `handleGenerateClick()`: Wywołuje API `POST /api/generation-sessions`.
  - `handleUpdateProposal(updatedProposal: SuggestedFlashcardViewModel)`: Aktualizuje stan pojedynczej propozycji w `suggestedFlashcards`.
  - `handleSaveClick()`: Wywołuje API `POST /api/generation-sessions/{id}/flashcards`.
  - `clearMessages()`: Czyści komunikaty błędów i sukcesu.

## 7. Integracja API

### 1. Tworzenie sesji generowania i pobieranie propozycji
- **Endpoint**: `POST /api/generation-sessions`
- **Typ żądania (Request)**: `CreationGenerationSessionCommand`
  ```json
  {
    "source_text": "Tekst źródłowy użytkownika (1000-10000 znaków)"
  }
  ```
- **Typ odpowiedzi (Response)**: `CreateGenerationSessionResponseDto`
  ```json
  {
    "session": { /* ... CreatedGenerationSessionDto ... */ },
    "suggested_flashcards": [
      { "id": "temp-uuid-1", "front": "Pytanie 1", "back": "Odpowiedź 1" },
      /* ...więcej fiszek... */
    ]
  }
  ```
- **Akcja frontendowa**: Wywoływana przez `handleGenerateClick()` w hooku `useGenerateFlashcards`. Po sukcesie, `sessionId` i `suggestedFlashcards` są aktualizowane.

### 2. Akceptacja, edycja, odrzucenie fiszek
- **Endpoint**: `POST /api/generation-sessions/{id}/flashcards` (gdzie `{id}` to `sessionId`)
- **Typ żądania (Request)**: `AcceptFlashcardsCommand`
  ```json
  {
    "flashcards": [
      { "temp_id": "temp-uuid-1", "action": "original" },
      { "temp_id": "temp-uuid-2", "action": "edited", "front": "Edytowane pytanie", "back": "Edytowana odpowiedź" },
      { "temp_id": "temp-uuid-3", "action": "reject" }
      /* ...więcej akcji... */
    ]
  }
  ```
- **Typ odpowiedzi (Response)**: `AcceptFlashcardsResponseDto`
  ```json
  {
    "session": { /* ...zaktualizowane dane sesji... */ },
    "created_flashcards": [ /* ...lista utworzonych fiszek... */ ]
  }
  ```
- **Akcja frontendowa**: Wywoływana przez `handleSaveClick()` w hooku `useGenerateFlashcards`. Po sukcesie, wyświetlany jest komunikat, a lista propozycji może zostać wyczyszczona lub zaktualizowana.

## 8. Interakcje użytkownika
- **Wpisywanie tekstu w `SourceTextInput`**:
  - Stan `sourceText` w hooku jest aktualizowany.
  - Licznik znaków (`CharacterCounter`) odzwierciedla aktualną długość.
  - Przycisk `GenerateButton` staje się aktywny/nieaktywny w zależności od spełnienia kryteriów długości tekstu.
- **Kliknięcie `GenerateButton`**:
  - Rozpoczyna się proces ładowania (`isLoadingGeneration = true`).
  - Przycisk staje się nieaktywny.
  - Wywoływane jest API `POST /api/generation-sessions`.
  - Po odpowiedzi:
    - Sukces: `suggestedFlashcards` są wypełniane, `sessionId` ustawiane, `isLoadingGeneration = false`.
    - Błąd: Wyświetlany jest komunikat błędu w `StickyBanner`, `isLoadingGeneration = false`.
- **Interakcja z `FlashcardProposalItem`**:
  - Użytkownik może edytować tekst `front` i `back` (jeśli `isEditing = true`).
  - Użytkownik wybiera akcję (`original`, `edited`, `reject`).
  - Stan odpowiedniej `SuggestedFlashcardViewModel` w `suggestedFlashcards` jest aktualizowany poprzez `handleUpdateProposal`.
- **Kliknięcie `SaveProposalsButton`**:
  - Rozpoczyna się proces ładowania (`isLoadingSaving = true`).
  - Przycisk staje się nieaktywny.
  - Wywoływane jest API `POST /api/generation-sessions/{id}/flashcards` z przetworzonymi propozycjami.
  - Po odpowiedzi:
    - Sukces: Wyświetlany jest komunikat o sukcesie w `StickyBanner`, `isLoadingSaving = false`. Lista propozycji może zostać wyczyszczona.
    - Błąd: Wyświetlany jest komunikat błędu w `StickyBanner`, `isLoadingSaving = false`.
- **Zamknięcie `StickyBanner`**:
  - Komunikat znika, odpowiedni stan błędu/sukcesu w hooku jest czyszczony.

## 9. Warunki i walidacja
- **Tekst źródłowy (`SourceTextInput`)**:
  - Wymagana długość: 1000-10000 znaków.
  - Walidacja: Realizowana w hooku `useGenerateFlashcards` (`isValidText`).
  - Wpływ na UI: `GenerateButton` jest nieaktywny, jeśli tekst nie spełnia kryteriów. `SourceTextInput` może wizualnie sygnalizować poprawność (np. kolor licznika). `aria-required="true"` na textarea.
- **Zapisywanie propozycji (`SaveProposalsButton`)**:
  - Warunek: Musi istnieć co najmniej jedna propozycja z akcją inną niż `reject` lub `null`.
  - Walidacja: Realizowana w hooku `useGenerateFlashcards` przed wywołaniem API.
  - Wpływ na UI: `SaveProposalsButton` jest nieaktywny, jeśli warunek nie jest spełniony.
- **Edycja fiszki (`FlashcardProposalItem`)**:
  - Jeśli akcja to `"edited"`, pola `front` i `back` nie powinny być puste.
  - Walidacja: Może być realizowana lokalnie w komponencie lub w hooku przy aktualizacji propozycji.

## 10. Obsługa błędów
- **Błędy walidacji frontendu**:
  - Długość tekstu źródłowego: Komunikaty wizualne, blokada `GenerateButton`.
  - Brak propozycji do zapisu: Blokada `SaveProposalsButton`.
- **Błędy API (`POST /api/generation-sessions`)**:
  - `400 Bad Request` (np. błąd walidacji po stronie serwera): Wyświetlić szczegóły błędu z odpowiedzi API w `StickyBanner`.
  - `401 Unauthorized`: Wyświetlić komunikat o braku autoryzacji. (Docelowo przekierowanie do logowania).
  - `429 Too Many Requests`: Wyświetlić komunikat o przekroczeniu limitu zapytań.
  - `500 Internal Server Error`: Wyświetlić ogólny komunikat o błędzie serwera.
  - Inne błędy sieciowe: Wyświetlić ogólny komunikat o problemie z połączeniem.
- **Błędy API (`POST /api/generation-sessions/{id}/flashcards`)**:
  - `400 Bad Request`: Jak wyżej.
  - `401 Unauthorized`: Jak wyżej.
  - `404 Not Found` (sesja nie istnieje): Wyświetlić komunikat o braku sesji, ewentualnie zresetować stan widoku.
  - `500 Internal Server Error`: Jak wyżej.
  - Inne błędy sieciowe: Jak wyżej.
- **Brak wygenerowanych propozycji**: Jeśli API zwróci pustą listę `suggested_flashcards`, wyświetlić stosowny komunikat w miejscu listy.
- **Wszystkie komunikaty błędów** powinny być wyświetlane za pomocą komponentu `StickyBanner` i być możliwe do zamknięcia przez użytkownika. Hook `useGenerateFlashcards` będzie odpowiedzialny za ustawianie i czyszczenie tych komunikatów.

## 11. Kroki implementacji
1.  **Stworzenie struktury plików**:
    -   Utworzenie strony Astro: `/src/pages/generate.astro`.
    -   Utworzenie głównych komponentów React: `/src/components/GenerateFlashcardsForm.tsx`, `SourceTextInput.tsx`, `GenerateButton.tsx`, `FlashcardProposalList.tsx`, `FlashcardProposalItem.tsx`, `SaveProposalsButton.tsx`.
    -   Jeśli `StickyBanner` nie istnieje jako reużywalny komponent `shadcn/ui`, stworzyć go w `/src/components/ui/Banner.tsx` lub dostosować istniejący.
    -   Utworzenie hooka: `/src/components/hooks/useGenerateFlashcards.ts`.
2.  **Implementacja strony Astro (`generate.astro`)**:
    -   Podstawowy layout.
    -   Import i renderowanie komponentu `<GenerateFlashcardsForm client:load />` (lub `client:visible` w zależności od preferencji).
3.  **Implementacja hooka `useGenerateFlashcards`**:
    -   Zdefiniowanie stanu (sourceText, suggestedFlashcards, isLoading, errors, etc.).
    -   Implementacja funkcji obsługi zmiany tekstu (`handleSourceTextChange`).
    -   Implementacja funkcji do komunikacji z API:
        -   `handleGenerateClick` (wołanie `POST /api/generation-sessions`, obsługa odpowiedzi i błędów, mapowanie na `SuggestedFlashcardViewModel`).
        -   `handleSaveClick` (wołanie `POST /api/generation-sessions/{id}/flashcards`, transformacja `SuggestedFlashcardViewModel[]` na `AcceptFlashcardDto[]`, obsługa odpowiedzi i błędów).
    -   Implementacja funkcji `handleUpdateProposal` do aktualizacji stanu pojedynczej propozycji.
    -   Implementacja `clearMessages`.
4.  **Implementacja komponentu `SourceTextInput.tsx`**:
    -   Textarea i licznik znaków.
    -   Obsługa propsów `value`, `onChange`, `minLength`, `maxLength`.
    -   Dodanie atrybutów ARIA (`aria-required`, `aria-describedby` dla licznika).
5.  **Implementacja komponentu `GenerateButton.tsx`**:
    -   Przycisk.
    -   Obsługa propsów `onClick`, `isLoading`, `disabled`.
6.  **Implementacja komponentu `FlashcardProposalItem.tsx`**:
    -   Wyświetlanie `front` i `back` propozycji.
    -   Kontrolki do edycji (np. inputy/textarea widoczne w trybie edycji).
    -   Kontrolki do wyboru akcji (`original`, `edited`, `reject`) - np. grupa przycisków.
    -   Przycisk do przełączania `isEditing`.
    -   Wywoływanie `onUpdateProposal` z nowym stanem `SuggestedFlashcardViewModel`.
7.  **Implementacja komponentu `FlashcardProposalList.tsx`**:
    -   Mapowanie tablicy `proposals` na listę komponentów `FlashcardProposalItem`.
    -   Przekazywanie `onUpdateProposal`.
8.  **Implementacja komponentu `SaveProposalsButton.tsx`**:
    -   Przycisk.
    -   Obsługa propsów `onClick`, `isLoading`, `disabled`.
9.  **Implementacja komponentu `StickyBanner.tsx`**:
    -   Wyświetlanie komunikatów `message` z odpowiednim stylem (`type`).
    -   Przycisk do zamknięcia (`onClose`).
    -   Użycie `aria-live` dla dostępności.
10. **Integracja komponentów w `GenerateFlashcardsForm.tsx`**:
    -   Użycie hooka `useGenerateFlashcards` do pobrania stanu i funkcji.
    -   Przekazanie odpowiednich propsów do sub-komponentów.
    -   Renderowanie struktury widoku.
11. **Styling**:
    -   Zastosowanie Tailwind CSS zgodnie z wytycznymi projektu.
    -   Wykorzystanie komponentów `shadcn/ui` tam, gdzie to możliwe (np. Button, Textarea, być może elementy do budowy Bannera).
12. **Testowanie**:
    -   Testowanie manualne wszystkich interakcji użytkownika.
    -   Testowanie obsługi błędów API.
    -   Testowanie walidacji.
    -   Sprawdzenie dostępności (ARIA, nawigacja klawiaturą).
13. **Refaktoryzacja i czyszczenie kodu**:
    -   Przegląd kodu pod kątem zgodności z wytycznymi projektu.
    -   Upewnienie się, że wszystkie typy są poprawnie używane.
