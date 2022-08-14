# OdinWorks

This is a app that functions similarly to Facebook. You can create an account and create posts (with images). You can search for other users using the search feature and send a friend request (in order to view their posts).

- A bonus is that you can sign-in with Facebook!
- There's also the option of signing into a shared demo account (by selecting the option on the login page).

**Live Demostration:** https://odin-works.netlify.app/

> **Note:** It may take some time for the app to work as the backend running on Heroku may need to wake up.


https://user-images.githubusercontent.com/83375816/184554584-2ebed335-655e-4c5e-a748-e4d994cbc5c3.mp4


## Project Info

More about the project can be found at: https://www.theodinproject.com/lessons/nodejs-odin-book.

## Setup

Setting up this app on your own is pretty simple.

### Environment Variables

We utilize a couple of environment variables in the frontend and backend:

#### Frontend

| Variable Name         | Value                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `REACT_APP_BACKEND_URL` | This contains the url to your backend server. For example: "http://localhost:5000" (make sure you don't have a "/" at the end.) |

#### Backend

| Variable Name               | Value                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `MONGO_URI`                   | URI value to your MongoDB server.                                                                    |
| `SECRET_KEY`                  | A string used to sign the JWT tokens.                                                                |
| `FACEBOOK_APP_ID`             | The APP ID from your Facebook app. You can sign up here: https://developers.facebook.com/.           |
| `FACEBOOK_APP_SECRET`         | This is the APP SECRET for your Facebook app.                                                        |
| `FACEBOOK_CALLBACK_URL`       | This is the url refering to the "/api/auth/facebook/redirect" route.                                 |
| `FIREBASE_PROJECT_ID`         | You can find this (called "project_id") in file when you generate a new service account on Firebase. |
| `FIREBASE_ADMIN_PRIVATE_KEY`  | This is also found in the service account file (called "private_key").                               |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | This is also found in the service account file (called "client_email").                              |
| `FIREBASE_BUCKET_NAME`        | This is the same as the FIREBASE_PROJECT_ID.                                                         |
| `PORT`                        | This is the port number the server will run on.                                                      |
| `DEMO_USER_ID`                | This is the id of the account use for demo purposes.                                                 |
| `FRONTEND_URL`                | This contains the url to your frontend (make sure you don't have a "/" at the end. of the url).      |
| `DEBUG` | A comma-seperated list specifying which debug messages we want to show. Possible values in the list: `authController`, `commentsController`, `friendsController`, `images`, `jwt`, `middleware`, `passport`, `postsController`, and `usersController`. |
