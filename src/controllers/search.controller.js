const searchService = require('../services/search.service');
const { BadRequestError } = require('../utils/errors');

class SearchController {
  /**
   * Search posts
   * GET /api/search/posts?q=query&page=1&limit=10
   */
  async searchPosts(req, res, next) {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      if (!q || q.trim().length === 0) {
        throw new BadRequestError('Search query is required');
      }

      if (q.trim().length < 2) {
        throw new BadRequestError('Search query must be at least 2 characters');
      }

      const result = await searchService.searchPosts(
        q.trim(),
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search users
   * GET /api/search/users?q=query&page=1&limit=10
   */
  async searchUsers(req, res, next) {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      if (!q || q.trim().length === 0) {
        throw new BadRequestError('Search query is required');
      }

      if (q.trim().length < 2) {
        throw new BadRequestError('Search query must be at least 2 characters');
      }

      const result = await searchService.searchUsers(
        q.trim(),
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Global search (posts + users)
   * GET /api/search?q=query&page=1&limit=10
   */
  async globalSearch(req, res, next) {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      if (!q || q.trim().length === 0) {
        throw new BadRequestError('Search query is required');
      }

      if (q.trim().length < 2) {
        throw new BadRequestError('Search query must be at least 2 characters');
      }

      const result = await searchService.globalSearch(
        q.trim(),
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get search suggestions (autocomplete)
   * GET /api/search/suggestions?q=query&limit=5
   */
  async getSearchSuggestions(req, res, next) {
    try {
      const { q, limit = 5 } = req.query;

      if (!q || q.trim().length === 0) {
        return res.json({
          success: true,
          data: { posts: [], users: [] }
        });
      }

      if (q.trim().length < 2) {
        return res.json({
          success: true,
          data: { posts: [], users: [] }
        });
      }

      const result = await searchService.getSearchSuggestions(
        q.trim(),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SearchController();
