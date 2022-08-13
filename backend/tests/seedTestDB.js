const { faker } = require("@faker-js/faker");

const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const { hashPassword } = require("../utils/hash");

const users = [];
const posts = [];
const comments = [];

const randomizedArr = (arrRef) => {
  const arrCpy = [...arrRef];
  for (let i = arrCpy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrCpy[i], arrCpy[j]] = [arrCpy[j], arrCpy[i]];
  }
  return arrCpy;
};

const generateBaseUser = async () => {
  const hashedPass = await hashPassword("password");

  const user = new User({
    first_name: "John",
    last_name: "Smith",
    email: "johnsmith@example.com",
    password: hashedPass,
    profilePicUrl: faker.image.imageUrl(),
    posts: [],
    friends: [],
    friendRequests: [],
  });

  users.push(user);
};

const generateUser = async () => {
  const hashedPass = await hashPassword("password");

  const user = new User({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: hashedPass,
    profilePicUrl: faker.image.imageUrl(),
    posts: [],
    friends: [],
    friendRequests: [],
  });

  users.push(user);
};

const generateFriends = () => {
  users.forEach((user) => {
    const usersExcCurr = users.filter((usr) => usr._id !== user._id);
    const shuffUsers = randomizedArr(usersExcCurr);
    const randUser = shuffUsers[0];

    user.friends = Array.from(new Set([...user.friends, randUser._id]));

    const randUserIdx = users.findIndex((usr) => usr._id === randUser._id);
    users[randUserIdx].friends = Array.from(
      new Set([...randUser.friends, user._id])
    );
  });
};

const generatePost = (user) => {
  const post = new Post({
    author: user,
    content: faker.lorem.sentences(),
    timestamp: faker.date.past(2),
    imgUrl: faker.image.imageUrl(),
    comments: [],
    likes: [],
  });

  posts.push(post);
  user.posts.push(post._id);
};

const createPosts = () => {
  users.forEach((usr) => {
    for (let i = 0; i < 2; i++) {
      generatePost(usr);
    }
  });
};

const addLikesToPosts = () => {
  posts.forEach((post) => {
    post.author.friends.forEach((friendId) => {
      post.likes.push(friendId);
    });
  });
};

const addCommentsToPosts = () => {
  posts.forEach((post) => {
    post.author.friends.forEach((friendId) => {
      const cmt = new Comment({
        user: friendId,
        comment: faker.lorem.sentence(),
        timestamp: new Date(),
        post: post._id,
        likes: [],
      });
      comments.push(cmt);
      post.comments.push(cmt._id);
    });
  });
};

const addLikesToComments = () => {
  posts.forEach((post) => {
    post.comments.forEach((cmt) => {
      const realCmt = comments.find((comt) => comt._id === cmt);
      post.author.friends.forEach((usr) => realCmt.likes.push(usr));
    });
  });
};

const seedDB = async () => {
  await generateBaseUser();

  for (let i = 0; i < 2; i++) await generateUser();

  generateFriends();
  createPosts();
  addLikesToPosts();
  addCommentsToPosts();
  addLikesToComments();

  for (let usr of users) {
    try {
      await usr.save();
    } catch (e) {
      console.log(e);
    }
  }

  for (let pst of posts) {
    try {
      await pst.save();
    } catch (e) {
      console.log(e);
    }
  }

  for (let cmt of comments) {
    try {
      await cmt.save();
    } catch (e) {
      console.log(e);
    }
  }

  return { users, posts, comments };
};

module.exports = seedDB;
