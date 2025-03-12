import React from "react";

type InputType = "text" | "password" | "number";

function Input({
  type = "text",
  name,
  key,
  defaultValue = null,
}: {
  type?: InputType;
  name: string;
  [key: string]: any;
}) {
  return (
    <input
      className="border focus:ring border-slate-300 focus:outline-none rounded-sm p-1"
      name={name}
      type={type}
      defaultValue={defaultValue}
      {...key}
    />
  );
}

export default Input;
