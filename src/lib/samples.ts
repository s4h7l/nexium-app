import type { Lesson } from "./lesson";

const base = {
  format: "Lesson" as const,
  level: "Beginner" as const,
  length: "Balanced" as const,
  language: "English" as const,
  source: "sample" as const,
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const SAMPLES: Lesson[] = [
  {
    ...base,
    id: "sample-binary-search",
    prompt: "Explain binary search with a C++ example",
    title: "Binary Search, Step by Step",
    summary:
      "Binary search finds a value in a sorted list by repeatedly halving the search range, taking O(log n) time instead of checking every element.",
    sections: [
      {
        heading: "The core idea",
        body: "Imagine looking up a word in a dictionary. You don't read every page — you open the middle, decide whether your word comes before or after, and throw away half the book.\n\nBinary search does exactly this on a list of values.",
        code: "",
        codeLanguage: "",
      },
      {
        heading: "The one requirement: sorted input",
        body: "Binary search only works if the data is sorted. The decision 'go left or go right' depends on knowing that everything to the left is smaller and everything to the right is larger.\n\n- Sorted array: binary search works.\n- Unsorted array: results are unreliable — sort first or use linear search.",
        code: "",
        codeLanguage: "",
      },
      {
        heading: "Worked example in C++",
        body: "We keep two boundaries, low and high. Each step checks the middle element and moves one boundary past it.\n\nSearching for 23 in {2, 5, 8, 12, 16, 23, 38, 56, 72, 91}: mid=4 (16) is too small, so low=5; mid=7 (56) is too big, so high=6; mid=5 (23) — found at index 5 in three steps.",
        code: `#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& a, int target) {
    int low = 0, high = static_cast<int>(a.size()) - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2; // avoids overflow
        if (a[mid] == target) return mid;
        if (a[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // not found
}

int main() {
    std::vector<int> a = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    std::cout << binarySearch(a, 23) << "\\n"; // prints 5
}`,
        codeLanguage: "cpp",
      },
      {
        heading: "Why it is O(log n)",
        body: "Every comparison halves the remaining range: n, n/2, n/4, … until one element is left. That takes about log₂(n) steps.\n\n- 1,000 elements: about 10 steps.\n- 1,000,000 elements: about 20 steps.\n\nLinear search, by comparison, may need n steps.",
        code: "",
        codeLanguage: "",
      },
    ],
    keyTakeaways: [
      "Binary search requires sorted input.",
      "Each step halves the search range.",
      "Time complexity is O(log n); extra space is O(1) for the iterative version.",
      "Compute mid as low + (high - low) / 2 to avoid integer overflow.",
    ],
    quiz: [
      {
        question: "What must be true about an array before you use binary search on it?",
        options: ["It must contain no duplicates", "It must be sorted", "Its length must be a power of two", "It must contain only positive numbers"],
        correctIndex: 1,
        explanation: "The left/right decision only makes sense if the elements are in sorted order.",
      },
      {
        question: "What is the worst-case time complexity of binary search on n elements?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correctIndex: 2,
        explanation: "The range halves every step, so it takes about log₂(n) comparisons.",
      },
      {
        question: "In the C++ code, if a[mid] < target, what happens next?",
        options: ["high = mid - 1", "low = mid + 1", "return mid", "return -1"],
        correctIndex: 1,
        explanation: "The target must be to the right of mid, so the lower boundary moves past mid.",
      },
    ],
    flashcards: [
      { front: "Precondition for binary search", back: "The input must be sorted." },
      { front: "Time complexity of binary search", back: "O(log n) — the range halves each step." },
      { front: "Safe way to compute mid", back: "mid = low + (high - low) / 2, which avoids integer overflow." },
    ],
  },
  {
    ...base,
    id: "sample-photosynthesis",
    prompt: "Explain photosynthesis",
    title: "Photosynthesis: How Plants Make Food",
    summary:
      "Plants use light energy to turn carbon dioxide and water into glucose, releasing oxygen that comes from splitting water molecules.",
    sections: [
      {
        heading: "The big picture",
        body: "Photosynthesis happens in chloroplasts, mainly in leaf cells. The overall equation is:\n\n6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nIt runs in two connected stages.",
        code: "",
        codeLanguage: "",
      },
      {
        heading: "Stage 1: Light-dependent reactions",
        body: "These happen in the thylakoid membranes. Chlorophyll absorbs light, and that energy is used to:\n\n- Split water molecules (photolysis): 2H₂O → 4H⁺ + 4e⁻ + O₂.\n- Make ATP and NADPH, the energy carriers for the next stage.\n\nThe oxygen released by plants comes from this splitting of water — not from carbon dioxide.",
        code: "",
        codeLanguage: "",
      },
      {
        heading: "Stage 2: The Calvin cycle",
        body: "This happens in the stroma, the fluid around the thylakoids. It does not use light directly.\n\n- The enzyme RuBisCO fixes CO₂ onto a five-carbon sugar (RuBP).\n- ATP and NADPH from stage 1 convert the products into G3P, a three-carbon sugar.\n- Some G3P builds glucose; the rest regenerates RuBP so the cycle continues.",
        code: "",
        codeLanguage: "",
      },
    ],
    keyTakeaways: [
      "Photosynthesis occurs in chloroplasts.",
      "Light-dependent reactions (thylakoids) split water, release O₂ and make ATP and NADPH.",
      "The Calvin cycle (stroma) uses ATP and NADPH to fix CO₂ into sugar.",
      "The oxygen produced comes from water.",
    ],
    quiz: [
      {
        question: "Where does the oxygen released during photosynthesis come from?",
        options: ["Carbon dioxide", "Glucose", "Water", "Chlorophyll"],
        correctIndex: 2,
        explanation: "Oxygen is released when water molecules are split during the light-dependent reactions.",
      },
      {
        question: "Where does the Calvin cycle take place?",
        options: ["Thylakoid membrane", "Stroma", "Mitochondria", "Cell wall"],
        correctIndex: 1,
        explanation: "The Calvin cycle runs in the stroma of the chloroplast.",
      },
      {
        question: "Which molecules carry energy from the light reactions to the Calvin cycle?",
        options: ["ATP and NADPH", "Glucose and oxygen", "CO₂ and water", "RuBP and G3P"],
        correctIndex: 0,
        explanation: "ATP and NADPH made in the thylakoids power sugar-building in the Calvin cycle.",
      },
    ],
    flashcards: [
      { front: "Overall equation of photosynthesis", back: "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂" },
      { front: "Photolysis", back: "Light-driven splitting of water, releasing O₂, H⁺ and electrons." },
      { front: "Role of RuBisCO", back: "The enzyme that fixes CO₂ onto RuBP in the Calvin cycle." },
    ],
  },
  {
    ...base,
    id: "sample-probability",
    prompt: "Teach me basic probability",
    title: "Basic Probability with Dice",
    summary:
      "Probability measures how likely an event is, from 0 (impossible) to 1 (certain). Fair dice make the core rules easy to see.",
    sections: [
      {
        heading: "Counting outcomes",
        body: "When every outcome is equally likely:\n\nP(event) = favourable outcomes ÷ total outcomes\n\nA fair six-sided die has 6 equally likely outcomes. P(rolling a 4) = 1/6. P(rolling an even number) = 3/6 = 1/2.",
        code: "",
        codeLanguage: "",
      },
      {
        heading: "Independent events",
        body: "Two events are independent if one happening doesn't change the chance of the other. Two separate dice rolls are independent.\n\nFor independent events: P(A and B) = P(A) × P(B).\n\nP(two sixes in a row) = 1/6 × 1/6 = 1/36.",
        code: "",
        codeLanguage: "",
      },
      {
        heading: "The complement rule",
        body: "The complement of A ('not A') covers every outcome where A doesn't happen:\n\nP(not A) = 1 − P(A)\n\nP(not rolling a 6) = 1 − 1/6 = 5/6. This is handy for 'at least one' questions: P(at least one 6 in two rolls) = 1 − (5/6)² = 11/36.",
        code: "",
        codeLanguage: "",
      },
    ],
    keyTakeaways: [
      "Probabilities range from 0 to 1.",
      "Equally likely outcomes: favourable ÷ total.",
      "Independent events multiply: P(A and B) = P(A) × P(B).",
      "Complement rule: P(not A) = 1 − P(A).",
    ],
    quiz: [
      {
        question: "What is the probability of rolling a number greater than 4 on a fair die?",
        options: ["1/6", "1/3", "1/2", "2/3"],
        correctIndex: 1,
        explanation: "Only 5 and 6 qualify: 2 of 6 outcomes = 1/3.",
      },
      {
        question: "Two fair dice are rolled. What is P(both show a 1)?",
        options: ["1/6", "1/12", "1/36", "2/6"],
        correctIndex: 2,
        explanation: "The rolls are independent, so multiply: 1/6 × 1/6 = 1/36.",
      },
      {
        question: "If P(rain) = 0.3, what is P(no rain)?",
        options: ["0.3", "0.7", "1.3", "0.03"],
        correctIndex: 1,
        explanation: "Complement rule: 1 − 0.3 = 0.7.",
      },
    ],
    flashcards: [
      { front: "Probability with equally likely outcomes", back: "Favourable outcomes ÷ total outcomes." },
      { front: "Rule for independent events A and B", back: "P(A and B) = P(A) × P(B)." },
      { front: "Complement rule", back: "P(not A) = 1 − P(A)." },
    ],
  },
];
