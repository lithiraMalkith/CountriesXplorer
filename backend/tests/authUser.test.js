const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');

// Mock models and middleware
const User = require('../models/User');
const auth = require('../middleware/auth');

// Mock the auth middleware
jest.mock('../middleware/auth', () => jest.fn((req, res, next) => next()));

// Create a minimal express app for testing
const app = express();
app.use(express.json());

// Import the routes
const authRoutes = require('../routes/auth');
app.use('/api/auth', authRoutes);

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

describe('GET /api/auth/user', () => {
  test('should return user data if authenticated', async () => {
    // Mock the user ID in the request
    auth.mockImplementation((req, res, next) => {
      req.user = { id: 'user123' };
      next();
    });

    // Mock User.findById to return a user without password
    const mockUser = {
      _id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user'
    };
    User.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    const response = await request(app).get('/api/auth/user');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(User.findById).toHaveBeenCalledWith('user123');
  });

  test('should return 500 if server error occurs', async () => {
    // Mock the user ID in the request
    auth.mockImplementation((req, res, next) => {
      req.user = { id: 'user123' };
      next();
    });

    // Mock User.findById to throw an error
    User.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error('Database error'))
    });

    const response = await request(app).get('/api/auth/user');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ msg: 'Server error' });
  });
});
