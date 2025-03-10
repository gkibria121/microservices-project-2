import React, { PropsWithChildren } from "react";

function Button({
  children,
  className,
}: { className: string } & PropsWithChildren) {
  return (
    <button
      className={"rounded-md bg-blue-500 px-4 py-2 text-white " + className}
    >
      {children}
    </button>
  );
}

export default Button;
