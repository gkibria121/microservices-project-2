// global.d.ts
declare global {
  var testData:
    | {
        user: string;
        isActive: boolean;
      }
    | undefined;
}
declare module "supertest";
export {}; // This ensures the file is treated as a module
