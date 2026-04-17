import { NextRequest } from "next/server";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

/**
 * Proxy to Anthropic API using OAuth token (Max subscription).
 * Keeps credentials server-side — the browser never sees the token.
 */
export async function POST(req: NextRequest) {
  const token = process.env.CLAUDE_CODE_OAUTH_TOKEN;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!token && !apiKey) {
    return Response.json(
      { error: { message: "No Anthropic credentials configured" } },
      { status: 500 }
    );
  }

  const body = await req.text();
  const parsed = JSON.parse(body);
  const isStream = parsed.stream === true;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["anthropic-beta"] = "oauth-2025-04-20";
  } else {
    headers["x-api-key"] = apiKey!;
  }

  const upstream = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers,
    body,
  });

  if (isStream) {
    // Pass through the SSE stream directly
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const data = await upstream.json();
  return Response.json(data, { status: upstream.status });
}
