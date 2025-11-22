export function parseCookies(cookieHeader: string | null): Record<string, string> {
        if (!cookieHeader) return {};
        return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
                const [name, ...rest] = part.split("=");
                if (!name) return acc;
                const key = name.trim();
                const value = rest.join("=").trim();
                acc[key] = decodeURIComponent(value);
                return acc;
        }, {});
}

interface CookieOptions {
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: "lax" | "strict" | "none";
        maxAge?: number;
        path?: string;
}

export function serializeCookie(
        name: string,
        value: string,
        { httpOnly = true, secure = false, sameSite = "lax", maxAge, path = "/" }: CookieOptions = {}
): string {
        const segments = [
                `${name}=${encodeURIComponent(value)}`,
                `Path=${path}`,
                `SameSite=${sameSite.charAt(0).toUpperCase() + sameSite.slice(1)}`,
        ];

        if (httpOnly) segments.push("HttpOnly");
        if (secure) segments.push("Secure");
        if (typeof maxAge === "number") segments.push(`Max-Age=${maxAge}`);

        return segments.join("; ");
}
