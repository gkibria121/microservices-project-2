/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
   setupFilesAfterEnv  : [
    "./src/test/jest.global-setup.ts"
  ]
};