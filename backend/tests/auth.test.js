const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');

// Mock models
const User = require('../models/User');

// Create a minimal express app for testing
const app = express();
app.use(express.json());

// Import the routes
const authRoutes = require('../routes/auth');
app.use('/api/auth', authRoutes);

// Mock JWT and bcrypt
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

// Mock environment variables
process.env.JWT_SECRET = 'test_secret';

let mongoServer;

// Setup and teardown
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(async () => {
  // Clean up the database after each test
  await User.deleteMany({});
});

describe('POST /api/auth/login', () => {
  test('should return 400 if user does not exist', async () => {
    // Mock User.findOne to return null (user not found)
    User.findOne = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ msg: 'Invalid credentials' });
    expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
  });

  test('should return 400 if password does not match', async () => {
    // Mock User.findOne to return a user
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'user'
    };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    
    // Mock bcrypt.compare to return false (password doesn't match)
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongPassword' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ msg: 'Invalid credentials' });
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
  });

  test('should return token and user data if credentials are valid', async () => {
    // Mock User.findOne to return a user
    const mockUser = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'user'
    };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    
    // Mock bcrypt.compare to return true (password matches)
    bcrypt.compare.mockResolvedValue(true);
    
    // Mock jwt.sign to call the callback with a token
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, 'test_token');
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'correctPassword' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: 'test_token',
      user: {
        id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }
    });
    
    // Verify JWT was called with correct parameters
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        user: {
          id: 'user123',
          role: 'user'
        }
      },
      'test_secret',
      { expiresIn: '24h' },
      expect.any(Function)
    );
  });

  test('should return 500 if server error occurs', async () => {
    // Mock User.findOne to throw an error
    User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ msg: 'Server error' });
  });

  test('should return 500 if JWT signing fails', async () => {
    // Mock User.findOne to return a user
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'user'
    };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    
    // Mock bcrypt.compare to return true
    bcrypt.compare.mockResolvedValue(true);
    
    // Mock jwt.sign to call the callback with an error
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(new Error('JWT error'), null);
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'correctPassword' });

    expect(response.status).toBe(500);
  });
});
