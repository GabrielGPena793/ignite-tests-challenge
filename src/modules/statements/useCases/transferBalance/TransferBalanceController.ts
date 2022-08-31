import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferBalanceUseCase } from "./TranferBalanceUseCase";

class TransferBalanceController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { amount, description } = request.body;
    const { user_id: destining_user_id } = request.params;
    const { id: sender_user_id } = request.user;

    const transferBalanceUseCase = container.resolve(TransferBalanceUseCase);

    const transfer = await transferBalanceUseCase.execute({
      amount,
      description,
      destining_user_id,
      sender_user_id,
    });

    return response.json({ transfer });
  }
}

export { TransferBalanceController };
