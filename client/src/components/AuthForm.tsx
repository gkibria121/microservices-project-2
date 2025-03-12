"use client";

import Button from "@/src/components/Button";
import FormGroup from "@/src/components/FormGroup";
import Input from "@/src/components/Input";
import Label from "@/src/components/Label";
import React, { useActionState } from "react";
import signUpAction from "@/src/actions/signup";
import loginAction from "@/src/actions/login";
import ErrorMessage from "@/src/components/ErrorMessage";
import SuccessMsg from "@/src/components/SuccessMsg";
import { AuthReturnType } from "../types/errors";

interface AuthFormProps {
  mode: "signup" | "login";
}
const initialState = {
  message: "",
  errors: {},
} as AuthReturnType;
function AuthForm({ mode }: AuthFormProps) {
  const action = mode === "signup" ? signUpAction : loginAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mx-4 my-2">
      {state.success && <SuccessMsg>{state.success}</SuccessMsg>}
      <h1 className="text-2xl font-semibold mb-2">
        {mode === "signup" ? "Sign Up" : "Login"}
      </h1>

      <FormGroup>
        <Label htmlFor="email">Email Address</Label>
        <Input name="email" type="text" defaultValue={state.formField?.email} />
        {getFormFiledError(state, "email")}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" />
        {getFormFiledError(state, "password")}
      </FormGroup>

      {mode === "signup" && (
        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input name="confirmPassword" type="password" />
          {getFormFiledError(state, "confirmPassword")}
        </FormGroup>
      )}

      <Button className="mt-2" disabled={pending}>
        {mode === "signup" ? "Sign Up" : "Login"}
      </Button>
    </form>
  );
}

export default AuthForm;

function getFormFiledError(state: any, name: string) {
  return (
    state?.errors?.[name] && (
      <ErrorMessage>{state?.errors?.[name][0]}</ErrorMessage>
    )
  );
}
