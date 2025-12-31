const { Post, User, Comment } = require('../models');
const { Op } = require('sequelize');

class SearchService {
  /**
   * Search posts by content (title, content, tags)
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Search results with pagination
   */
  async searchPosts(query, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${query}%`
            }
          },
          {
            content: {
              [Op.iLike]: `%${query}%`
            }
          }
        ],
        status: 'published' // Only search published posts
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email', 'display_name', 'avatar_url']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true
    });

    return {
      posts: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Search users by username, email, or name
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Search results with pagination
   */
  async searchUsers(query, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: {
        [Op.or]: [
          {
            username: {
              [Op.iLike]: `%${query}%`
            }
          },
          {
            email: {
              [Op.iLike]: `%${query}%`
            }
          },
          {
            display_name: {
              [Op.iLike]: `%${query}%`
            }
          }
        ]
      },
      attributes: ['id', 'username', 'email', 'display_name', 'avatar_url', 'bio', 'created_at'],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      users: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Global search (posts + users)
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Combined search results
   */
  async globalSearch(query, page = 1, limit = 10) {
    const [postsResult, usersResult] = await Promise.all([
      this.searchPosts(query, page, Math.ceil(limit / 2)),
      this.searchUsers(query, page, Math.ceil(limit / 2))
    ]);

    return {
      posts: postsResult.posts,
      users: usersResult.users,
      pagination: {
        posts: postsResult.pagination,
        users: usersResult.pagination
      }
    };
  }

  /**
   * Get search suggestions (autocomplete)
   * @param {string} query - Search query
   * @param {number} limit - Max suggestions
   * @returns {Object} Suggestions
   */
  async getSearchSuggestions(query, limit = 5) {
    const [posts, users] = await Promise.all([
      Post.findAll({
        where: {
          title: {
            [Op.iLike]: `%${query}%`
          },
          status: 'published'
        },
        attributes: ['id', 'title'],
        limit,
        order: [['created_at', 'DESC']]
      }),
      User.findAll({
        where: {
          [Op.or]: [
            {
              username: {
                [Op.iLike]: `%${query}%`
              }
            },
            {
              display_name: {
                [Op.iLike]: `%${query}%`
              }
            }
          ]
        },
        attributes: ['id', 'username', 'display_name', 'avatar_url'],
        limit
      })
    ]);

    return {
      posts: posts.map(p => ({ id: p.id, title: p.title, type: 'post' })),
      users: users.map(u => ({ id: u.id, username: u.username, name: u.display_name, avatar: u.avatar_url, type: 'user' }))
    };
  }
}

module.exports = new SearchService();
