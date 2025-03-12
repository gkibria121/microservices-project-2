"use server";
import axios from "axios";
import { submitSignInData, validateSignInData } from "../services/authService";
import { AuthReturnType } from "../types/errors";
import { setCookie, setSessionCookie } from "../services/cookie";
import { redirect } from "next/navigation";

// Main Sign In Action
export default async function signInAction(
  preveState: unknown,
  formData: FormData
): Promise<AuthReturnType> {
  const { success, data, errors } = validateSignInData(formData);
  const formField = {
    email: formData.get("email") as string | null,
  };
  if (!success) {
    return { message: "Validation failed!", errors, formField };
  }

  try {
    const response = await submitSignInData(data!);
    await setSessionCookie(response.headers);
    await setCookie("user", JSON.stringify(response?.data?.user));
    // return { formField, ...(response?.data as AuthReturnType) };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 442) {
      return { formField, ...(error.response.data as AuthReturnType) };
    }

    console.error("SignIn Error:", error);
    throw new Error("Sign-in failed: " + (error as Error).message);
  }
  redirect("/");
}
