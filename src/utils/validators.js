/**
 * Custom validation helper functions
 */

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * At least 6 characters, contains letter and number
 */
const isValidPassword = (password) => {
  if (!password || password.length < 6) {
    return false;
  }
  // At least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
};

/**
 * Validate username format
 * 3-50 characters, alphanumeric only
 */
const isValidUsername = (username) => {
  if (!username || username.length < 3 || username.length > 50) {
    return false;
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(username);
};

/**
 * Sanitize input to prevent XSS
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate URL format
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validate UUID format
 */
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Validate pagination parameters
 */
const validatePagination = (page, limit) => {
  const validPage = parseInt(page) || 1;
  const validLimit = parseInt(limit) || 20;

  return {
    page: validPage > 0 ? validPage : 1,
    limit: validLimit > 0 && validLimit <= 100 ? validLimit : 20,
    offset: (validPage - 1) * validLimit
  };
};

/**
 * Validate array of tags
 */
const validateTags = (tags) => {
  if (!Array.isArray(tags)) return false;
  if (tags.length === 0 || tags.length > 5) return false;

  return tags.every(tag =>
    typeof tag === 'string' &&
    tag.length > 0 &&
    tag.length <= 50
  );
};

/**
 * Sanitize and validate post status
 */
const validatePostStatus = (status) => {
  const validStatuses = ['draft', 'published'];
  return validStatuses.includes(status) ? status : 'draft';
};

/**
 * Remove undefined/null values from object
 */
const removeEmptyFields = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );
};

/**
 * Validate sort parameter
 */
const validateSort = (sort, allowedFields = []) => {
  if (!sort) return null;

  const [field, order] = sort.split(':');

  if (!allowedFields.includes(field)) return null;
  if (!['asc', 'desc'].includes(order)) return null;

  return { field, order };
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  sanitizeInput,
  isValidUrl,
  isValidUUID,
  validatePagination,
  validateTags,
  validatePostStatus,
  removeEmptyFields,
  validateSort
};
