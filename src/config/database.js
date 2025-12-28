const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'miniblog_dev',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'your_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,

    // Connection pool configuration
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    // Timezone
    timezone: '+07:00',

    // Query options
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    },

    // Retry configuration
    retry: {
      max: 3
    }
  }
);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    return false;
  }
};

// Sync database (use with caution in production)
const syncDatabase = async (options = {}) => {
  try {
    const { force = false, alter = false } = options;

    if (process.env.NODE_ENV === 'production' && force) {
      console.warn('⚠️  WARNING: force sync is disabled in production');
      return false;
    }

    await sequelize.sync({ force, alter });
    console.log('✅ Database synchronized successfully.');
    return true;
  } catch (error) {
    console.error('❌ Error synchronizing database:', error.message);
    return false;
  }
};

// Close connection
const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed.');
    return true;
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  closeConnection,
  Sequelize
};
