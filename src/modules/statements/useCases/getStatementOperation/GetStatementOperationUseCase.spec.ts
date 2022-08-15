import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Statement operation infos", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to access Statement information", async () => {

    const user = await inMemoryUsersRepository.create({
      name: "Gabriel",
      email: "Gabriel@hotmail.com",
      password: "123456"
    })

    const { id: user_id } = user as { id: string }

    const statement = await inMemoryStatementsRepository.create({
      amount: 1000,
      description: "Locação de carro",
      type: OperationType.DEPOSIT,
      user_id
    })

    const { id: statement_id } = statement as { id: string }

    const result = await getStatementOperationUseCase.execute({user_id, statement_id })

    expect(result.user_id).toEqual(user_id);
    expect(result.id).toEqual(statement_id);
    expect(result.amount).toEqual(1000);
    expect(result.type).toEqual(OperationType.DEPOSIT);
  });

  it("Should not be able to access Statement information if user not exits", async () => {

    await expect(async () => {

      const user_id = "InvalidId"

      const statement = await inMemoryStatementsRepository.create({
        amount: 1000,
        description: "Locação de carro",
        type: OperationType.DEPOSIT,
        user_id
      })

      const { id: statement_id } = statement as { id: string }

      await getStatementOperationUseCase.execute({user_id, statement_id })

    }).rejects.toEqual({message: 'User not found', statusCode: 404})

  });

  it("Should not be able to access Statement information if statement not exits", async () => {

    await expect(async () => {

      const user = await inMemoryUsersRepository.create({
        name: "Gabriel",
        email: "Gabriel@hotmail.com",
        password: "123456"
      })

      const { id: user_id } = user as { id: string }

      const statement_id = "invalidId"

      await getStatementOperationUseCase.execute({user_id, statement_id })

    }).rejects.toEqual({message: 'Statement not found', statusCode: 404})

  });
});
