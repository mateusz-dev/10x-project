const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export class AIError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "AIError";
  }
}

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface GeneratedFlashcard {
  front: string;
  back: string;
}

const systemPrompt = `You are an AI tutor that helps create high-quality flashcards from provided text.
Generate flashcards that follow these rules:
1. Create question-answer pairs that test understanding, not just memorization
2. Keep questions clear and specific
3. Answers should be concise but complete
4. Avoid yes/no questions
5. Focus on key concepts and relationships

Format your response as a JSON array of objects with 'front' (question) and 'back' (answer) properties.
Example:
[
  {
    "front": "What is the main role of mitochondria in a cell?",
    "back": "Mitochondria are the powerhouse of the cell, producing ATP through cellular respiration"
  }
]`;

export async function generateFlashcards(sourceText: string): Promise<GeneratedFlashcard[]> {
  if (!import.meta.env.OPENROUTER_API_KEY) {
    throw new AIError("OpenRouter API key is not configured", 500);
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": import.meta.env.PUBLIC_SITE_URL,
        "X-Title": "10x-cards Flashcard Generator",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate flashcards from this text:\n${sourceText}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new AIError("Rate limit exceeded for AI service", 429);
      }
      throw new AIError(`AI service error: ${response.statusText}`, 502);
    }

    const result = (await response.json()) as OpenRouterResponse;
    const flashcardsJson = result.choices[0]?.message?.content;

    if (!flashcardsJson) {
      throw new AIError("Invalid response from AI service", 502);
    }

    try {
      const flashcards = JSON.parse(flashcardsJson) as GeneratedFlashcard[];
      if (!Array.isArray(flashcards)) {
        throw new Error("Response is not an array");
      }

      return flashcards.map((card) => ({
        front: card.front.trim(),
        back: card.back.trim(),
      }));
    } catch {
      throw new AIError("Failed to parse AI response", 502);
    }
  } catch (error) {
    if (error instanceof AIError) {
      throw error;
    }
    throw new AIError(
      `Failed to communicate with AI service: ${error instanceof Error ? error.message : "Unknown error"}`,
      502
    );
  }
}
