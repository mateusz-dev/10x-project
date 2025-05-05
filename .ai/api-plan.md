# REST API Plan for 10x-cards

## 1. Resources

- **Flashcards**: Main entity for storing and retrieving flashcard data (corresponds to `flashcards` table)
- **Generation Sessions**: Entity for tracking AI generation of flashcards (corresponds to `generation_sessions` table)
- **Users**: Managed through Supabase authentication (referenced in both tables)

## 2. Endpoints

### Flashcards

#### `GET /api/flashcards`
- **Description**: Get all flashcards for the authenticated user
- **Auth required**: Yes
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `sort_by`: Field to sort by (default: 'created_at')
  - `sort_order`: 'asc' or 'desc' (default: 'desc')
  - `origin_type`: Filter by origin type (optional)
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "front": "Question text",
        "back": "Answer text",
        "origin_type": "manual",
        "created_at": "2025-01-01T12:00:00Z",
        "updated_at": "2025-01-01T12:00:00Z",
        "last_studied_at": "2025-01-02T12:00:00Z",
        "next_review_at": "2025-01-05T12:00:00Z",
        "review_count": 3,
        "successful_reviews": 2
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  }
  ```
- **Error codes**:
  - 401: Unauthorized
  - 500: Server error

#### `GET /api/flashcards/due`
- **Description**: Get flashcards due for review
- **Auth required**: Yes
- **Query Parameters**:
  - `limit`: Maximum number of cards to return (default: 20)
- **Response**: Same as GET /api/flashcards
- **Error codes**:
  - 401: Unauthorized
  - 500: Server error

#### `GET /api/flashcards/{id}`
- **Description**: Get a specific flashcard
- **Auth required**: Yes
- **Response**:
  ```json
  {
    "id": "uuid",
    "front": "Question text",
    "back": "Answer text",
    "origin_type": "manual",
    "created_at": "2025-01-01T12:00:00Z",
    "updated_at": "2025-01-01T12:00:00Z",
    "last_studied_at": "2025-01-02T12:00:00Z",
    "next_review_at": "2025-01-05T12:00:00Z",
    "review_count": 3,
    "successful_reviews": 2,
    "generation_session_id": "uuid or null"
  }
  ```
- **Error codes**:
  - 401: Unauthorized
  - 404: Not found
  - 500: Server error

#### `POST /api/flashcards`
- **Description**: Create a new flashcard manually
- **Auth required**: Yes
- **Request body**:
  ```json
  {
    "front": "Question text",
    "back": "Answer text"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "front": "Question text",
    "back": "Answer text",
    "origin_type": "manual",
    "created_at": "2025-01-01T12:00:00Z",
    "updated_at": "2025-01-01T12:00:00Z"
  }
  ```
- **Error codes**:
  - 400: Bad request - validation errors
  - 401: Unauthorized
  - 500: Server error

#### `PUT /api/flashcards/{id}`
- **Description**: Update an existing flashcard
- **Auth required**: Yes
- **Request body**:
  ```json
  {
    "front": "Updated question",
    "back": "Updated answer"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "front": "Updated question",
    "back": "Updated answer",
    "origin_type": "manual",
    "created_at": "2025-01-01T12:00:00Z",
    "updated_at": "2025-01-01T13:00:00Z"
  }
  ```
- **Error codes**:
  - 400: Bad request - validation errors
  - 401: Unauthorized
  - 404: Not found
  - 500: Server error

#### `DELETE /api/flashcards/{id}`
- **Description**: Delete a flashcard
- **Auth required**: Yes
- **Response**:
  ```json
  {
    "success": true,
    "message": "Flashcard successfully deleted"
  }
  ```
- **Error codes**:
  - 401: Unauthorized
  - 404: Not found
  - 500: Server error

#### `POST /api/flashcards/{id}/review`
- **Description**: Submit a review result for a flashcard
- **Auth required**: Yes
- **Request body**:
  ```json
  {
    "success": true
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "next_review_at": "2025-01-10T12:00:00Z",
    "review_count": 4,
    "successful_reviews": 3,
    "last_studied_at": "2025-01-05T12:00:00Z"
  }
  ```
- **Error codes**:
  - 400: Bad request
  - 401: Unauthorized
  - 404: Not found
  - 500: Server error

### Generation Sessions

#### `POST /api/generation-sessions`
- **Description**: Create a generation session with source text and get AI-generated flashcards
- **Auth required**: Yes
- **Request body**:
  ```json
  {
    "source_text": "Text for generating flashcards (between 1000-10000 characters)"
  }
  ```
- **Response**:
  ```json
  {
    "session": {
      "id": "uuid",
      "source_text_size": 2500,
      "generation_time_ms": 3200,
      "total_flashcards_generated": 10,
      "created_at": "2025-01-01T12:00:00Z"
    },
    "suggested_flashcards": [
      {
        "id": "temp-uuid-1",
        "front": "Generated question 1",
        "back": "Generated answer 1"
      },
      {
        "id": "temp-uuid-2",
        "front": "Generated question 2",
        "back": "Generated answer 2"
      }
    ]
  }
  ```
- **Error codes**:
  - 400: Bad request - validation errors
  - 401: Unauthorized
  - 429: Too many requests - rate limited
  - 500: Server error

#### `GET /api/generation-sessions`
- **Description**: Get all generation sessions for the authenticated user
- **Auth required**: Yes
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "source_text_size": 2500,
        "generation_time_ms": 3200,
        "total_flashcards_generated": 10,
        "flashcards_accepted_original": 5,
        "flashcards_accepted_edited": 3,
        "flashcards_rejected": 2,
        "created_at": "2025-01-01T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
  ```
- **Error codes**:
  - 401: Unauthorized
  - 500: Server error

#### `GET /api/generation-sessions/{id}`
- **Description**: Get details of a specific generation session
- **Auth required**: Yes
- **Response**:
  ```json
  {
    "id": "uuid",
    "source_text_size": 2500,
    "generation_time_ms": 3200,
    "total_flashcards_generated": 10,
    "flashcards_accepted_original": 5,
    "flashcards_accepted_edited": 3,
    "flashcards_rejected": 2,
    "created_at": "2025-01-01T12:00:00Z",
    "flashcards": [
      {
        "id": "uuid",
        "front": "Question text",
        "back": "Answer text",
        "origin_type": "ai_generated_original"
      }
    ]
  }
  ```
- **Error codes**:
  - 401: Unauthorized
  - 404: Not found
  - 500: Server error

#### `POST /api/generation-sessions/{id}/flashcards`
- **Description**: Accept, edit, or reject generated flashcards
- **Auth required**: Yes
- **Request body**:
  ```json
  {
    "flashcards": [
      {
        "temp_id": "temp-uuid-1",
        "action": "accept_original",
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
- **Response**:
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
- **Error codes**:
  - 400: Bad request - validation errors
  - 401: Unauthorized
  - 404: Not found
  - 500: Server error

#### `DELETE /api/generation-sessions/{id}`
- **Description**: Delete a generation session
- **Auth required**: Yes
- **Response**:
  ```json
  {
    "success": true,
    "message": "Generation session successfully deleted"
  }
  ```
- **Error codes**:
  - 401: Unauthorized
  - 404: Not found
  - 500: Server error

## 3. Authentication and Authorization

### Authentication
The API will use Supabase for authentication:
- JWT-based token authentication
- Tokens included in the Authorization header: `Authorization: Bearer <token>`
- Tokens expire after a configurable time period

### Authorization
Row Level Security (RLS) policies in Supabase will enforce:
- Users can only access their own flashcards and generation sessions
- Users cannot modify or delete data that doesn't belong to them

## 4. Validation and Business Logic

### Flashcard Validation
- `front` and `back` fields:
  - Cannot be empty
  - Maximum length of 1000 characters
- `origin_type` must be one of:
  - `manual`
  - `ai_generated_original`
  - `ai_generated_edited`

### Generation Session Validation
- `source_text` must be between 1000 and 10000 characters
- All numeric fields must be non-negative integers

### Business Logic
- Spaced repetition algorithm will update `next_review_at` based on review results
- Generation sessions will track statistics about AI generation effectiveness

### Data Security
- All user data is isolated by user_id
- Data is encrypted in transit using HTTPS
- Supabase RLS policies enforce data isolation at the database level