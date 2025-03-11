"use server";
import axios from "axios";
import { submitSignInData, validateSignInData } from "../services/authService";
import { AuthReturnType } from "../types/errors";
import { setSessionCookie } from "../services/cookie";

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
    await setSessionCookie(response.headers);
    return response?.data as AuthReturnType;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 442) {
      return error.response.data as AuthReturnType;
    }

    console.error("SignIn Error:", error);
    throw new Error("Sign-in failed: " + (error as Error).message);
  }
}
