"use server";
import { submitSignInData, validateSignInData } from "../services/authService";
import { SignUpReturnType } from "../types/errors";

// Main Sign Up Action
export default async function signUpAction(
  formData: FormData
): Promise<SignUpReturnType> {
  const { success, data, errors } = validateSignInData(formData);

  if (!success) {
    return { message: "Validation failed!", errors };
  }

  return await submitSignInData(data!);
}
