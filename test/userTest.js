/* eslint-disable no-console */
const mongoose = require('mongoose');
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');

chai.use(chaiAsPromised);
chai.use(chaiHttp);
const { expect } = chai;
const sinon = require('sinon');
const { before, after, describe, it, beforeEach } = require('mocha');
const dotenv = require('dotenv');

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
});
