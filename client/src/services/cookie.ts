import { AxiosResponse } from "axios";
import { Cookie } from "../types/cookie";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export function getCookie(
  headers: AxiosResponse<any, any>["headers"],
  key: string
): Cookie | null {
  // Check if set-cookie exists and is an array
  if (!headers["set-cookie"] || !Array.isArray(headers["set-cookie"])) {
    return null;
  }

  const cookieString = headers["set-cookie"].find((cookie) =>
    cookie.startsWith(key + "=")
  );

  // Return null if cookie not found
  if (!cookieString) {
    return null;
  }

  return parseCookie(cookieString);
}

function parseCookie(cookie: string): Cookie {
  const parts = cookie.split("; ");
  const cookieObj: Cookie = { name: "", value: "", cookie: {} };

  parts.forEach((part, index) => {
    if (index === 0) {
      const [key, value] = part.split("=");
      cookieObj.name = key;
      cookieObj.value = value;
    } else {
      const [key, value] = part.split("=");
      if (!key) return;

      const lowerKey = key.toLowerCase();

      if (lowerKey === "expires") {
        cookieObj.cookie.expires = value ? new Date(value) : undefined;
      } else if (lowerKey === "path") {
        cookieObj.cookie.path = value;
      } else if (lowerKey === "domain") {
        cookieObj.cookie.domain = value;
      } else if (lowerKey === "secure") {
        cookieObj.cookie.secure = true;
      } else if (lowerKey === "httponly") {
        cookieObj.cookie.httpOnly = true;
      } else if (lowerKey === "samesite" && value) {
        // Store sameSite in your format (first letter uppercase)
        cookieObj.cookie.sameSite = (value.charAt(0).toUpperCase() +
          value.slice(1).toLowerCase()) as "Strict" | "Lax" | "None";
      }
    }
  });

  return cookieObj;
}

export async function setSessionCookie(
  axiosHeader: AxiosResponse<any, any>["headers"]
) {
  const cookieStorage = await cookies();

  // Extract the session cookie from headers
  const sessionCookie = getCookie(axiosHeader, "session");

  if (sessionCookie && sessionCookie.value) {
    // Transform cookie to match Next.js expected format
    const nextJsCookie: Partial<ResponseCookie> = {
      ...sessionCookie.cookie,
      sameSite: sessionCookie.cookie.sameSite?.toLowerCase() as
        | "lax"
        | "strict"
        | "none"
        | undefined,
    };

    cookieStorage.set("session", sessionCookie.value, nextJsCookie);
  }

  // Redirect after ensuring the cookie is set
}
