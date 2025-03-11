// /client/app/signup/page.tsx
import AuthForm from "@/src/components/AuthForm";
import React from "react";

function page() {
  return (
    <div>
      <AuthForm mode="login" />
    </div>
  );
}

export default page;
