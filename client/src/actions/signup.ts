"use server";
import axios from "axios";
import { submitSignUpData, validateSignUpData } from "../services/authService";
import { AuthReturnType } from "../types/errors";

// Main Sign Up Action
export default async function signUpAction(
  formData: FormData
): Promise<AuthReturnType> {
  const { success, data, errors } = validateSignUpData(formData);

  if (!success) {
    return { message: "Validation failed!", errors };
  }
  try {
    const response = await submitSignUpData(data!);

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
