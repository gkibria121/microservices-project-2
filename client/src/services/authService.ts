export function signUp(formData: FormData) {
  console.log(formData);
}
import { z } from "zod";
import axios from "axios";
import { SignUpReturnType, ValidationErrors } from "../types/errors";

// Validation Schema
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Validate Form Data
export function validateSignUpData(formData: FormData): {
  success: boolean;
  data?: Record<string, unknown>;
  errors?: ValidationErrors;
} {
  const errors = {} as ValidationErrors;

  const result = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    result.error.errors.forEach((e) => {
      const field = e.path[0] as string;
      errors[field] = [e.message];
    });

    return { success: false, errors };
  }

  return { success: true, data: result.data };
}

// Sign Up Request to API
export async function submitSignUpData(
  data: Record<string, unknown>
): Promise<SignUpReturnType> {
  try {
    console.log("Submitting to API");

    const response = await axios.post(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/auth/signup",
      data,
      {
        headers: {
          Host: "ticksell.dev",
        },
      }
    );

    return { message: "Successfully signed up!" };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Axios error occurred:", err.response?.data);
      return err.response?.data as SignUpReturnType;
    } else {
      console.error("Non-Axios error:", err);
      return { message: "An unexpected error occurred: " + err };
    }
  }
}
