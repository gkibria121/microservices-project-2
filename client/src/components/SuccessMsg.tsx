import React, { PropsWithChildren } from "react";

function SuccessMsg({ children }: PropsWithChildren) {
  return (
    <div className="bg-green-100 text-green-500 p-4 text-lg rounded-md">
      {children}
    </div>
  );
}

export default SuccessMsg;
