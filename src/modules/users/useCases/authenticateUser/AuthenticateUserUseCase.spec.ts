import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUserRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("Should be Authenticate user", async () => {
    const [email, password] = ["gabriel@hotmail.com", "123456"];

    await createUserUseCase.execute({
      email,
      name: "Gabriel",
      password,
    });

    const response = await authenticateUserUseCase.execute({
      email,
      password,
    });

    expect(response).toHaveProperty("token");
  });

  it("Should not be Authenticate with wrong email", async () => {
    await expect(async () => {
      const [email, password] = ["gabriel@hotmail.com", "123456"];

      await createUserUseCase.execute({
        email,
        name: "Gabriel",
        password,
      });

      await authenticateUserUseCase.execute({
        email: "emailInvalid",
        password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be Authenticate with wrong password", async () => {
    await expect(async () => {
      const [email, password] = ["gabriel@hotmail.com", "123456"];

      await createUserUseCase.execute({
        email,
        name: "Gabriel",
        password,
      });

      await authenticateUserUseCase.execute({
        email,
        password: "passwordInvalid",
      });
    }).rejects.toEqual({
      message: "Incorrect email or password",
      statusCode: 401,
    });
  });
});
