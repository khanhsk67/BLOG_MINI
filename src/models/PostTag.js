const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PostTag = sequelize.define('PostTag', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        post_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'posts',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        tag_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'tags',
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
    }, {
        tableName: 'post_tags',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['post_id', 'tag_id']
            }
        ]
    });

    return PostTag;
};