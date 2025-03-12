import React, { PropsWithChildren } from "react";

function Button({
  children,
  className,
  disabled,
}: { className: string; disabled?: boolean } & PropsWithChildren) {
  return (
    <button
      className={"rounded-md bg-blue-500 px-4 py-2 text-white " + className}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
