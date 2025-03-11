"use server";
import axios from "axios";
import { submitSignInData, validateSignInData } from "../services/authService";
import { AuthReturnType } from "../types/errors";
import { cookies } from "next/headers";
import { getCookie } from "../services/cookie";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

// Main Sign In Action
export default async function signInAction(
  formData: FormData
): Promise<AuthReturnType> {
  const { success, data, errors } = validateSignInData(formData);

  if (!success) {
    return { message: "Validation failed!", errors };
  }

  try {
    const response = await submitSignInData(data!);
    const cookieStorage = await cookies();

    // Extract the session cookie from headers
    const sessionCookie = getCookie(response.headers, "session");

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

    return response?.data as AuthReturnType;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 442) {
      return error.response.data as AuthReturnType;
    }

    console.error("SignIn Error:", error);
    throw new Error("Sign-in failed: " + (error as Error).message);
  }
}
