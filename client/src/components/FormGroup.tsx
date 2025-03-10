import React, { PropsWithChildren } from "react";

function FormGroup({ children }: PropsWithChildren) {
  return <div className="mt-2 flex flex-col gap-y-2">{children}</div>;
}

export default FormGroup;
