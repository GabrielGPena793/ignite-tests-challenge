import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferStatementOperationError {
  export class DestiningUserNotFound extends AppError {
    constructor() {
      super("Destining User not found", 404);
    }
  }

  export class ownerUserNotFound extends AppError {
    constructor() {
      super("Owner User not found", 404);
    }
  }
}
