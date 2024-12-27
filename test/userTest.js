/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

chai.use(chaiAsPromised);
chai.use(chaiHttp);
const { expect } = chai;
const sinon = require('sinon');
const { before, after, describe, it, beforeEach } = require('mocha');
const dotenv = require('dotenv');

const app = require('../app');
const userController = require('../controllers/userController');
const User = require('../models/userModel');

const { ValidationError } = mongoose.Error; // Import ValidationError from Mongoose
const AppError = require('../utils/appError');

// Start up database
before(async () => {
  try {
    dotenv.config({ path: path.join(__dirname, '..', '/.env'), encoding: 'utf8', debug: false });
    await mongoose.connect(
      process.env.TEST_DATABASE.replace('<db_password>', process.env.TEST_DATABASE_PASSWORD),
    );
    console.log('Connected to test database');
  } catch (err) {
    console.error('Failed to connect to test database:', err);
    process.exit(1);
  }
});

// Clear the database before each test
beforeEach(async () => {
  await User.deleteMany({});
});

// Disconnect from the test database after all tests
after(async () => {
  await mongoose.connection.dropDatabase(); // Drop the entire test database
  await mongoose.connection.close();
  console.log('Disconnected from test database');
});

// Handle unexpected errors to ensure proper cleanup
process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err);
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  process.exit(1);
});

// Handle manual interruption
process.on('SIGINT', async () => {
  await mongoose.connection.dropDatabase(); // Drop the entire test database
  await mongoose.connection.close();
  process.exit(0);
});

describe('1. User Controller sign-up', () => {
  it('should not reject if at least email or phone number is provided along with matching password', async () => {
    await mongoose.connection.dropDatabase();
    // email signup
    const body = {
      email: 'name5@email.com',
      password: '123456789',
      passwordConfirm: '123456789',
    };
    await User.create(body);
    await mongoose.connection.dropDatabase();
    // cellphone signup
    const body2 = {
      cellphone: '+5541991919123',
      password: '123456789',
      passwordConfirm: '123456789',
    };
    await User.create(body2);
    await expect(User.create(body)).to.be.fulfilled;
    await mongoose.connection.dropDatabase();
    // phone+email signup
    const body3 = {
      email: 'name2@email.com',
      cellphone: '+5541991919123',
      password: '123456789',
      passwordConfirm: '123456789',
    };
    await User.create(body3);
    await expect(User.create(body)).to.be.fulfilled;
    await mongoose.connection.dropDatabase();
  });

  it('should throw an error if email is in wrong format', async () => {
    await mongoose.connection.dropDatabase();
    const body = {
      email: 'name@email',
      password: '123456789',
      passwordConfirm: '123456789',
    };
    await expect(User.create(body)).to.be.rejectedWith(ValidationError);
  });

  it('should throw an AppError if no email or telephone is provided', async () => {
    await mongoose.connection.dropDatabase();
    const body = {
      password: '123456789',
      passwordConfirm: '123456789',
    };
    await expect(User.create(body)).to.be.rejectedWith(AppError);
  });

  it('should throw ValidationError if password has less then 8 characters', async () => {
    await mongoose.connection.dropDatabase();
    const body = {
      email: 'name@email.com',
      password: '1234567',
      passwordConfirm: '1234567',
    };
    await expect(User.create(body)).to.be.rejectedWith(ValidationError);
  });

  it('should throw ValidationError if passwordConfirm does not match', async () => {
    await mongoose.connection.dropDatabase();
    const body = {
      email: 'name@email.com',
      password: '123456789',
      passwordConfirm: '12345678',
    };
    await expect(User.create(body)).to.be.rejectedWith(ValidationError);
  });

  it('should throw a ValidationError if email already in use', async () => {
    await mongoose.connection.dropDatabase();
    const body = {
      email: 'name@email.com',
      password: '123456789',
      passwordConfirm: '123456789',
    };
    await User.create(body);
    await expect(User.create(body)).to.be.rejectedWith(ValidationError);
  });

  it('should throw a ValidationError if cellphone already in use', async () => {
    await mongoose.connection.dropDatabase();
    const body1 = {
      cellphone: '+5541991919123',
      password: '123456789',
      passwordConfirm: '123456789',
    };
    await User.create(body1);
    const body2 = {
      cellphone: '+5541991919123',
      password: '123456789',
      passwordConfirm: '123456789',
    };
    await expect(User.create(body2)).to.be.rejectedWith(ValidationError);
  });

  it('should throw a ValidationError if email already in use, even though phone numbers are different', async () => {
    await mongoose.connection.dropDatabase();
    const body1 = {
      cellphone: '+5541991919123',
      email: 'name@email.com',
      password: '123456789',
      passwordConfirm: '123456789',
    };
    await User.create(body1);
    const body2 = {
      cellphone: '+5541999922222',
      email: 'name@email.com',
      password: '123456789',
      passwordConfirm: '123456789',
    };
    await expect(User.create(body2)).to.be.rejectedWith(ValidationError);
  });

  it('should throw a ValidationError if cellphone already in use, even though emails are different', async () => {
    await mongoose.connection.dropDatabase();
    const body1 = {
      cellphone: '+5541991919123',
      email: 'name1@email.com',
      password: '123456789',
      passwordConfirm: '123456789',
    };
    await User.create(body1);
    const body2 = {
      cellphone: '+5541991919123',
      email: 'name2@email.com',
      password: '123456789',
      passwordConfirm: '123456789',
    };
    await expect(User.create(body2)).to.be.rejectedWith(ValidationError);
  });

  // it('should throw a ValidationError if telephone not in international format', async () => {
  //   await mongoose.connection.dropDatabase();
  //   const body = {
  //     phone: '5541991913333',
  //     email: 'name@email.com',
  //     password: '123456789',
  //     passwordConfirm: '123456789',
  //   };
  //   const user = new User(body);
  //   await expect(user.validate()).to.be.rejectedWith(ValidationError);
  //   await expect(user.create()).to.be.rejectedWith(ValidationError);
  // });

  it('after user creation, password should be encrypted, and passwordConfirm should be undefined', async () => {
    await mongoose.connection.dropDatabase();
    const password = '123456789';
    const body = {
      email: 'name@email.com',
      password: password,
      passwordConfirm: password,
    };
    const user = await User.create(body);
    await expect(user.password).to.not.be.equal(password);
    await expect(user.passwordConfirm).to.be.equal(undefined);
  });

  it('user should not be able to set a custom createdAt date', async () => {
    await mongoose.connection.dropDatabase();
    const customDate = new Date('2000-01-01T00:00:00Z');
    const body = {
      createdAt: customDate,
      email: 'name@email.com',
      password: '123456789',
      passwordConfirm: '123456789',
    };
    await User.create(body);
    const user = User.find({ email: 'name@email.com' });
    await expect(user.createdAt).to.not.be.equal(customDate);
  });

  it('user should be persisted on the database after signup', async () => {
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    const res = await chai.request(app).post('/api/v1/users/signup').send(user);

    // Verify user was saved in the database
    const userInDb = await User.findOne({ email: user.email });
    expect(userInDb).to.exist;
    expect(userInDb.name).to.equal(user.name);
    expect(userInDb.email).to.equal(user.email);
  });

  it('should send a JWT token in the response', async () => {
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    const res = await chai.request(app).post('/api/v1/users/signup').send(user);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('status').that.equals('success');
    expect(res.body).to.have.property('token').that.is.a('string');
    expect(res.body).to.have.property('data');
    expect(res.body.data).to.include({
      email: user.email,
    });
  });
});

describe('2. User Controller log-in', () => {
  it('user should receive back a token if email and password are correct', async () => {
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    await chai.request(app).post('/api/v1/users/signup').send(user);

    const res = await chai.request(app).post('/api/v1/users/login').send(user);
    // Verify that user received token back after login
    expect(res).to.have.status(201);
    expect(res.body).to.have.property('status').that.equals('success');
    expect(res.body).to.have.property('token').that.is.a('string');
    expect(res.body).to.have.property('data');
    expect(res.body.data).to.include({
      email: user.email,
    });
  });

  it('user should receive an fail response if no email or phone was provided', async () => {
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    await chai.request(app).post('/api/v1/users/signup').send(user);

    const res = await chai.request(app).post('/api/v1/users/login').send({
      password: 'password123',
    });
    // Verify that user received error
    expect(res).to.have.status(400);
    expect(res.body).to.have.property('status').that.equals('fail');
  });

  it('user should receive a fail response if email is incorrect and no phone provided', async () => {
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    await chai.request(app).post('/api/v1/users/signup').send(user);

    const res = await chai.request(app).post('/api/v1/users/login').send({
      email: 'wronguser@example.com',
      password: 'password123',
    });
    // Verify that user received error
    expect(res).to.have.status(400);
    expect(res.body).to.have.property('status').that.equals('fail');
  });

  it('user should receive a fail response if cellphone is incorrect and no email provided', async () => {
    const user = {
      cellphone: '+554112345678',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    await chai.request(app).post('/api/v1/users/signup').send(user);

    const res = await chai.request(app).post('/api/v1/users/login').send({
      cellphone: '+554199999999',
      password: 'password123',
    });
    // Verify that user received error
    expect(res).to.have.status(400);
    expect(res.body).to.have.property('status').that.equals('fail');
  });

  it('user should succesfully login if email is correct but password not', async () => {
    const user = {
      email: 'john@example.com',
      cellphone: '+554112345678',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    await chai.request(app).post('/api/v1/users/signup').send(user);

    const res = await chai.request(app).post('/api/v1/users/login').send({
      email: 'john@example.com',
      cellphone: '+554199999999',
      password: 'password123',
    });
    // Verify that user received token back after login
    expect(res).to.have.status(201);
    expect(res.body).to.have.property('status').that.equals('success');
    expect(res.body).to.have.property('token').that.is.a('string');
    expect(res.body).to.have.property('data');
    expect(res.body.data).to.include({
      email: user.email,
    });
  });

  // describe closing
});

describe('3. User Controller is authenticated middleware', () => {
  it('should not raise an error if the token is valid & user should be added to req', async () => {
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    await chai.request(app).post('/api/v1/users/signup').send(user);

    const res = await chai.request(app).post('/api/v1/users/login').send(user);
    // Verify that user received token back after login
    expect(res.body).to.have.property('token').that.is.a('string');
    const { token } = res.body;
    const req = {};
    req.headers = {};
    req.headers.authorization = `Bearer ${token}`;
    await expect(
      userController.isAuthenticated(req, {}, (param) => {
        if (param !== undefined) throw new AppError('AppError');
      }),
    ).to.be.fulfilled;
    await expect(req.user).to.exist;
    await expect(req.user.id).to.exist;
  });

  it('should forward AppError to next() if the token payload has been tampered with', async () => {
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    await chai.request(app).post('/api/v1/users/signup').send(user);

    const res = await chai.request(app).post('/api/v1/users/login').send(user);
    // Verify that user received token back after login
    expect(res.body).to.have.property('token').that.is.a('string');
    const { token } = res.body;
    const payload = {
      id: res.body.data._id,
      iat: Math.floor(Date.now() / 1000 - 10),
      exp: Math.floor(Date.now() / 1000 + 60 * 24 * process.env.JWT_EXPIRES_DAYS),
    };
    const newToken = jwt.sign(payload, 'wrong-secret');

    const req = {};
    req.headers = {};
    req.headers.authorization = `Bearer ${newToken}`;
    await expect(
      userController.isAuthenticated(req, {}, (err) => {
        if (err !== undefined) throw err;
      }),
    ).to.be.rejectedWith('You are not logged in. Please log in to access this resource');
  });

  it('should forward AppError to next() if no token is sent on the header', async () => {
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    await chai.request(app).post('/api/v1/users/signup').send(user);

    const res = await chai.request(app).post('/api/v1/users/login').send(user);
    // Verify that user received token back after login
    expect(res.body).to.have.property('token').that.is.a('string');
    const newToken = '';

    const req = {};
    req.headers = {};
    req.headers.authorization = `Bearer ${newToken}`;
    await expect(
      userController.isAuthenticated(req, {}, (err) => {
        if (err !== undefined) throw err;
      }),
    ).to.be.rejectedWith('You are not logged in. Please log in to access this resource');
  });

  it('should forward AppError to next() if the user ID does not exist on the DB', async () => {
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    await chai.request(app).post('/api/v1/users/signup').send(user);

    const res = await chai.request(app).post('/api/v1/users/login').send(user);
    // Verify that user received token back after login
    expect(res.body).to.have.property('token').that.is.a('string');
    const { token } = res.body;
    const payload = {
      id: '6765c8e6a75a958e67798154', // Wrong ID
      iat: Math.floor(Date.now() / 1000 - 10),
      exp: Math.floor(Date.now() / 1000 + 60 * 24 * process.env.JWT_EXPIRES_DAYS),
    };
    const newToken = jwt.sign(payload, process.env.JWTSECRET);

    const req = {};
    req.headers = {};
    req.headers.authorization = `Bearer ${newToken}`;
    await expect(
      userController.isAuthenticated(req, {}, (err) => {
        if (err !== undefined) throw err;
      }),
    ).to.be.rejectedWith('You are not logged in. Please log in to access this resource');
  });

  it('should forward AppError to next() if the token is expired', async () => {
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    await chai.request(app).post('/api/v1/users/signup').send(user);

    const res = await chai.request(app).post('/api/v1/users/login').send(user);
    // Verify that user received token back after login
    expect(res.body).to.have.property('token').that.is.a('string');
    const { token } = res.body;
    const payload = {
      id: res.body.data._id,
      iat: Math.floor(Date.now() / 1000 - 10),
      exp: Math.floor(Date.now() / 1000 - 5), // Simulate expired token
    };
    const newToken = jwt.sign(payload, process.env.JWTSECRET);

    const req = {};
    req.headers = {};
    req.headers.authorization = `Bearer ${newToken}`;
    await expect(
      userController.isAuthenticated(req, {}, (err) => {
        if (err !== undefined) throw err;
      }),
    ).to.be.rejectedWith('You are not logged in. Please log in to access this resource');
  });

  // it('should forward AppError to next() if the token is expired', async () => {
  // // To be implemented after update password is created
  // });

  it('should forward AppError to next() if the user ID cannot be cast', async () => {
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    await chai.request(app).post('/api/v1/users/signup').send(user);

    const res = await chai.request(app).post('/api/v1/users/login').send(user);
    // Verify that user received token back after login
    expect(res.body).to.have.property('token').that.is.a('string');
    const { token } = res.body;
    const payload = {
      id: 'wrong-id-format', // Wrong ID
      iat: Math.floor(Date.now() / 1000 - 10),
      exp: Math.floor(Date.now() / 1000 + 60 * 24 * process.env.JWT_EXPIRES_DAYS),
    };
    const newToken = jwt.sign(payload, process.env.JWTSECRET);

    const req = {};
    req.headers = {};
    req.headers.authorization = `Bearer ${newToken}`;
    await expect(
      userController.isAuthenticated(req, {}, (err) => {
        if (err !== undefined) throw err;
      }),
    ).to.be.rejectedWith('Cast to ObjectId failed for value');
  });
});

describe('4. User Route/Controller updatePassword', () => {
  it('should receive back a success status and token if user is loggedin, currentPassword and newPasswordConfirm are correct', async () => {
    // Create a new user
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };
    await chai.request(app).post('/api/v1/users/signup').send(user);
    // Login new user
    const resLogin = await chai.request(app).post('/api/v1/users/login').send(user);
    // Send updatepassword with token on headers and body with current and new password
    const updatePasswordBody = {
      currentPassword: 'password123',
      newPassword: 'newPassword123',
      newPasswordConfirm: 'newPassword123',
    };
    const resUpdatePassword = await chai
      .request(app)
      .patch('/api/v1/users/updatePassword')
      .set('Authorization', `Bearer ${resLogin.body.token}`)
      .send(updatePasswordBody);

    // Verify that user received token back after login
    expect(resUpdatePassword).to.have.status(200);
    expect(resUpdatePassword.body).to.have.property('status').that.equals('success');
    expect(resUpdatePassword.body).to.have.property('token').that.is.a('string');
    expect(resUpdatePassword.body).to.have.property('data');
    expect(resUpdatePassword.body.data).to.include({
      email: user.email,
    });
  });

  it('if passwords do not match, should receive back a fail status and 400 error code', async () => {
    // Create a new user
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };
    await chai.request(app).post('/api/v1/users/signup').send(user);
    // Login new user
    const resLogin = await chai.request(app).post('/api/v1/users/login').send(user);
    // Send updatepassword with token on headers and body with current and new password
    const updatePasswordBody = {
      currentPassword: 'password123',
      newPassword: 'newPassword123',
      newPasswordConfirm: 'newPassword456',
    };
    const resUpdatePassword = await chai
      .request(app)
      .patch('/api/v1/users/updatePassword')
      .set('Authorization', `Bearer ${resLogin.body.token}`)
      .send(updatePasswordBody);

    // Verify that user received token back after login
    expect(resUpdatePassword).to.have.status(400);
    expect(resUpdatePassword.body).to.have.property('status').that.equals('fail');
    expect(resUpdatePassword.body).to.have.property('message');
  });

  it('if current password is incorrect, should receive back a fail status and 400 error code', async () => {
    // Create a new user
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };
    await chai.request(app).post('/api/v1/users/signup').send(user);
    // Login new user
    const resLogin = await chai.request(app).post('/api/v1/users/login').send(user);
    // Send updatepassword with token on headers and body with current and new password
    const updatePasswordBody = {
      currentPassword: 'incorrect-password',
      newPassword: 'newPassword123',
      newPasswordConfirm: 'newPassword123',
    };
    const resUpdatePassword = await chai
      .request(app)
      .patch('/api/v1/users/updatePassword')
      .set('Authorization', `Bearer ${resLogin.body.token}`)
      .send(updatePasswordBody);

    // Verify that user received token back after login
    expect(resUpdatePassword).to.have.status(400);
    expect(resUpdatePassword.body).to.have.property('status').that.equals('fail');
    expect(resUpdatePassword.body).to.have.property('message');
  });

  it('if current password is not provided, should receive back a fail status and 400 error code', async () => {
    // Create a new user
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };
    await chai.request(app).post('/api/v1/users/signup').send(user);
    // Login new user
    const resLogin = await chai.request(app).post('/api/v1/users/login').send(user);
    // Send updatepassword with token on headers and body with current and new password
    const updatePasswordBody = {
      newPassword: 'newPassword123',
      newPasswordConfirm: 'newPassword123',
    };
    const resUpdatePassword = await chai
      .request(app)
      .patch('/api/v1/users/updatePassword')
      .set('Authorization', `Bearer ${resLogin.body.token}`)
      .send(updatePasswordBody);

    // Verify that user received token back after login
    expect(resUpdatePassword).to.have.status(400);
    expect(resUpdatePassword.body).to.have.property('status').that.equals('fail');
    expect(resUpdatePassword.body).to.have.property('message');
  });

  it('if password Confirm is not provided, should receive back a fail status and 400 error code', async () => {
    // Create a new user
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };
    await chai.request(app).post('/api/v1/users/signup').send(user);
    // Login new user
    const resLogin = await chai.request(app).post('/api/v1/users/login').send(user);
    // Send updatepassword with token on headers and body with current and new password
    const updatePasswordBody = {
      currentPassword: 'password123',
      newPassword: 'newPassword123',
    };
    const resUpdatePassword = await chai
      .request(app)
      .patch('/api/v1/users/updatePassword')
      .set('Authorization', `Bearer ${resLogin.body.token}`)
      .send(updatePasswordBody);

    // Verify that user received token back after login
    expect(resUpdatePassword).to.have.status(400);
    expect(resUpdatePassword.body).to.have.property('status').that.equals('fail');
    expect(resUpdatePassword.body).to.have.property('message');
  });

  it('if user has been deleted, should receive back a fail status and 401 error code, because authentication cannot be completed', async () => {
    // Create a new user
    const user = {
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };
    await chai.request(app).post('/api/v1/users/signup').send(user);
    // Login new user
    const resLogin = await chai.request(app).post('/api/v1/users/login').send(user);
    // Send updatepassword with token on headers and body with current and new password
    const updatePasswordBody = {
      currentPassword: 'password123',
      newPassword: 'newPassword123',
    };
    await User.deleteMany({});
    const resUpdatePassword = await chai
      .request(app)
      .patch('/api/v1/users/updatePassword')
      .set('Authorization', `Bearer ${resLogin.body.token}`)
      .send(updatePasswordBody);

    // Verify that user received token back after login
    expect(resUpdatePassword).to.have.status(401);
    expect(resUpdatePassword.body).to.have.property('status').that.equals('fail');
    expect(resUpdatePassword.body).to.have.property('message');
  });
});
