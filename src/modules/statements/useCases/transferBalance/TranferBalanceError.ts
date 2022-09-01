import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferStatementOperationError {
  export class DestiningUserNotFound extends AppError {
    constructor() {
      super("Destining User not found", 404);
    }
  }

  export class senderUserNotFound extends AppError {
    constructor() {
      super("Sender User not found", 404);
    }
  }
}
