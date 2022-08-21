import { Response } from "express";
import request from "supertest";
import { Connection, createConnection } from "typeorm"
import { app } from "../../../../app";


let connection: Connection;

interface User {
  id: string
  name: string
  email: string
  password: string
}

describe("Get balance controller", () => {


  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be return balance", async () => {

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

    await request(app).post("/api/v1/statements/deposit").send({
      amount: 100,
      description: "Recebimento do produto"
    }).set({
      Authorization:  `Bearer ${token}`,
      Headers: {
        user: user.id,
      }
    })

    const response = await request(app).get("/api/v1/statements/balance").set({
      Authorization:  `Bearer ${token}`,
      Headers: {
        user: user.id,
      }
    })

    expect(response.status).toBe(200)
    expect(response.body.balance).toBe(100)
    expect(response.body.statement[0].description).toBe("Recebimento do produto")

  })
})
