// /client/app/signup/page.tsx
import Button from "@/src/components/Button";
import FormGroup from "@/src/components/FormGroup";
import Input from "@/src/components/Input";
import Label from "@/src/components/Label";
import React from "react";

function page() {
  return (
    <div>
      <form action="" className="mx-4 my-2">
        <h1 className="text-2xl font-semibold mb-2">Log in</h1>
        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <Input name="email" type="text" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input name="password" type="password" />
        </FormGroup>
        <Button className="mt-2">Sign In</Button>
      </form>
    </div>
  );
}

export default page;
