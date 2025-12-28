require('dotenv').config();

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-this',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    expiresIn: process.env.JWT_EXPIRE || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  },
  bcrypt: {
    saltRounds: 10
  },
  password: {
    minLength: 6,
    requireNumber: true,
    requireLetter: true
  },
  email: {
    verificationTokenExpires: 24 * 60 * 60 * 1000, // 24 hours
    resetPasswordTokenExpires: 1 * 60 * 60 * 1000  // 1 hour
  }
};
