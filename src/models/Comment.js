const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    parent_comment_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      comment: 'For nested comments/replies'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Comment content cannot be empty'
        },
        len: {
          args: [1, 2000],
          msg: 'Comment must be between 1 and 2000 characters'
        }
      }
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
    tableName: 'comments',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['post_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['parent_comment_id']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  // Instance methods
  Comment.prototype.isReply = function () {
    return this.parent_comment_id !== null;
  };

  Comment.prototype.canBeEditedBy = function (user) {
    if (!user) return false;
    // Only the comment author can edit
    return this.user_id === user.id;
  };

  Comment.prototype.canBeDeletedBy = function (user) {
    if (!user) return false;
    // Author or admin can delete
    return this.user_id === user.id || user.role === 'admin';
  };

  // Class methods
  Comment.associate = function (models) {
    // Comment belongs to User
    Comment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE'
    });

    // Comment belongs to Post
    Comment.belongsTo(models.Post, {
      foreignKey: 'post_id',
      as: 'post',
      onDelete: 'CASCADE'
    });

    // Self-referencing for nested comments
    // Parent comment has many replies
    Comment.hasMany(models.Comment, {
      foreignKey: 'parent_comment_id',
      as: 'replies',
      onDelete: 'CASCADE'
    });

    // Reply belongs to parent comment
    Comment.belongsTo(models.Comment, {
      foreignKey: 'parent_comment_id',
      as: 'parent_comment',
      onDelete: 'CASCADE'
    });
  };

  return Comment;
};
