import React from "react";

type InputType = "text" | "password" | "number";

function Input({
  type = "text",
  name,
  ...others
}: {
  type?: InputType;
  name: string;
  others?: unknown[];
}) {
  return (
    <input
      className="border focus:ring border-slate-300 focus:outline-none rounded-sm p-1"
      name={name}
      type={type}
      {...others}
    />
  );
}

export default Input;
