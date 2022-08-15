import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";



let inMemoryUserRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  })

  it("Should be able to show user profile", async () => {

    const user = await createUserUseCase.execute({
      email: "gabriel@hotmail.com",
      name: "gabriel",
      password: "1234"
    })

    const { id } = user as { id: string } ;

    const userProfile = await showUserProfileUseCase.execute(id)

    expect(userProfile).toHaveProperty("id");
    expect(userProfile).toHaveProperty("email");
    expect(userProfile).toHaveProperty("name");
    expect(userProfile).toHaveProperty("password");
  })

  it("Should not be able to show user profile if not exits", async () => {

    await expect( async() => {
      const id = "fdsafafa554a"

      await showUserProfileUseCase.execute(id)

    }).rejects.toBeInstanceOf(AppError)
  })
})
