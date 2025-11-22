import type { ActionFunction } from "react-router";
import { json } from "~/server/json";
import { OPENROUTER_COOKIE_NAME } from "~/constants/openrouter";
import { serializeCookie } from "~/utils/cookies";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const KEY_PATTERN = /^sk-or-[\w-]{10,}$/;

export const action: ActionFunction = async ({ request }) => {
        const secure = process.env.NODE_ENV === "production";

        if (request.method === "POST") {
                try {
                        const { key } = (await request.json()) as { key?: string };
                        if (!key || !KEY_PATTERN.test(key)) {
                                return json({ error: "Invalid OpenRouter key" }, { status: 400 });
                        }

                        const cookie = serializeCookie(OPENROUTER_COOKIE_NAME, key, {
                                httpOnly: true,
                                secure,
                                sameSite: "lax",
                                maxAge: COOKIE_MAX_AGE,
                        });

                        return new Response(null, {
                                status: 204,
                                headers: { "Set-Cookie": cookie },
                        });
                } catch (error) {
                        console.error("Failed to store user key", error);
                        return json({ error: "Unable to store key" }, { status: 500 });
                }
        }

        if (request.method === "DELETE") {
                const cookie = serializeCookie(OPENROUTER_COOKIE_NAME, "", {
                        httpOnly: true,
                        secure,
                        sameSite: "lax",
                        maxAge: 0,
                });

                return new Response(null, {
                        status: 204,
                        headers: { "Set-Cookie": cookie },
                });
        }

        return json({ error: "Method not allowed" }, { status: 405 });
};
