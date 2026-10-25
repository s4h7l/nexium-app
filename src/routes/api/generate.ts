import { createFileRoute } from "@tanstack/react-router";
import { AiError, callGemini, errorResponse } from "@/lib/ai-gateway";
import { buildLessonPrompt, generateRequestSchema, lessonJsonSchema, parseLessonOutput } from "@/lib/lesson";

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const parsed = generateRequestSchema.safeParse(await request.json().catch(() => null));
          if (!parsed.success) throw new AiError(400, parsed.error.issues[0]?.message ?? "Invalid request.", "invalid_input");
          const { system, user } = buildLessonPrompt(parsed.data);
          const raw = await callGemini({
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
            jsonSchema: lessonJsonSchema as unknown as Record<string, unknown>,
            signal: request.signal,
          });
          const lesson = parseLessonOutput(raw);
          if (!lesson)
            throw new AiError(502, "Gemini's answer was incomplete or malformed, so it wasn't shown. Please try again.", "invalid_output");
          return Response.json({ lesson });
        } catch (e) {
          return errorResponse(e);
        }
      },
    },
  },
});
