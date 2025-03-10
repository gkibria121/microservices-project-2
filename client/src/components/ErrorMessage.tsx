import React, { PropsWithChildren } from "react";

function ErrorMessage({ children }: PropsWithChildren) {
  return <p className="text-red-500">{children}</p>;
}

export default ErrorMessage;
