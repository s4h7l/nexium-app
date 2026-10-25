import { z } from "zod";

export const FORMATS = ["Lesson", "Revision notes", "Flashcards", "Quiz", "Study plan"] as const;
export const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
export const LENGTHS = ["Quick overview", "Balanced", "In depth"] as const;
export const LANGUAGES = ["English", "Hindi", "Telugu"] as const;
export const PROMPT_MAX = 3000;

export type Format = (typeof FORMATS)[number];
export type Level = (typeof LEVELS)[number];
export type Length = (typeof LENGTHS)[number];
export type Language = (typeof LANGUAGES)[number];

export const generateRequestSchema = z.object({
  prompt: z.string().trim().min(3, "Please describe what you want to learn.").max(PROMPT_MAX),
  format: z.enum(FORMATS),
  level: z.enum(LEVELS),
  length: z.enum(LENGTHS),
  language: z.enum(LANGUAGES),
});
export type GenerateRequest = z.infer<typeof generateRequestSchema>;

const nonEmpty = z.string().trim().min(1);

export const lessonSchema = z.object({
  title: nonEmpty,
  summary: nonEmpty,
  sections: z
    .array(
      z.object({
        heading: nonEmpty,
        body: nonEmpty,
        code: z.string().optional().default(""),
        codeLanguage: z.string().optional().default(""),
      }),
    )
    .min(1),
  keyTakeaways: z.array(nonEmpty).min(1),
  quiz: z
    .array(
      z
        .object({
          question: nonEmpty,
          options: z.array(nonEmpty).length(4),
          correctIndex: z.number().int().min(0).max(3),
          explanation: nonEmpty,
        }),
    )
    .min(1),
  flashcards: z.array(z.object({ front: nonEmpty, back: nonEmpty })).min(1),
});

export type LessonContent = z.infer<typeof lessonSchema>;

export type Lesson = LessonContent & {
  id: string;
  format: Format;
  level: Level;
  length: Length;
  language: Language;
  prompt: string;
  source: "gemini" | "sample";
  createdAt: string;
};

/** JSON schema sent to Gemini (strict: every key required). */
export const lessonJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "summary", "sections", "keyTakeaways", "quiz", "flashcards"],
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    sections: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["heading", "body", "code", "codeLanguage"],
        properties: {
          heading: { type: "string" },
          body: { type: "string" },
          code: { type: "string", description: "Code example or empty string" },
          codeLanguage: { type: "string", description: "e.g. cpp, python, or empty string" },
        },
      },
    },
    keyTakeaways: { type: "array", items: { type: "string" } },
    quiz: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "options", "correctIndex", "explanation"],
        properties: {
          question: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          correctIndex: { type: "integer", description: "Zero-based index of the correct option (0-3)" },
          explanation: { type: "string" },
        },
      },
    },
    flashcards: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["front", "back"],
        properties: { front: { type: "string" }, back: { type: "string" } },
      },
    },
  },
} as const;

/** Parses raw model text into a validated lesson, or returns null. */
export function parseLessonOutput(raw: string): LessonContent | null {
  let text = raw.trim();
  const fence = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) text = fence[1] ?? text;
  try {
    const result = lessonSchema.safeParse(JSON.parse(text));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

const FORMAT_GUIDE: Record<Format, string> = {
  Lesson: "A teaching lesson: explain concepts step by step with intuition and examples. 3-6 sections.",
  "Revision notes":
    "Compact revision notes: each section is a tight list of '- ' bullet points with definitions, formulas and must-remember facts.",
  Flashcards:
    "Flashcard-focused: keep sections brief (1-2), and produce 10-14 high-quality flashcards covering every key fact.",
  Quiz: "Quiz-focused: keep sections brief (1-2 recap sections) and produce 8-10 varied multiple-choice questions.",
  "Study plan":
    "A study plan: each section is one stage/day/week of the plan, with goals, activities and a checkpoint. Include a realistic time estimate in each heading.",
};

const LENGTH_GUIDE: Record<Length, string> = {
  "Quick overview": "Keep it short: roughly 250-400 words of section text total.",
  Balanced: "Moderate depth: roughly 600-900 words of section text total.",
  "In depth": "Thorough: roughly 1200-1800 words of section text total, with worked examples.",
};

const LEVEL_GUIDE: Record<Level, string> = {
  Beginner: "Assume no prior knowledge. Define every term, use everyday analogies, avoid jargon.",
  Intermediate: "Assume basic familiarity. Focus on how and why, with practical examples.",
  Advanced: "Assume solid foundations. Cover edge cases, rigor, trade-offs and deeper theory.",
};

export function buildLessonPrompt(req: GenerateRequest) {
  const system = [
    "You are AI Education Assistant, a careful, accurate teacher.",
    `Write ALL natural-language text (title, summary, headings, bodies, takeaways, questions, options, explanations, flashcards) in ${req.language}. Code stays in its programming language; technical terms may add the English term in brackets.`,
    `Format: ${req.format}. ${FORMAT_GUIDE[req.format]}`,
    `Level: ${req.level}. ${LEVEL_GUIDE[req.level]}`,
    `Length: ${req.length}. ${LENGTH_GUIDE[req.length]}`,
    "Section bodies are plain text: paragraphs separated by blank lines, bullet lines start with '- '. No HTML, no markdown headings, no tables.",
    "Use 'code' only for genuine code examples (otherwise empty string) and set 'codeLanguage'.",
    "Always include 3-8 key takeaways, at least 3 quiz questions (exactly 4 options each, correctIndex is zero-based 0-3, explanation says why), and at least 3 flashcards.",
    "Be factually accurate. If the request is unclear, teach the most likely intended topic.",
    "Respond ONLY with JSON matching the schema.",
  ].join("\n");
  return { system, user: req.prompt };
}

export function lessonToMarkdown(l: LessonContent & { level?: string; language?: string; format?: string }) {
  const out: string[] = [`# ${l.title}`, "", `> ${l.summary}`, ""];
  if (l.format) out.push(`*${[l.format, l.level, l.language].filter(Boolean).join(" · ")}*`, "");
  for (const s of l.sections) {
    out.push(`## ${s.heading}`, "", s.body, "");
    if (s.code) out.push("```" + (s.codeLanguage || ""), s.code, "```", "");
  }
  out.push("## Key takeaways", "", ...l.keyTakeaways.map((t) => `- ${t}`), "");
  out.push("## Practice quiz", "");
  l.quiz.forEach((q, i) => {
    out.push(`${i + 1}. ${q.question}`);
    q.options.forEach((o, j) => out.push(`   ${String.fromCharCode(65 + j)}. ${o}`));
    out.push(`   **Answer:** ${String.fromCharCode(65 + q.correctIndex)} — ${q.explanation}`, "");
  });
  out.push("## Flashcards", "", ...l.flashcards.map((f) => `- **${f.front}** — ${f.back}`), "");
  return out.join("\n");
}

/** Returns score only when every question has been answered. */
export function scoreQuiz(quiz: { correctIndex: number }[], answers: (number | null)[]) {
  if (answers.length !== quiz.length || answers.some((a) => a === null || a === undefined)) return null;
  return quiz.reduce((n, q, i) => n + (answers[i] === q.correctIndex ? 1 : 0), 0);
}
