const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Follow = sequelize.define('Follow', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    follower_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      comment: 'User who is following'
    },
    following_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      comment: 'User who is being followed'
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
    tableName: 'follows',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['follower_id', 'following_id'],
        name: 'unique_follower_following'
      },
      {
        fields: ['follower_id']
      },
      {
        fields: ['following_id']
      },
      {
        fields: ['created_at']
      }
    ],
    validate: {
      cannotFollowSelf() {
        if (this.follower_id === this.following_id) {
          throw new Error('Users cannot follow themselves');
        }
      }
    }
  });

  // Class methods
  Follow.associate = function (models) {
    // Follow belongs to User (follower)
    Follow.belongsTo(models.User, {
      foreignKey: 'follower_id',
      as: 'follower',
      onDelete: 'CASCADE'
    });

    // Follow belongs to User (following)
    Follow.belongsTo(models.User, {
      foreignKey: 'following_id',
      as: 'following',
      onDelete: 'CASCADE'
    });
  };

  return Follow;
};
