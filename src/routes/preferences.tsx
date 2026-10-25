import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useGeminiStatus } from "@/components/AppShell";
import { OptionGroup } from "@/components/OptionGroup";
import { LANGUAGES, LENGTHS, LEVELS } from "@/lib/lesson";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/preferences")({
  head: () => ({
    meta: [
      { title: "Learning preferences — NEXIUM" },
      { name: "description", content: "Choose your default level, length and language for lessons and tutor chat." },
      { property: "og:title", content: "Learning preferences — NEXIUM" },
      { property: "og:description", content: "Set how you like to learn." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Prefs,
});

function Prefs() {
  const { prefs, setPrefs } = useApp();
  const { data } = useGeminiStatus();
  return (
    <AppShell crumb="Learning preferences">
      <h1 className="text-4xl font-normal text-foreground">Learning preferences</h1>
      <p className="mt-2 text-muted-foreground">Used by the studio and the tutor. Saved in this browser.</p>
      <div className="card-soft mt-8 grid max-w-2xl gap-6 p-6">
        <OptionGroup label="Level" options={LEVELS} value={prefs.level} onChange={(level) => setPrefs({ level })} />
        <OptionGroup label="Length" options={LENGTHS} value={prefs.length} onChange={(length) => setPrefs({ length })} />
        <OptionGroup label="Language" options={LANGUAGES} value={prefs.language} onChange={(language) => setPrefs({ language })} />
      </div>
      <div className="card-soft mt-6 max-w-2xl p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-medium text-foreground">AI connection</h2>
        <p className="mt-2">
          Google Gemini is provided through this app's built-in, server-side connection{data?.model ? ` (model: ${data.model})` : ""}. No personal API key is needed, and no key is ever sent to or stored in your browser.
        </p>
      </div>
    </AppShell>
  );
}
