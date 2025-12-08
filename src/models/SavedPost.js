const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SavedPost = sequelize.define('SavedPost', {
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
        post_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'posts',
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
    }, {
        tableName: 'saved_posts',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'post_id']
            }
        ]
    });

    return SavedPost;
};