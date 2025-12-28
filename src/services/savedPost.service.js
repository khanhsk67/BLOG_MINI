const { SavedPost, Post, User } = require('../models');
const { NotFoundError, ConflictError } = require('../utils/errors');

class SavedPostService {
  /**
   * Save a post
   */
  async savePost(userId, postId) {
    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new NotFoundError('Post');
    }

    // Only published posts can be saved
    if (post.status !== 'published') {
      throw new NotFoundError('Post');
    }

    // Check if already saved
    const existingSave = await SavedPost.findOne({
      where: { user_id: userId, post_id: postId }
    });

    if (existingSave) {
      throw new ConflictError('You have already saved this post');
    }

    // Create saved post
    await SavedPost.create({
      user_id: userId,
      post_id: postId
    });

    return {
      message: 'Post saved successfully'
    };
  }

  /**
   * Unsave a post
   */
  async unsavePost(userId, postId) {
    // Find and delete saved post
    const savedPost = await SavedPost.findOne({
      where: { user_id: userId, post_id: postId }
    });

    if (!savedPost) {
      throw new NotFoundError('Saved post', 'You have not saved this post');
    }

    await savedPost.destroy();

    return {
      message: 'Post unsaved successfully'
    };
  }

  /**
   * Check if user saved a post
   */
  async checkPostSaved(userId, postId) {
    const savedPost = await SavedPost.findOne({
      where: { user_id: userId, post_id: postId }
    });

    return savedPost !== null;
  }

  /**
   * Get user's saved posts
   */
  async getUserSavedPosts(userId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    const { count, rows: savedPosts } = await SavedPost.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: Post,
          as: 'post',
          where: { status: 'published' },
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'display_name', 'avatar_url']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const posts = savedPosts.map(sp => sp.post);

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
   * Get saved post count for a user
   */
  async getSavedPostCount(userId) {
    return await SavedPost.count({ where: { user_id: userId } });
  }
}

module.exports = new SavedPostService();
