# Nexium App

Create a completely NEW website for the user named exactly 'AI Education Assistant'. This is a fresh standalone app, NOT EduGenie, and must not modify any existing project. The user explicitly requests an AI assistant website that generates educational content based on user instructions and says USE GEMINI API. Build the fully functional app now, not a marketing landing page. Use Google Gemini for lesson generation and tutor chat, preferably a supported built-in Gemini connection with server-side calls. Never substitute OpenAI or fabricate AI responses. If a key is needed, build a secure connection form keeping a user's key in tab memory only and using a same-origin backend proxy; offer the Google AI Studio API-key link. Do not embed credentials or persist them in browser storage/source. Confirm real provider availability and gracefully handle missing keys, quota, API errors, timeouts, and invalid model output.

Design: premium calm study workspace, ivory-white background #fbfcf8, pale sage sidebar #f3f4ee, dark forest-green #284f40 primary actions, muted gray-green text, subtle thin borders. No purple, neon, AI gradients or dark design. Desktop sidebar ~230px: book icon, AI Education / Assistant brand, New learning session, Learning studio, My library, Ask your tutor, Learning preferences, a small 'Big ideas start with small questions' note. Header breadcrumb Workspace / Learning studio and Gemini connection status. Editorial hero with large serif headline 'A little curiosity. A whole lot of possibility.' with possibility italic sage, subheading 'Turn any topic into something that clicks. Learn your way, at your pace.' On right a delicate line-art floating open book with orbit rings and tiny math/code tiles, created with CSS/SVG. Generous whitespace, restrained rounded cards, sans-serif UI, serif main titles. Fully responsive mobile sidebar drawer, readable text, keyboard accessible.

Learning studio: prompt textarea 3000 chars, format controls Lesson / Revision notes / Flashcards / Quiz / Study plan, Beginner/Intermediate/Advanced level, Quick overview/Balanced/In depth length, English/Hindi/Telugu language. Gemini must follow ALL choices. Generate content shows loading, cancel, useful errors. Return validated structured data title, summary, sections with headings/body/optional code, key takeaways, quiz questions with 4 options + correct zero-based index + explanation, and flashcards. Render generated text safely. Result screen has Read / Practice / Flashcards tabs; interactive quiz scoring only after all answers selected, explanations, retry; flippable flashcards with next/previous; copy, Markdown download, save lesson. My library persists saved lessons in localStorage explicitly labeled as this browser, supports search, open and remove. Tutor chat keeps bounded conversation history, uses Gemini for every response, supports same level/language preferences and clear chat. No pretend tutor answers.

Below studio: three prepared samples clearly labeled Built-in samples (not live AI): binary search with worked C++ example and sorted-input requirement/O(log n), photosynthesis with accurate stages/oxygen from water, basic probability with fair dice/independent events/complement rule. Each sample has 3 real MCQs with explanations and 3 working flashcards. Label samples Beginner / English regardless of preferences; user may explore before AI connection. Include right-column card 'Less memorizing. More understanding.' and a functional tutor callout. No fake stats, fabricated testimonials, payment features, or unnecessary authentication. This is a personal college project. Test desktop and mobile, quiz scoring, save/reload, flashcards, generation validation and missing-key errors. Provide a working preview and report clearly whether a real Gemini response was verified. Do not deploy publicly until requested through deployment step.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nexium-app.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/256e3f7e-35c9-4d9a-a309-1f98e08afd47).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
