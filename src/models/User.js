const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address'
        },
        notEmpty: {
          msg: 'Email cannot be empty'
        }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty'
        },
        len: {
          args: [6, 255],
          msg: 'Password must be at least 6 characters'
        }
      }
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Username cannot be empty'
        },
        len: {
          args: [3, 50],
          msg: 'Username must be between 3 and 50 characters'
        },
        isAlphanumeric: {
          msg: 'Username can only contain letters and numbers'
        }
      }
    },
    display_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: {
          args: [1, 100],
          msg: 'Display name must be between 1 and 100 characters'
        }
      }
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Avatar URL must be a valid URL'
        }
      }
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Bio cannot exceed 500 characters'
        }
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false,
      validate: {
        isIn: {
          args: [['user', 'admin']],
          msg: 'Role must be either user or admin'
        }
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    email_verification_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email_verification_expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    password_reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password_reset_expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        unique: true,
        fields: ['username']
      },
      {
        fields: ['role']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['created_at']
      }
    ],
    // Instance methods
    hooks: {
      beforeCreate: async (user) => {
        // Email to lowercase
        if (user.email) {
          user.email = user.email.toLowerCase();
        }
        // Username to lowercase
        if (user.username) {
          user.username = user.username.toLowerCase();
        }
      },
      beforeUpdate: async (user) => {
        // Email to lowercase
        if (user.changed('email')) {
          user.email = user.email.toLowerCase();
        }
        // Username to lowercase
        if (user.changed('username')) {
          user.username = user.username.toLowerCase();
        }
      }
    }
  });

  // Instance methods
  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    // Never expose password in JSON responses
    delete values.password;
    delete values.password_reset_token;
    delete values.password_reset_expires;
    delete values.email_verification_token;
    delete values.email_verification_expires;
    return values;
  };

  User.prototype.isAdmin = function () {
    return this.role === 'admin';
  };

  User.prototype.canAccessPost = function (post) {
    // User can access their own drafts or any published post
    if (post.status === 'published') return true;
    if (post.author_id === this.id) return true;
    if (this.isAdmin()) return true;
    return false;
  };

  // Class methods
  User.associate = function (models) {
    // User has many Posts
    User.hasMany(models.Post, {
      foreignKey: 'author_id',
      as: 'posts',
      onDelete: 'CASCADE'
    });

    // User has many Comments
    User.hasMany(models.Comment, {
      foreignKey: 'user_id',
      as: 'comments',
      onDelete: 'CASCADE'
    });

    // User has many Reactions
    User.hasMany(models.Reaction, {
      foreignKey: 'user_id',
      as: 'reactions',
      onDelete: 'CASCADE'
    });

    // User has many SavedPosts
    User.hasMany(models.SavedPost, {
      foreignKey: 'user_id',
      as: 'saved_posts',
      onDelete: 'CASCADE'
    });

    // User has many Notifications
    User.hasMany(models.Notification, {
      foreignKey: 'user_id',
      as: 'notifications',
      onDelete: 'CASCADE'
    });

    // User has many followers (users following this user)
    User.belongsToMany(models.User, {
      through: models.Follow,
      as: 'followers',
      foreignKey: 'following_id',
      otherKey: 'follower_id',
      onDelete: 'CASCADE'
    });

    // User follows many users (users this user is following)
    User.belongsToMany(models.User, {
      through: models.Follow,
      as: 'following',
      foreignKey: 'follower_id',
      otherKey: 'following_id',
      onDelete: 'CASCADE'
    });
  };

  return User;
};
