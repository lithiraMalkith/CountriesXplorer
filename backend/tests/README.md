# Authentication Tests

This directory contains unit tests for the authentication functionality in the backend.

## Test Files

- `auth.test.js` - Tests for the login endpoint (`POST /api/auth/login`)
- `authUser.test.js` - Tests for the user data endpoint (`GET /api/auth/user`)

## What's Being Tested

### Login Endpoint Tests (`auth.test.js`)

1. Returns 400 if user does not exist
2. Returns 400 if password does not match
3. Returns token and user data if credentials are valid
4. Returns 500 if server error occurs
5. Returns 500 if JWT signing fails

### User Data Endpoint Tests (`authUser.test.js`)

1. Returns user data if authenticated
2. Returns 500 if server error occurs

## How to Run Tests

1. Install the required dependencies:
   ```
   npm install
   ```

2. Run the tests:
   ```
   npm test
   ```

## Testing Approach

These tests use:
- **Jest** as the testing framework
- **Supertest** for HTTP assertions
- **MongoDB Memory Server** for in-memory database testing
- **Mocks** for external dependencies like JWT and bcrypt

The tests are isolated from your actual database by using an in-memory MongoDB instance.
