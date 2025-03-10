"use server";
import { submitSignUpData, validateSignUpData } from "../services/authService";
import { SignUpReturnType } from "../types/errors";

// Main Sign Up Action
export default async function signUpAction(
  formData: FormData
): Promise<SignUpReturnType> {
  const { success, data, errors } = validateSignUpData(formData);

  if (!success) {
    return { message: "Validation failed!", errors };
  }

  return await submitSignUpData(data!);
}
