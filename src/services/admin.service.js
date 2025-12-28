const { User, Post, Comment, Reaction, Follow, Notification } = require('../models');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const { Op } = require('sequelize');

class AdminService {
  /**
   * Get all users with pagination and filters
   */
  async getAllUsers(options = {}) {
    const {
      page = 1,
      limit = 20,
      search = '',
      role = null,
      isActive = null,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    if (search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { display_name: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== null) {
      where.is_active = isActive;
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [[sortBy, sortOrder]],
      limit,
      offset
    });

    return {
      users,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Get user detail by ID (for admin)
   */
  async getUserDetail(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    // Get user statistics
    const [postsCount, commentsCount, likesCount, followersCount, followingCount] = await Promise.all([
      Post.count({ where: { author_id: userId } }),
      Comment.count({ where: { user_id: userId } }),
      Reaction.count({ where: { user_id: userId } }),
      Follow.count({ where: { following_id: userId } }),
      Follow.count({ where: { follower_id: userId } })
    ]);

    return {
      ...user.toJSON(),
      stats: {
        posts_count: postsCount,
        comments_count: commentsCount,
        likes_count: likesCount,
        followers_count: followersCount,
        following_count: followingCount
      }
    };
  }

  /**
   * Ban/Deactivate a user
   */
  async banUser(userId, reason = null) {
    if (!userId) {
      throw new NotFoundError('User');
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw new NotFoundError('User');
    }

    // Cannot ban admin
    if (user.role === 'admin') {
      throw new ForbiddenError('Cannot ban admin users');
    }

    if (!user.is_active) {
      throw new ForbiddenError('User is already banned');
    }

    await user.update({ is_active: false });

    return {
      message: 'User banned successfully',
      user: user.toJSON(),
      reason
    };
  }

  /**
   * Unban/Activate a user
   */
  async unbanUser(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new NotFoundError('User');
    }

    if (user.is_active) {
      throw new ForbiddenError('User is already active');
    }

    await user.update({ is_active: true });

    return {
      message: 'User unbanned successfully',
      user: user.toJSON()
    };
  }

  /**
   * Delete a user (permanent)
   */
  async deleteUser(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new NotFoundError('User');
    }

    // Cannot delete admin
    if (user.role === 'admin') {
      throw new ForbiddenError('Cannot delete admin users');
    }

    // Delete user (cascade will handle related data)
    await user.destroy();

    return {
      message: 'User deleted successfully',
      deletedUser: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
  }

  /**
   * Get all posts (for admin management)
   */
  async getAllPosts(options = {}) {
    const {
      page = 1,
      limit = 20,
      status = null,
      search = '',
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: posts } = await Post.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'display_name', 'email']
        }
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset
    });

    return {
      posts,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Delete a post (admin)
   */
  async deletePost(postId) {
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    if (!post) {
      throw new NotFoundError('Post');
    }

    await post.destroy();

    return {
      message: 'Post deleted successfully',
      deletedPost: {
        id: post.id,
        title: post.title,
        author: post.author
      }
    };
  }

  /**
   * Set/Unset featured post
   */
  async setFeaturedPost(postId, isFeatured = true) {
    const post = await Post.findByPk(postId);

    if (!post) {
      throw new NotFoundError('Post');
    }

    // Only published posts can be featured
    if (post.status !== 'published') {
      throw new ForbiddenError('Only published posts can be featured');
    }

    await post.update({ is_featured: isFeatured });

    return {
      message: isFeatured ? 'Post marked as featured' : 'Post unmarked as featured',
      post
    };
  }

  /**
   * Get system statistics
   */
  async getSystemStats() {
    const [
      totalUsers,
      activeUsers,
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments,
      totalLikes,
      totalFollows
    ] = await Promise.all([
      User.count(),
      User.count({ where: { is_active: true } }),
      Post.count(),
      Post.count({ where: { status: 'published' } }),
      Post.count({ where: { status: 'draft' } }),
      Comment.count(),
      Reaction.count(),
      Follow.count()
    ]);

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newUsersLastWeek = await User.count({
      where: {
        created_at: { [Op.gte]: sevenDaysAgo }
      }
    });

    const newPostsLastWeek = await Post.count({
      where: {
        created_at: { [Op.gte]: sevenDaysAgo }
      }
    });

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        banned: totalUsers - activeUsers,
        new_last_week: newUsersLastWeek
      },
      posts: {
        total: totalPosts,
        published: publishedPosts,
        draft: draftPosts,
        new_last_week: newPostsLastWeek
      },
      engagement: {
        total_comments: totalComments,
        total_likes: totalLikes,
        total_follows: totalFollows
      }
    };
  }

  /**
   * Get featured posts
   */
  async getFeaturedPosts() {
    const posts = await Post.findAll({
      where: {
        is_featured: true,
        status: 'published'
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'display_name', 'avatar_url']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    return { posts };
  }

  /**
   * Search users, posts, comments
   */
  async globalSearch(query, options = {}) {
    const { limit = 10 } = options;

    const [users, posts, comments] = await Promise.all([
      User.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.iLike]: `%${query}%` } },
            { display_name: { [Op.iLike]: `%${query}%` } },
            { email: { [Op.iLike]: `%${query}%` } }
          ]
        },
        attributes: { exclude: ['password'] },
        limit
      }),
      Post.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `%${query}%` } },
            { content: { [Op.iLike]: `%${query}%` } }
          ]
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'display_name']
          }
        ],
        limit
      }),
      Comment.findAll({
        where: {
          content: { [Op.iLike]: `%${query}%` }
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'display_name']
          }
        ],
        limit
      })
    ]);

    return {
      users,
      posts,
      comments
    };
  }
}

module.exports = new AdminService();
