import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Statement Operations", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to create a deposit statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Gabriel",
      email: "gabriel@hotmail.com",
      password: "123546",
    });

    const { id } = user as { id: string };

    const result = await createStatementUseCase.execute({
      amount: 500,
      description: "Depositando na conta",
      user_id: id,
      type: OperationType.DEPOSIT,
    });

    expect(result).toHaveProperty("id");
    expect(result.amount).toEqual(500);
    expect(result.user_id).toEqual(id);
  });

  it("Should not be able to create a deposit statement if user not exits", async () => {
    await expect(async () => {
      const id = "invalidId";

      await createStatementUseCase.execute({
        amount: 500,
        description: "Depositando na conta",
        user_id: id,
        type: OperationType.DEPOSIT,
      });
    }).rejects.toEqual({ message: "User not found", statusCode: 404 });
  });

  it("Should be able to create a withdraw statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Gabriel",
      email: "gabriel@hotmail.com",
      password: "123546",
    });

    const { id } = user as { id: string };

    await createStatementUseCase.execute({
      amount: 500,
      description: "Depositando na conta",
      user_id: id,
      type: OperationType.DEPOSIT,
    });

    const result = await createStatementUseCase.execute({
      amount: 200,
      description: "Retirando da conta",
      user_id: id,
      type: OperationType.WITHDRAW,
    });

    expect(result).toHaveProperty("id");
    expect(result.amount).toEqual(200);
    expect(result.user_id).toEqual(id);
  });

  it("Should no be able to create a withdraw statement if don't have enough balance", async () => {
    await expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "Gabriel",
        email: "gabriel@hotmail.com",
        password: "123546",
      });

      const { id } = user as { id: string };

      await createStatementUseCase.execute({
        amount: 100,
        description: "Depositando na conta",
        user_id: id,
        type: OperationType.DEPOSIT,
      });

      await createStatementUseCase.execute({
        amount: 200,
        description: "Retirando da conta",
        user_id: id,
        type: OperationType.WITHDRAW,
      });
    }).rejects.toEqual({ message: "Insufficient funds", statusCode: 400 });
  });
});
