import React, { PropsWithChildren } from "react";

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
} & PropsWithChildren) {
  return <label htmlFor={htmlFor}>{children}</label>;
}

export default Label;
