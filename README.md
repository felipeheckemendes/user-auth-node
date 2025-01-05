# User Authentication using Express, Mongoose and JWT

An **ongoing side project** focused on building a user authentication system leveraging Node.js, Express, JWT, and MongoDB/Mongoose.

## Project progress

### To-dos (project requirements)

- [ ] Create Logout functionality
- [ ] Extend forgot password functionality to work for cellphones SMS also
- [ ] Log reset requests
- [ ] Implement application restart after crashing

### More ideas to implement

- [ ] Email/cellphone confirmation for signup and email/cellphone updates
- [ ] Two factor authentication
- [ ] Maximum login attempts
- [ ] Capctcha challenge
- [ ] Rate limiting and other security measures

### Tests pending

- [ ] Test forgot and reset password
- [ ] Test getme and updateme routes
- [ ] Test deactivation/reactivation

### Done

- [x] Create a basic Sign-up functionality
- [x] Add development global error handling middleware
- [x] Add token response after Signup
- [x] Add Login route and functionality
- [x] Send jwt through cookies upon Login
- [x] Create password update functionality
- [x] Create forgot password functionality for email
- [x] Create password reset functionality
- [x] Add production global error handling middleware
- [x] Create global handling for rejections (async) and exceptions (sync) not handled by express
- [x] Create a getme user info functionality
- [x] Create a updateme to update user information
- [x] Create deactivate functionality to soft delete user
- [x] Create user admin route and functionality (get all users, update users, permanent delete users)
- [x] Set up security middleware to make application robust against different kinds of attacks.

## Known Issues

- [ ] User model cellphone match validator regex is not raising error when the cellphone number is not valid. Test "should throw a ValidationError if telephone not in international format" disabled for now

## Solved issues

- [x] CreatedAt should not be allowed to be manually set by user upon signup (and upon update)
