import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUserRepository
    );
  });

  it("Should be able to get balance", async () => {

    const user = await inMemoryUserRepository.create({
      name: "Gabriel",
      email: "gabriel@hotmail.com",
      password: "123456"
    })

    const { id } = user as { id:  string};


    const result = await getBalanceUseCase.execute({ user_id: id })


    expect(result).toHaveProperty("statement")
    expect(result).toHaveProperty("balance")

  });

  it("Should be able to get balance", async () => {


    await expect(async () => {
      const id  = "invalidID";


      await getBalanceUseCase.execute({ user_id: id })

    }).rejects.toEqual({message: "User not found", statusCode: 404})
  });
});
