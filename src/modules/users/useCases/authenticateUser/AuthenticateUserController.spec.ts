import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Authenticate User Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate user", async () => {

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

    const response = await request(app).post("/api/v1/sessions").send({
      email,
      password
    });

    expect(response.status).toBe(200)
    expect(response.body.user.email).toBe(email)
    expect(response.body).toHaveProperty("token")
  })

})
