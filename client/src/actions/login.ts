"use server";
import { submitSignInData, validateSignInData } from "../services/authService";
import { AuthReturnType } from "../types/errors";

// Main Sign Up Action
export default async function signInAction(
  formData: FormData
): Promise<AuthReturnType> {
  const { success, data, errors } = validateSignInData(formData);

  if (!success) {
    return { message: "Validation failed!", errors };
  }

  return await submitSignInData(data!);
}
