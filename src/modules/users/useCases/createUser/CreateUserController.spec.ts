import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Create user Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a user", async () => {

    const response = await request(app).post("/api/v1/users").send({
      name: "Gabriel",
      email: "gabriel@hotmail.com",
      password: "123456"
    });

    console.log(response.body)

    expect(response.status).toBe(201)

  });

  it("Should not be able to create a new user if already exits", async () => {

    const response = await request(app).post("/api/v1/users").send({
      name: "Gabriel",
      email: "gabriel@hotmail.com",
      password: "123456"
    });

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("User already exists")

  });
});
