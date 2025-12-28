/**
 * Custom Error Classes for the application
 */

class ApiError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApiError {
  constructor(message = 'Validation failed', errors = []) {
    super(message, 400);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

class AuthenticationError extends ApiError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

class NotFoundError extends ApiError {
  constructor(resource = 'Resource', message = null) {
    super(message || `${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends ApiError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Bad request') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

class TooManyRequestsError extends ApiError {
  constructor(message = 'Too many requests, please try again later') {
    super(message, 429);
    this.name = 'TooManyRequestsError';
  }
}

class InternalServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}

module.exports = {
  ApiError,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  BadRequestError,
  UnauthorizedError,
  TooManyRequestsError,
  InternalServerError
};
