# User Authentication using Express, Mongoose and JWT

This is an **ongoing** side project where I intend build a user authentication system using Node.js, Express, JWT and MongoDB.

## To-dos (project requirements)

- [ ] Add global exception and rejection error handling
- [ ] Create Logout functionality
- [ ] Extend forgot password functionality to work for cellphones SMS also
- [ ] Create password reset functionality
- [ ] Create a getme user info functionality
- [ ] Create a updateme to update user information such as email
- [ ] Create deactivate functionality to soft delete user
- [ ] Create user admin route and functionality (get all users, update users, permanent delete users)
- [ ] Set up security middleware to make application robust against different kinds of attacks.
- [ ] Log reset requests

## More ideas to implement

- [ ] Email/cellphone confirmation for signup
- [ ] Two factor authentication
- [ ] Maximum login attempts
- [ ] Capctcha challenge
- [ ] Rate limiting and other security measures

## Done

- [x] Create a basic Sign-up functionality
- [x] Add development global error handling middleware
- [x] Add token response after Signup
- [x] Add Login route and functionality
- [x] Send jwt through cookies upon Login
- [x] Create password update functionality
- [x] Create forgot password functionality for email
- [x] Add production global error handling middleware
