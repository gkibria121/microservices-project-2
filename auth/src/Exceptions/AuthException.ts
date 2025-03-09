import { CustomError, Errors } from "../contracts/CustomErrorContract";
class AuthException extends CustomError {
  constructor() {
    super("User is not authenticated!");
  }
  statusCode: number = 403;
  serializeErrors(): Errors {
    return {
      message: "User is not authenticated!",
    };
  }
}

export default AuthException;
