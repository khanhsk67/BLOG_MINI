const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

// Import all models
const User = require('./User')(sequelize);
const Post = require('./Post')(sequelize);
const Comment = require('./Comment')(sequelize);
const Reaction = require('./Reaction')(sequelize);
const Tag = require('./Tag')(sequelize);
const PostTag = require('./PostTag')(sequelize);
const Follow = require('./Follow')(sequelize);
const Notification = require('./Notification')(sequelize);
const SavedPost = require('./SavedPost')(sequelize);

// 1. USER <-> POST (One-to-Many)
User.hasMany(Post, {
    foreignKey: 'author_id',
    as: 'posts',
    onDelete: 'CASCADE'
});
Post.belongsTo(User, {
    foreignKey: 'author_id',
    as: 'author'
});

// 2. POST <-> COMMENT (One-to-Many)
Post.hasMany(Comment, {
    foreignKey: 'post_id',
    as: 'comments',
    onDelete: 'CASCADE'
});
Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    as: 'post'
});

// 3. USER <-> COMMENT (One-to-Many)
User.hasMany(Comment, {
    foreignKey: 'user_id',
    as: 'comments',
    onDelete: 'CASCADE'
});
Comment.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// 4. COMMENT SELF-REFERENCING (Nested comments)
Comment.hasMany(Comment, {
    foreignKey: 'parent_comment_id',
    as: 'replies',
    onDelete: 'CASCADE'
});
Comment.belongsTo(Comment, {
    foreignKey: 'parent_comment_id',
    as: 'parent'
});

// 5. POST <-> REACTION (One-to-Many)
Post.hasMany(Reaction, {
    foreignKey: 'post_id',
    as: 'reactions',
    onDelete: 'CASCADE'
});
Reaction.belongsTo(Post, {
    foreignKey: 'post_id',
    as: 'post'
});

// 6. USER <-> REACTION (One-to-Many)
User.hasMany(Reaction, {
    foreignKey: 'user_id',
    as: 'reactions',
    onDelete: 'CASCADE'
});
Reaction.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// 7. POST <-> TAG (Many-to-Many through PostTag)
Post.belongsToMany(Tag, {
    through: PostTag,
    foreignKey: 'post_id',
    otherKey: 'tag_id',
    as: 'tags',
    onDelete: 'CASCADE'
});
Tag.belongsToMany(Post, {
    through: PostTag,
    foreignKey: 'tag_id',
    otherKey: 'post_id',
    as: 'posts',
    onDelete: 'CASCADE'
});

// 8. POST <-> POSTTAG (One-to-Many) - Direct access if needed
Post.hasMany(PostTag, {
    foreignKey: 'post_id',
    as: 'post_tags',
    onDelete: 'CASCADE'
});
PostTag.belongsTo(Post, {
    foreignKey: 'post_id'
});

// 9. TAG <-> POSTTAG (One-to-Many) - Direct access if needed
Tag.hasMany(PostTag, {
    foreignKey: 'tag_id',
    as: 'post_tags',
    onDelete: 'CASCADE'
});
PostTag.belongsTo(Tag, {
    foreignKey: 'tag_id'
});

// 10. USER <-> USER FOLLOW (Self-referencing Many-to-Many)
// Followers: Users who follow me
User.belongsToMany(User, {
    through: Follow,
    as: 'followers',
    foreignKey: 'following_id',
    otherKey: 'follower_id'
});

// Following: Users I follow
User.belongsToMany(User, {
    through: Follow,
    as: 'following',
    foreignKey: 'follower_id',
    otherKey: 'following_id'
});

// Direct access to Follow model
User.hasMany(Follow, {
    foreignKey: 'follower_id',
    as: 'following_relations',
    onDelete: 'CASCADE'
});
User.hasMany(Follow, {
    foreignKey: 'following_id',
    as: 'follower_relations',
    onDelete: 'CASCADE'
});

Follow.belongsTo(User, {
    foreignKey: 'follower_id',
    as: 'follower'
});
Follow.belongsTo(User, {
    foreignKey: 'following_id',
    as: 'following'
});

// 11. USER <-> NOTIFICATION (One-to-Many)
User.hasMany(Notification, {
    foreignKey: 'user_id',
    as: 'notifications',
    onDelete: 'CASCADE'
});
Notification.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// Related user in notification (who triggered the notification)
Notification.belongsTo(User, {
    foreignKey: 'related_user_id',
    as: 'related_user'
});

// Related post in notification
Notification.belongsTo(Post, {
    foreignKey: 'related_post_id',
    as: 'related_post'
});

// 12. USER <-> SAVEDPOST (One-to-Many)
User.hasMany(SavedPost, {
    foreignKey: 'user_id',
    as: 'saved_posts',
    onDelete: 'CASCADE'
});
SavedPost.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// 13. POST <-> SAVEDPOST (One-to-Many)
Post.hasMany(SavedPost, {
    foreignKey: 'post_id',
    as: 'saved_by',
    onDelete: 'CASCADE'
});
SavedPost.belongsTo(Post, {
    foreignKey: 'post_id',
    as: 'post'
});


/**
 * Sync database - Create/Update tables
 * @param {boolean} force - Drop tables if exist (CAUTION: deletes all data)
 */
const syncDatabase = async (force = false) => {
    try {
        if (force) {
            console.log('⚠️  WARNING: Force sync will drop all tables!');
        }

        await sequelize.sync({ force, alter: !force });

        console.log('✅ Database synced successfully.');

        if (!force) {
            console.log('💡 Tables altered to match models (safe mode).');
        }
    } catch (error) {
        console.error('❌ Error syncing database:', error);
        throw error;
    }
};



module.exports = {
    sequelize,
    Sequelize,

    User,
    Post,
    Comment,
    Reaction,
    Tag,
    PostTag,
    Follow,
    Notification,
    SavedPost,

    // Utility
    syncDatabase
};