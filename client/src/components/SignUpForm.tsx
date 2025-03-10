"use client";

import Button from "@/src/components/Button";
import FormGroup from "@/src/components/FormGroup";
import Input from "@/src/components/Input";
import Label from "@/src/components/Label";
import React, { FormEvent, useState } from "react";
import signUpAction from "@/src/actions/signup";
import ErrorMessage from "@/src/components/ErrorMessage";
import SuccessMsg from "@/src/components/SuccessMsg";

function SignUpForm() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const result = await signUpAction(formData);
      if (result.errors) {
        setErrors(result.errors);
      } else {
        setErrors({});
        setSuccess(result.message);
      }
    } catch (error: any) {
      setSuccess(null);
      console.error("Unexpected error:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-4 my-2" method="POST">
      {success && <SuccessMsg>{success}</SuccessMsg>}
      <h1 className="text-2xl font-semibold mb-2">Sign Up</h1>
      <FormGroup>
        <Label htmlFor="email">Email Address</Label>
        <Input name="email" type="text" />
        {errors.email && <ErrorMessage>{errors.email[0]}</ErrorMessage>}
      </FormGroup>
      <FormGroup>
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" />
        {errors.password && (
          <p className="text-red-500">{errors.password[0]}</p>
        )}
      </FormGroup>
      <Button className="mt-2">Sign up</Button>
    </form>
  );
}

export default SignUpForm;
