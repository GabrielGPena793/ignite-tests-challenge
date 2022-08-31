import { inject, injectable } from "tsyringe";
import { inherits } from "util";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { TransferStatementOperationError } from "./TranferBalanceError";

interface IRequest {
  amount: number;
  description: string;
  destining_user_id: string;
  sender_user_id: string;
}

@injectable()
class TransferBalanceUseCase {
  constructor(
    @inject("UsersRepository")
    private userRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementRepository: IStatementsRepository
  ) {}

  async execute({
    amount,
    description,
    destining_user_id,
    sender_user_id,
  }: IRequest) {
    const user_owner = await this.userRepository.findById(sender_user_id);

    if (!user_owner) {
      throw new TransferStatementOperationError.ownerUserNotFound();
    }

    const user_destining = await this.userRepository.findById(
      destining_user_id
    );

    if (!user_destining) {
      throw new TransferStatementOperationError.DestiningUserNotFound();
    }

    const { balance } = await this.statementRepository.getUserBalance({
      user_id: sender_user_id,
    });

    if (Number(balance) < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }


    await this.statementRepository.create({
      user_id: sender_user_id,
      description,
      type: OperationType.TRANSFER,
      amount
    });


    await this.statementRepository.create({
      user_id: destining_user_id,
      description: "Transferência",
      type:  OperationType.DEPOSIT,
      amount,
      sender_id: sender_user_id,
    });

    return "Transfer successfully"
  }
}

export { TransferBalanceUseCase };
