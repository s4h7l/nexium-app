<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- All Gemini calls go through `src/lib/ai-gateway.ts` (server-only, built-in AI gateway) called from `src/routes/api/*` handlers — keeps the key server-side and lets the browser cancel via AbortController.
- Model output is validated with the zod schema in `src/lib/lesson.ts` before display — invalid output is rejected, never patched or faked.
- Saved lessons and preferences live in browser localStorage via `src/lib/store.tsx` — no accounts by design.
