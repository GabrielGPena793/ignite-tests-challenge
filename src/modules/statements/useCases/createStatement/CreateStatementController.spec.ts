import { Connection, createConnection } from "typeorm";
import request from "supertest"
import { app } from "../../../../app";


let connection: Connection;

interface User {
  id: string
  name: string
  email: string
  password: string
}

describe("Create Statement Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });


  it("Should be able to deposit", async () => {

    const {name, email, password} = {
      name: "Gabriel",
      email: "gabriel@hotmail.com",
      password: "123456"
    }

    await request(app).post("/api/v1/users").send({
      name,
      email,
      password
    });

    const responseAuthenticate = await request(app).post("/api/v1/sessions").send({
      email,
      password
    });

    const { user, token } = responseAuthenticate.body as { user: User, token: string};

    const response = await request(app).post("/api/v1/statements/deposit").send({
      amount: 100,
      description: "Recebimento do produto"
    }).set({
      Authorization:  `Bearer ${token}`,
      Headers: {
        user: user.id,
      }
    })

    expect(response.status).toBe(201)
    expect(response.body.amount).toBe(100)
    expect(response.body.type).toBe("deposit")

  })

  it("Should be able to withdraw", async () => {

    const { email, password} = {
      email: "gabriel@hotmail.com",
      password: "123456"
    }

    const responseAuthenticate = await request(app).post("/api/v1/sessions").send({
      email,
      password
    });

    const { user, token } = responseAuthenticate.body as { user: User, token: string};

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 100,
      description: "Recebimento do produto"
    }).set({
      Authorization:  `Bearer ${token}`,
      Headers: {
        user: user.id,
      }
    })

    expect(response.status).toBe(201)
    expect(response.body.amount).toBe(100)
    expect(response.body.type).toBe("withdraw")

  })
})
