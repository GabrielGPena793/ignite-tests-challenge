import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { TransferBalanceUseCase } from "./TranferBalanceUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let transferBalanceUseCase: TransferBalanceUseCase;

describe("Transfer balance UseCase", () => {
  beforeAll(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    transferBalanceUseCase = new TransferBalanceUseCase(
      userRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("Should be able to transfer", async () => {
    const user_destining = await userRepositoryInMemory.create({
      email: "gabriel@hotmail.com",
      name: "Gabriel",
      password: "1234"
    })

    const user_owner = await userRepositoryInMemory.create({
      email: "jorge@hotmail.com",
      name: "Jorge",
      password: "1234"
    })

    statementRepositoryInMemory.create({
      amount: 100,
      description: "test deposit",
      type: OperationType.DEPOSIT,
      user_id: user_owner.id  as string
    })

    const result = await transferBalanceUseCase.execute({
      amount: 100,
      description: "Transfer test",
      destining_user_id: user_destining.id as string,
      sender_user_id: user_owner.id as string
    })


    expect(result).toBe("Transfer successfully");
  });

  it("Should not be able to transfer when don't have enough money", async () => {
    const user_destining = await userRepositoryInMemory.create({
      email: "gabriel@hotmail.com",
      name: "Gabriel",
      password: "1234"
    })

    const user_owner = await userRepositoryInMemory.create({
      email: "jorge@hotmail.com",
      name: "Jorge",
      password: "1234"
    })

    statementRepositoryInMemory.create({
      amount: 100,
      description: "test deposit",
      type: OperationType.DEPOSIT,
      user_id: user_owner.id  as string
    })


    await expect(transferBalanceUseCase.execute({
      amount: 102,
      description: "Transfer test",
      destining_user_id: user_destining.id as string,
      sender_user_id: user_owner.id as string
    })).rejects.toEqual({ message: 'Insufficient funds', statusCode: 400 });

  });

  it("Should not be able to transfer when not found a destiny user", async () => {


    const user_owner = await userRepositoryInMemory.create({
      email: "jorge@hotmail.com",
      name: "Jorge",
      password: "1234"
    })

    statementRepositoryInMemory.create({
      amount: 100,
      description: "test deposit",
      type: OperationType.DEPOSIT,
      user_id: user_owner.id  as string
    })


    await expect(transferBalanceUseCase.execute({
      amount: 102,
      description: "Transfer test",
      destining_user_id: "invalid id",
      sender_user_id: user_owner.id as string
    })).rejects.toEqual({ message: 'Destining User not found', statusCode: 404 });

  });

  it("Should not be able to transfer when not found a sender user", async () => {

    const user_destining = await userRepositoryInMemory.create({
      email: "gabriel@hotmail.com",
      name: "Gabriel",
      password: "1234"
    })

    await expect(transferBalanceUseCase.execute({
      amount: 102,
      description: "Transfer test",
      destining_user_id: user_destining.id as string,
      sender_user_id: "invalid id"
    })).rejects.toEqual({ message: 'Sender User not found', statusCode: 404 });

  });

});
