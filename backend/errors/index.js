class CustomError extends Error {
  constructor(message, statusCode, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends CustomError {
  constructor(message = 'Bad Request', details = {}) {
    super(message, 400, details);
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class ValidationError extends CustomError {
  constructor(message = 'Validation Failed', errors = {}) {
    super(message, 422, { errors });
  }
}

module.exports = {
  CustomError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ValidationError,
};