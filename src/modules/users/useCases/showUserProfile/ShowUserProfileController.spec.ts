import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

interface User {
  id: string,
  name: string,
  email: string
}

describe("Create user Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to show user profile", async () => {

    const { email, password, name } = {
      name: "Gabriel",
      email: "gabriel@hotmail.com",
      password: "123456"
    }

    await request(app).post("/api/v1/users").send({
      name,
      email,
      password
    });

    const responseToken =  await request(app).post("/api/v1/sessions").send({
      email,
      password
    });

    const { token, user } = responseToken.body as { token: string, user: User };

    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`,
      Headers: {
        user: user.id
      }
    })


    expect(response.status).toBe(200)
    expect(response.body.email).toBe(email)
    expect(response.body.name).toBe(name)

  });
});
