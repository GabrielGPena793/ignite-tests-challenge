import { hash } from "bcryptjs";
import { Connection, createConnection } from "typeorm"
import {  v4 as uuidV4 } from "uuid"
import request from "supertest"
import { app } from "../../../../app";

let connection: Connection;

describe(" Transfer Balance Controller", () => {

  beforeAll( async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const id2 = uuidV4();

    const password = await hash("admin", 8);
    const passwordUser = await hash("user", 8);

    await connection.query(
      `INSERT INTO users (id, name, email, password, created_at, updated_at )
       values ('${id}', 'admin', 'admin@hotmail.com', '${password}', 'now()', 'now()')
      `
    )

    await connection.query(
      `INSERT INTO users (id, name, email, password, created_at, updated_at )
       values  ('${id2}', 'gabriel', 'gabriel@hotmail.com', '${password}', 'now()', 'now()')
      `
    )

  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to transfer balance", async () => {

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: "admin@hotmail.com",
      password: "admin"
    })

    const { user, token } = responseToken.body;




  })
})
