export type Cookie = {
  name: string;
  value: string;
  cookie: {
    path?: string;
    expires?: number | Date;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    domain?: string;
  };
};
