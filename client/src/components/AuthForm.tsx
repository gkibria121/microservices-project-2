"use client";

import Button from "@/src/components/Button";
import FormGroup from "@/src/components/FormGroup";
import Input from "@/src/components/Input";
import Label from "@/src/components/Label";
import React, { FormEvent, useState } from "react";
import signUpAction from "@/src/actions/signup";
import loginAction from "@/src/actions/login";
import ErrorMessage from "@/src/components/ErrorMessage";
import SuccessMsg from "@/src/components/SuccessMsg";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  mode: "signup" | "login";
}

function AuthForm({ mode }: AuthFormProps) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const action = mode === "signup" ? signUpAction : loginAction;
      const result = await action(formData);

      if (result?.errors) {
        setSuccess(null);
        setErrors(result.errors);
      } else {
        setErrors({});
        // setSuccess("Success fully logged in!");
      }
    } catch (error: unknown) {
      setSuccess(null);
      setErrors({});
      alert("Unexpected error" + error);
    }

    if (mode === "login") router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-4 my-2" method="POST">
      {success && <SuccessMsg>{success}</SuccessMsg>}
      <h1 className="text-2xl font-semibold mb-2">
        {mode === "signup" ? "Sign Up" : "Login"}
      </h1>

      <FormGroup>
        <Label htmlFor="email">Email Address</Label>
        <Input name="email" type="text" />
        {errors.email && <ErrorMessage>{errors.email[0]}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" />
        {errors.password && <ErrorMessage>{errors.password[0]}</ErrorMessage>}
      </FormGroup>

      {mode === "signup" && (
        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input name="confirmPassword" type="password" />
          {errors.confirmPassword && (
            <ErrorMessage>{errors.confirmPassword[0]}</ErrorMessage>
          )}
        </FormGroup>
      )}

      <Button className="mt-2">
        {mode === "signup" ? "Sign Up" : "Login"}
      </Button>
    </form>
  );
}

export default AuthForm;
