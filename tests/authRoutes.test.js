const mongoose = require("mongoose");
const request = require("supertest");

const app = require("./app");
const seedDB = require("./seedTestDB");

beforeAll(async () => {
  await seedDB();
});

describe("POST /signup", () => {
  it("Should return basic user info and token", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        first_name: "Steve",
        last_name: "Smith",
        email: "ss@gmail.com",
        password: "password",
        confirm_password: "password",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(201);
    expect(res.headers["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Successfully signed up user.");
  });
});

describe("POST /login", () => {
  it("Should return basic user info and token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "ss@gmail.com",
        password: "password",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Successfully logged in.");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
