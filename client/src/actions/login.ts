"use server";
import { submitSignInData, validateSignInData } from "../services/authService";
import { SignInReturnType } from "../types/errors";

// Main Sign Up Action
export default async function signInAction(
  formData: FormData
): Promise<SignInReturnType> {
  const { success, data, errors } = validateSignInData(formData);

  if (!success) {
    return { message: "Validation failed!", errors };
  }

  return await submitSignInData(data!);
}
