"use server";
import axios from "axios";
import { submitSignInData, validateSignInData } from "../services/authService";
import { AuthReturnType } from "../types/errors";
import { cookies } from "next/headers";
import { getCookie } from "../services/cookie";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

// Main Sign Up Action
export default async function signInAction(
  formData: FormData
): Promise<AuthReturnType> {
  const { success, data, errors } = validateSignInData(formData);

  if (!success) {
    return { message: "Validation failed!", errors };
  }
  try {
    const respone = await submitSignInData(data!);
    const cookieStorage = await cookies();

    // Extract the session cookie from headers
    const sessionCookie = getCookie(respone.headers, "session");

    // Only set the cookie if it was found
    if (sessionCookie && sessionCookie.value) {
      // Transform cookie to match Next.js expected format
      const nextJsCookie: Partial<ResponseCookie> = {
        ...sessionCookie.cookie,
        // Convert sameSite to lowercase to match Next.js types
        sameSite: sessionCookie.cookie.sameSite?.toLowerCase() as
          | "lax"
          | "strict"
          | "none"
          | undefined,
      };

      cookieStorage.set("session", sessionCookie.value, nextJsCookie);
    }
    return respone?.data as AuthReturnType;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 442)
      return error.response.data as AuthReturnType;
    throw new Error("" + error);
  }
}
