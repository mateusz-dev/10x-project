import { z } from "zod";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Response schema validation
const flashcardSchema = z.object({
  front: z.string().min(1).trim(),
  back: z.string().min(1).trim(),
});

const flashcardsResponseSchema = z.object({
  flashcards: z.array(flashcardSchema),
});

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
      content: string; // Changed to string since OpenRouter returns JSON string
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
5. Focus on key concepts and relationships`;

export async function generateFlashcards(sourceText: string): Promise<GeneratedFlashcard[]> {
  const apiKey = import.meta.env.OPENROUTER_API_KEY as string;
  if (!apiKey) {
    throw new AIError("OpenRouter API key is not configured", 500);
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate flashcards from this text:\n${sourceText}` },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "flashcards",
            strict: true,
            schema: {
              type: "object",
              properties: {
                flashcards: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      front: {
                        type: "string",
                        description: "The question or prompt side of the flashcard",
                      },
                      back: {
                        type: "string",
                        description: "The answer or explanation side of the flashcard",
                      },
                    },
                    required: ["front", "back"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["flashcards"],
              additionalProperties: false,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new AIError("Rate limit exceeded for AI service", 429);
      }
      throw new AIError(`AI service error: ${response.statusText}`, 502);
    }

    const result = (await response.json()) as OpenRouterResponse;
    const content = result.choices[0]?.message?.content;

    if (!content) {
      throw new AIError("Invalid response from AI service: missing content", 502);
    }

    // Parse the JSON string content first, then validate with Zod
    try {
      const parsedContent = JSON.parse(content);
      const parsedResponse = flashcardsResponseSchema.parse(parsedContent);
      return parsedResponse.flashcards;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new AIError(`Invalid JSON response from AI service: ${error.message}`, 502);
      }
      if (error instanceof z.ZodError) {
        throw new AIError(`Invalid flashcard format: ${error.message}`, 502);
      }
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
