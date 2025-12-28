const postService = require('../services/post.service');
const uploadService = require('../services/upload.service');

class PostController {
    // POST /api/posts
    async createPost(req, res, next) {
        try {
            const postData = req.body;

            // Handle uploaded cover image
            if (req.file) {
                postData.featured_image_url = await uploadService.uploadPostCover(req.file);
            }

            const post = await postService.createPost(req.user.id, postData);
            res.status(201).json(post);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/posts
    async getPosts(req, res, next) {
        try {
            const filters = {
                page: parseInt(req.query.page) || 1,
                limit: Math.min(parseInt(req.query.limit) || 20, 50),
                status: req.query.status || 'published',
                tag: req.query.tag,
                author: req.query.author,
                sort: req.query.sort || 'latest',
                query: req.query.query,
                userId: req.user?.id
            };

            const result = await postService.getPosts(filters);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/posts/:id
    async getPost(req, res, next) {
        try {
            const post = await postService.getPostById(
                req.params.id,
                req.user?.id
            );
            res.status(200).json(post);
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/posts/:id
    async updatePost(req, res, next) {
        try {
            const postData = req.body;

            // Handle uploaded cover image
            if (req.file) {
                // Get old post to delete old cover image
                const oldPost = await postService.getPostById(req.params.id, req.user.id);
                if (oldPost.featured_image_url) {
                    await uploadService.deleteFile(oldPost.featured_image_url).catch(() => {
                        // Ignore errors when deleting old image
                    });
                }

                postData.featured_image_url = await uploadService.uploadPostCover(req.file);
            }

            const post = await postService.updatePost(
                req.params.id,
                req.user.id,
                postData
            );
            res.status(200).json(post);
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/posts/:id
    async deletePost(req, res, next) {
        try {
            const isAdmin = req.user?.role === 'admin';
            const result = await postService.deletePost(
                req.params.id,
                req.user.id,
                isAdmin
            );
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/posts/search?query=xxx
    async searchPosts(req, res, next) {
        try {
            const { query } = req.query;

            if (!query) {
                return res.status(400).json({
                    error: { message: 'Search query is required' }
                });
            }

            const result = await postService.searchPosts(query, {
                page: parseInt(req.query.page) || 1,
                limit: Math.min(parseInt(req.query.limit) || 20, 50)
            });

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PostController();