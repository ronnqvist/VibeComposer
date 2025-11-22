import type { ActionFunction } from "react-router";
import { json } from "~/server/json";
import { parseCookies } from "~/utils/cookies";
import { OPENROUTER_COOKIE_NAME, OPENROUTER_DEFAULT_MODEL } from "~/constants/openrouter";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function resolveOpenRouterKey(request: Request): string | null {
        const cookies = parseCookies(request.headers.get("cookie"));
        const userKey = cookies[OPENROUTER_COOKIE_NAME];
        if (userKey) return userKey;
        return process.env.OPENROUTER_API_KEY || null;
}

export const action: ActionFunction = async ({ request }) => {
        if (request.method !== "POST") {
                return json({ error: "Method not allowed" }, { status: 405 });
        }

        try {
            const body = await request.json();
            const apiKey = resolveOpenRouterKey(request);
            if (!apiKey) {
                    return json({ error: "Missing OpenRouter key" }, { status: 400 });
            }

            const referer = process.env.OPENROUTER_SITE_URL || "http://localhost:5173";
            const title = process.env.OPENROUTER_APP_TITLE || "VibeComposer (Dev)";

            const payload = {
                    model: body.model || OPENROUTER_DEFAULT_MODEL,
                    messages: body.messages || [],
                    stream: Boolean(body.stream),
                    system: body.system,
                    temperature: body.temperature,
                    max_tokens: body.max_tokens,
                    usage: { include: true },
            };

            const response = await fetch(OPENROUTER_URL, {
                    method: "POST",
                    headers: {
                            Authorization: `Bearer ${apiKey}`,
                            "Content-Type": "application/json",
                            "HTTP-Referer": referer,
                            "X-Title": title,
                    },
                    body: JSON.stringify(payload),
            });

            if (payload.stream) {
                    if (!response.body) {
                            return json({ error: "No response body" }, { status: 500 });
                    }

                    return new Response(response.body, {
                            status: response.status,
                            headers: {
                                    "Content-Type":
                                            response.headers.get("Content-Type") ||
                                            "text/event-stream",
                                    "Cache-Control": "no-cache",
                                    Connection: "keep-alive",
                            },
                    });
            }

            const data = await response.json();
            return json(data, { status: response.status });
        } catch (error) {
                console.error("OpenRouter proxy error", error);
                return json({ error: "Failed to reach OpenRouter" }, { status: 500 });
        }
};
