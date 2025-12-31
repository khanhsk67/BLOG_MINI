const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      comment: 'User who sent the message'
    },
    recipient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      comment: 'User who receives the message'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Message content cannot be empty'
        },
        len: {
          args: [1, 5000],
          msg: 'Message must be between 1 and 5000 characters'
        }
      }
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    read_at: {
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
    tableName: 'messages',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['sender_id']
      },
      {
        fields: ['recipient_id']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['is_read']
      },
      {
        fields: ['sender_id', 'recipient_id']
      }
    ],
    validate: {
      cannotMessageSelf() {
        if (this.sender_id === this.recipient_id) {
          throw new Error('Users cannot send messages to themselves');
        }
      }
    }
  });

  // Class methods
  Message.associate = function (models) {
    // Message belongs to User (sender)
    Message.belongsTo(models.User, {
      foreignKey: 'sender_id',
      as: 'sender',
      onDelete: 'CASCADE'
    });

    // Message belongs to User (recipient)
    Message.belongsTo(models.User, {
      foreignKey: 'recipient_id',
      as: 'recipient',
      onDelete: 'CASCADE'
    });
  };

  return Message;
};
