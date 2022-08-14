import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase";


let InMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create user", () => {

  beforeEach(() => {
    InMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(InMemoryUserRepository)
  })

  it("Should be able to create a new user", async () => {

    const result = await createUserUseCase.execute({
      name: "Gabriel",
      email: "gabriel@hotmail.com",
      password: "gg123",
    })

    expect(result).toHaveProperty("id");
    expect(result.name).toEqual("Gabriel");
  })


  it("Should not be able to create a new user if email already exists", async () => {

    await expect( async () => {
      await createUserUseCase.execute({
        name: "Gabriel",
        email: "gabriel@hotmail.com",
        password: "gg123",
      })

      await createUserUseCase.execute({
        name: "Gabriel",
        email: "gabriel@hotmail.com",
        password: "gg123",
      })

    }).rejects.toBeInstanceOf(AppError)

  })
})
