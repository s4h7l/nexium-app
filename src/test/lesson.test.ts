import { describe, expect, it } from "vitest";
import { parseLessonOutput, scoreQuiz, generateRequestSchema, lessonToMarkdown } from "@/lib/lesson";
import { SAMPLES } from "@/lib/samples";

const valid = SAMPLES[0];

describe("quiz scoring", () => {
  it("returns null until every question is answered", () => {
    expect(scoreQuiz(valid.quiz, [1, 2, null])).toBeNull();
  });
  it("scores correct answers once all are answered", () => {
    expect(scoreQuiz(valid.quiz, [1, 2, 1])).toBe(3);
    expect(scoreQuiz(valid.quiz, [0, 2, 0])).toBe(1);
  });
});

describe("model output validation", () => {
  it("accepts a well-formed lesson (also inside a json fence)", () => {
    const json = JSON.stringify(valid);
    expect(parseLessonOutput(json)?.title).toBe(valid.title);
    expect(parseLessonOutput("```json\n" + json + "\n```")).not.toBeNull();
  });
  it("rejects malformed JSON", () => {
    expect(parseLessonOutput("{not json")).toBeNull();
  });
  it("rejects questions without exactly 4 options", () => {
    const bad = { ...valid, quiz: [{ ...valid.quiz[0], options: ["a", "b", "c"] }] };
    expect(parseLessonOutput(JSON.stringify(bad))).toBeNull();
  });
  it("rejects a correct index outside 0-3", () => {
    const bad = { ...valid, quiz: [{ ...valid.quiz[0], correctIndex: 4 }] };
    expect(parseLessonOutput(JSON.stringify(bad))).toBeNull();
  });
});

describe("request validation", () => {
  it("rejects prompts over 3000 characters", () => {
    const r = generateRequestSchema.safeParse({ prompt: "a".repeat(3001), format: "Lesson", level: "Beginner", length: "Balanced", language: "English" });
    expect(r.success).toBe(false);
  });
  it("rejects unsupported languages", () => {
    const r = generateRequestSchema.safeParse({ prompt: "Atoms", format: "Lesson", level: "Beginner", length: "Balanced", language: "French" });
    expect(r.success).toBe(false);
  });
});

describe("samples", () => {
  it("each sample has 3 valid MCQs and 3 flashcards", () => {
    for (const s of SAMPLES) {
      expect(parseLessonOutput(JSON.stringify(s))).not.toBeNull();
      expect(s.quiz).toHaveLength(3);
      expect(s.flashcards).toHaveLength(3);
      expect(s.level).toBe("Beginner");
      expect(s.language).toBe("English");
    }
  });
  it("markdown export includes the answer key", () => {
    expect(lessonToMarkdown(valid)).toContain("**Answer:** B");
  });
});
