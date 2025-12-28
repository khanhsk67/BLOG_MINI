/**
 * Standardized API response helpers
 */

/**
 * Send success response
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    data
  };

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
const errorResponse = (res, error, statusCode = 500) => {
  const response = {
    success: false,
    message: error.message || 'An error occurred',
    error: {
      name: error.name,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  };

  // Include validation errors if present
  if (error.errors) {
    response.error.details = error.errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
const paginationResponse = (res, data, pagination, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      total: pagination.total || 0,
      totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 20)),
      hasNextPage: (pagination.page || 1) * (pagination.limit || 20) < (pagination.total || 0),
      hasPrevPage: (pagination.page || 1) > 1
    }
  };

  return res.status(statusCode).json(response);
};

/**
 * Send created response (201)
 */
const createdResponse = (res, data, message = 'Resource created successfully') => {
  return successResponse(res, data, message, 201);
};

/**
 * Send no content response (204)
 */
const noContentResponse = (res) => {
  return res.status(204).send();
};

/**
 * Send not found response (404)
 */
const notFoundResponse = (res, resource = 'Resource') => {
  const response = {
    success: false,
    message: `${resource} not found`
  };

  return res.status(404).json(response);
};

/**
 * Send unauthorized response (401)
 */
const unauthorizedResponse = (res, message = 'Unauthorized access') => {
  const response = {
    success: false,
    message
  };

  return res.status(401).json(response);
};

/**
 * Send forbidden response (403)
 */
const forbiddenResponse = (res, message = 'You do not have permission to perform this action') => {
  const response = {
    success: false,
    message
  };

  return res.status(403).json(response);
};

/**
 * Send bad request response (400)
 */
const badRequestResponse = (res, message = 'Bad request', errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(400).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
  paginationResponse,
  createdResponse,
  noContentResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse
};
