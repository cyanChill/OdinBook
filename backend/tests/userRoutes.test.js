const mongoose = require("mongoose");
const request = require("supertest");

const app = require("./app");
const seedDB = require("./seedTestDB");

let token, userId;

beforeAll(async () => {
  await seedDB();
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "johnsmith@example.com", password: "password" })
    .set("Accept", "application/json");

  token = res.body.token;
  userId = res.body.user.id;
});

describe("GET /api/users/", () => {
  it("Should get all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("users");
    expect(res.body.users).toHaveLength(3);
  });
});

describe("GET /api/users/:userId", () => {
  it("Should get information on current user", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("friends");
    expect(res.body.user).toHaveProperty("posts");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
