const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    author_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty'
        },
        len: {
          args: [1, 200],
          msg: 'Title must be between 1 and 200 characters'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Content cannot be empty'
        },
        len: {
          args: [1, 50000],
          msg: 'Content must be between 1 and 50000 characters'
        }
      }
    },
    excerpt: {
      type: DataTypes.STRING(300),
      allowNull: true,
      validate: {
        len: {
          args: [0, 300],
          msg: 'Excerpt cannot exceed 300 characters'
        }
      }
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Slug cannot be empty'
        },
        is: {
          args: /^[a-z0-9-]+$/,
          msg: 'Slug can only contain lowercase letters, numbers, and hyphens'
        }
      }
    },
    featured_image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Featured image URL must be a valid URL'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      defaultValue: 'draft',
      allowNull: false,
      validate: {
        isIn: {
          args: [['draft', 'published']],
          msg: 'Status must be either draft or published'
        }
      }
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'View count cannot be negative'
        }
      }
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Admin can mark posts as featured for homepage'
    },
    published_at: {
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
    tableName: 'posts',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['slug']
      },
      {
        fields: ['author_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['published_at']
      },
      {
        fields: ['view_count']
      },
      {
        fields: ['is_featured']
      },
      {
        fields: ['created_at']
      }
    ],
    hooks: {
      beforeCreate: async (post) => {
        // Auto-generate excerpt if not provided
        if (!post.excerpt && post.content) {
          post.excerpt = post.content.substring(0, 297) + '...';
        }
        // Set published_at when status is published
        if (post.status === 'published' && !post.published_at) {
          post.published_at = new Date();
        }
      },
      beforeUpdate: async (post) => {
        // Update excerpt if content changed and excerpt is empty
        if (post.changed('content') && !post.excerpt && post.content) {
          post.excerpt = post.content.substring(0, 297) + '...';
        }
        // Set published_at when status changes to published
        if (post.changed('status') && post.status === 'published' && !post.published_at) {
          post.published_at = new Date();
        }
        // Clear published_at when status changes to draft
        if (post.changed('status') && post.status === 'draft') {
          post.published_at = null;
        }
      }
    }
  });

  // Instance methods
  Post.prototype.incrementViewCount = async function () {
    this.view_count += 1;
    await this.save({ fields: ['view_count'] });
    return this;
  };

  Post.prototype.isPublished = function () {
    return this.status === 'published';
  };

  Post.prototype.isDraft = function () {
    return this.status === 'draft';
  };

  Post.prototype.canBeViewedBy = function (user) {
    // Published posts can be viewed by anyone
    if (this.isPublished()) return true;

    // Drafts can only be viewed by author or admin
    if (!user) return false;
    if (this.author_id === user.id) return true;
    if (user.role === 'admin') return true;

    return false;
  };

  Post.prototype.canBeEditedBy = function (user) {
    if (!user) return false;
    // Only author can edit their posts (admin can delete but not edit)
    return this.author_id === user.id;
  };

  Post.prototype.canBeDeletedBy = function (user) {
    if (!user) return false;
    // Author or admin can delete
    return this.author_id === user.id || user.role === 'admin';
  };

  // Class methods
  Post.associate = function (models) {
    // Post belongs to User (author)
    Post.belongsTo(models.User, {
      foreignKey: 'author_id',
      as: 'author',
      onDelete: 'CASCADE'
    });

    // Post has many Comments
    Post.hasMany(models.Comment, {
      foreignKey: 'post_id',
      as: 'comments',
      onDelete: 'CASCADE'
    });

    // Post has many Reactions (likes)
    Post.hasMany(models.Reaction, {
      foreignKey: 'post_id',
      as: 'reactions',
      onDelete: 'CASCADE'
    });

    // Post has many SavedPosts
    Post.hasMany(models.SavedPost, {
      foreignKey: 'post_id',
      as: 'saved_posts',
      onDelete: 'CASCADE'
    });

    // Post belongs to many Tags
    Post.belongsToMany(models.Tag, {
      through: models.PostTag,
      foreignKey: 'post_id',
      otherKey: 'tag_id',
      as: 'tags',
      onDelete: 'CASCADE'
    });
  };

  return Post;
};
