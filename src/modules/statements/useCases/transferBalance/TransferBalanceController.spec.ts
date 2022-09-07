import { hash } from "bcryptjs";
import { Connection, createConnection } from "typeorm"
import {  v4 as uuidV4 } from "uuid"
import request from "supertest"
import { app } from "../../../../app";

let connection: Connection;

describe(" Transfer Balance Controller", () => {
  const id2 = uuidV4();

  beforeAll( async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();

    const password = await hash("admin", 8);

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

    await request(app).post("/api/v1/statements/deposit").send({
      amount: 100,
      description: "deposit quantity"
    }).set({
      Authorization:  `Bearer ${token}`,
      Headers: {
        user: user.id,
      }
    })

    const result = await request(app).post(`/api/v1/statements/transfers/${id2}`).send({
      amount: 100,
      description: "transfer quantity"
    }).set({
      Authorization:  `Bearer ${token}`,
      Headers: {
        user: user.id,
      }
    })

    const responseTokenUserTarget = await request(app).post('/api/v1/sessions').send({
      email: "gabriel@hotmail.com",
      password: "admin"
    })

    const balance = await request(app).get(`/api/v1/statements/balance`).send({
      amount: 100,
      description: "transfer quantity"
    }).set({
      Authorization:  `Bearer ${responseTokenUserTarget.body.token}`,
      Headers: {
        user: responseTokenUserTarget.body.id,
      }
    })

    expect(result.body).toEqual({transfer: "Transfer successfully"})
    expect(balance.body.statement[0]).toHaveProperty("sender_id")

  })
})
