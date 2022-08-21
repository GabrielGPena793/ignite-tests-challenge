import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to get a operation", async () => {
    const { name, email, password } = {
      name: "Gabriel",
      email: "gabriel@hotmail.com",
      password: "123456",
    };

    await request(app).post("/api/v1/users").send({
      name,
      email,
      password,
    });

    const responseAuthenticate = await request(app)
      .post("/api/v1/sessions")
      .send({
        email,
        password,
      });

    const { user, token } = responseAuthenticate.body as {
      user: User;
      token: string;
    };

    const statement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Recebimento do produto",
      })
      .set({
        Authorization: `Bearer ${token}`,
        Headers: {
          user: user.id,
        },
      });

    const response = await request(app)
      .get(`/api/v1/statements/${statement.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(statement.body.id)
    expect(Number(response.body.amount)).toBe(100)

  });
});
