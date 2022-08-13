const mongoose = require("mongoose");
const request = require("supertest");

const app = require("./app");
const seedDB = require("./seedTestDB");

let token, userId, postId, commentId;

beforeAll(async () => {
  await seedDB();
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "johnsmith@example.com", password: "password" })
    .set("Accept", "application/json");

  token = res.body.token;
  userId = res.body.user.id;
});

describe("POST /api/posts/", () => {
  it("Should create a new post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .field("content", "Some post content.")
      .attach("postImg", "")
      .set("Authorization", `bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(201);
    expect(res.headers["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("post");
    expect(res.body.post.content).toEqual("Some post content.");

    postId = res.body.post._id;
  });
});

describe("POST /api/posts/:postId/commments", () => {
  it("Should add a new comment to the post", async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .send({ comment: "A comment." })
      .set("Authorization", `bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(201);
    expect(res.headers["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("comment");
    expect(res.body.comment.comment).toEqual("A comment.");

    commentId = res.body.comment._id;
  });
});

describe("DELETE /api/posts/:postId/commments/:commentId", () => {
  it("Should delete only comment from post", async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}/comments/${commentId}`)
      .set("Authorization", `bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Successfully deleted comment.");
  });

  it("Post should now have no comments", async () => {
    const res = await request(app)
      .get(`/api/posts/${postId}`)
      .set("Authorization", `bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("post");
    expect(res.body.post.comments).toHaveLength(0);
  });
});

describe("DELETE /api/posts/:postId", () => {
  it("Should delete post", async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set("Authorization", `bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Successfully deleted post.");
  });

  it("Get 404 from fetching post from middleware", async () => {
    const res = await request(app)
      .get(`/api/posts/${postId}`)
      .set("Authorization", `bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(404);
    expect(res.headers["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Post does not exist.");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
