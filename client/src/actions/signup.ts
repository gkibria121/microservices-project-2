"use server";

import { z } from "zod";
import { SignUpReturnType, ValidationErrors } from "../types/errors";
import { headers } from "next/headers";
import customAxios from "../utils/axios";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default async function signUpAction(
  formData: FormData
): Promise<SignUpReturnType> {
  const errors = {} as ValidationErrors;

  try {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedData = signUpSchema.parse(data);

    const response = await customAxios.post("/api/auth/signup", validatedData);
    console.log(response.status);
    console.log(validatedData);

    return {
      message: "Successfully signed up!",
    };
  } catch (err) {
    if (err instanceof z.ZodError) {
      err.errors.forEach((e) => {
        const field = e.path[0] as string;
        errors[field] = [e.message];
      });
      return {
        message: "Validation failed!",
        errors,
      };
    }
    console.error(err);
    return {
      message: "An unexpected error occurred",
    };
  }
}
