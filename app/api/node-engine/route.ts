import { NODE_ENGINE_SYSTEM, NODE_ENGINE_MODEL } from "@/lib/nodeEngineSpec";

export const runtime = "nodejs";
export const maxDuration = 300;

/** Pull the first balanced {...} JSON object out of a text blob. */
function extractJson(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
    } else {
      if (ch === '"') inStr = true;
      else if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) return text.slice(start, i + 1);
      }
    }
  }
  return null;
}

export async function POST(req: Request) {
  let classObject = "";
  try {
    const body = await req.json();
    classObject = String(body?.classObject ?? "").trim();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!classObject) {
    return Response.json({ error: "No class object provided." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not set on the server. Add it to .env.local (local) or the Vercel project env." },
      { status: 500 }
    );
  }

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: NODE_ENGINE_MODEL,
        max_tokens: 8000,
        system: NODE_ENGINE_SYSTEM,
        messages: [
          {
            role: "user",
            content: `Class object: ${classObject}\n\nRun Node Initialization then Self-Discovery on this object and return the single JSON record.`,
          },
        ],
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text().catch(() => "");
      return Response.json(
        { error: `Anthropic API error (${resp.status}). ${detail.slice(0, 400)}` },
        { status: 502 }
      );
    }

    const data = await resp.json();
    const text: string = (data?.content ?? [])
      .filter((b: { type?: string }) => b?.type === "text")
      .map((b: { text?: string }) => b?.text ?? "")
      .join("\n");

    const jsonStr = extractJson(text);
    if (!jsonStr) {
      return Response.json({ error: "Engine returned no parseable JSON.", raw: text.slice(0, 800) }, { status: 502 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      return Response.json({ error: "Engine returned malformed JSON.", raw: jsonStr.slice(0, 800) }, { status: 502 });
    }

    return Response.json(parsed);
  } catch (e) {
    return Response.json({ error: `Engine request failed: ${(e as Error).message}` }, { status: 500 });
  }
}
