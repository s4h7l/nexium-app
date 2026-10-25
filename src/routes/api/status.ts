import { createFileRoute } from "@tanstack/react-router";
import { GEMINI_MODEL } from "@/lib/ai-gateway";

export const Route = createFileRoute("/api/status")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({ configured: Boolean(process.env["LOVABLE_API_KEY"]), model: GEMINI_MODEL }),
    },
  },
});
