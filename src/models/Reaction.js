const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reaction = sequelize.define('Reaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
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
    tableName: 'reactions',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'post_id'],
        name: 'unique_user_post_reaction'
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['post_id']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  // Class methods
  Reaction.associate = function (models) {
    // Reaction belongs to User
    Reaction.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE'
    });

    // Reaction belongs to Post
    Reaction.belongsTo(models.Post, {
      foreignKey: 'post_id',
      as: 'post',
      onDelete: 'CASCADE'
    });
  };

  return Reaction;
};
