const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Notification = sequelize.define('Notification', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        type: {
            type: DataTypes.ENUM('like', 'comment', 'follow', 'reply', 'mention'),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        related_user_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        related_post_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'posts',
                key: 'id'
            }
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'notifications',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['user_id', 'is_read'] },
            { fields: ['created_at'] }
        ]
    });

    return Notification;
};