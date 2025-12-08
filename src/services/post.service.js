const { Post, User, Tag, PostTag, Comment, Reaction, sequelize } = require('../models');
const { Op } = require('sequelize');

class PostService {
    // Create new post
    async createPost(authorId, postData) {
        const { title, content, excerpt, featured_image_url, tags, status } = postData;

        // Create post
        const post = await Post.create({
            author_id: authorId,
            title,
            content,
            excerpt,
            featured_image_url,
            status: status || 'draft'
        });

        // Handle tags
        if (tags && tags.length > 0) {
            await this.attachTags(post.id, tags);
        }

        // Fetch complete post with associations
        return await this.getPostById(post.id, authorId);
    }

    // Get post by ID
    async getPostById(postId, userId = null) {
        const post = await Post.findByPk(postId, {
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'display_name', 'avatar_url', 'bio']
                },
                {
                    model: Tag,
                    as: 'tags',
                    attributes: ['id', 'name', 'slug'],
                    through: { attributes: [] }
                }
            ]
        });

        if (!post) {
            throw new Error('Post not found');
        }

        // Check if user can access draft
        if (post.status === 'draft' && post.author_id !== userId) {
            throw new Error('Post not found');
        }

        // Get counts
        const likeCount = await Reaction.count({ where: { post_id: postId } });
        const commentCount = await Comment.count({ where: { post_id: postId } });

        // Check if user liked/saved (if authenticated)
        let isLiked = false;
        let isSaved = false;

        if (userId) {
            const { SavedPost } = require('../models');

            isLiked = await Reaction.findOne({
                where: { post_id: postId, user_id: userId }
            }) !== null;

            isSaved = await SavedPost.findOne({
                where: { post_id: postId, user_id: userId }
            }) !== null;
        }

        // Increment view count (only once per session/IP - simplified)
        await post.increment('view_count');

        // Get related posts
        const relatedPosts = await this.getRelatedPosts(postId, post.tags);

        return {
            ...post.toJSON(),
            like_count: likeCount,
            comment_count: commentCount,
            is_liked_by_user: isLiked,
            is_saved_by_user: isSaved,
            related_posts: relatedPosts
        };
    }

    // Get posts list with pagination and filters
    async getPosts(filters = {}) {
        const {
            page = 1,
            limit = 20,
            status = 'published',
            tag,
            author,
            sort = 'latest',
            userId,
            query
        } = filters;

        const offset = (page - 1) * limit;

        // Build where clause
        const where = { status };

        // Search by query
        if (query) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${query}%` } },
                { content: { [Op.iLike]: `%${query}%` } }
            ];
        }

        // Filter by author
        if (author) {
            const authorUser = await User.findOne({ where: { username: author } });
            if (authorUser) {
                where.author_id = authorUser.id;
            }
        }

        // Build include clause
        const include = [
            {
                model: User,
                as: 'author',
                attributes: ['id', 'username', 'display_name', 'avatar_url']
            },
            {
                model: Tag,
                as: 'tags',
                attributes: ['id', 'name', 'slug'],
                through: { attributes: [] }
            }
        ];

        // Filter by tag
        if (tag) {
            include[1].where = { slug: tag };
            include[1].required = true;
        }

        // Build order clause
        let order = [['created_at', 'DESC']]; // default: latest

        if (sort === 'popular') {
            order = [['view_count', 'DESC']];
        } else if (sort === 'trending') {
            // Trending = most likes + views in last 7 days
            where.created_at = {
                [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            };
            order = [
                [sequelize.literal('(view_count + like_count)'), 'DESC']
            ];
        }

        // Fetch posts
        const { count, rows: posts } = await Post.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
            subQuery: false
        });

        // Add counts to each post
        const postsWithCounts = await Promise.all(
            posts.map(async (post) => {
                const likeCount = await Reaction.count({ where: { post_id: post.id } });
                const commentCount = await Comment.count({ where: { post_id: post.id } });

                return {
                    ...post.toJSON(),
                    like_count: likeCount,
                    comment_count: commentCount
                };
            })
        );

        return {
            posts: postsWithCounts,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(count / limit),
                total_posts: count,
                per_page: limit,
                has_next: page * limit < count,
                has_prev: page > 1
            }
        };
    }

    // Update post
    async updatePost(postId, userId, updateData) {
        const post = await Post.findByPk(postId);

        if (!post) {
            throw new Error('Post not found');
        }

        // Check authorization
        if (post.author_id !== userId) {
            throw new Error('Not authorized to update this post');
        }

        // Update post
        const { tags, ...postFields } = updateData;
        await post.update(postFields);

        // Update tags if provided
        if (tags) {
            await this.attachTags(postId, tags);
        }

        return await this.getPostById(postId, userId);
    }

    // Delete post
    async deletePost(postId, userId, isAdmin = false) {
        const post = await Post.findByPk(postId);

        if (!post) {
            throw new Error('Post not found');
        }

        // Check authorization
        if (!isAdmin && post.author_id !== userId) {
            throw new Error('Not authorized to delete this post');
        }

        // Soft delete
        await post.destroy();

        return {
            message: 'Post deleted successfully',
            post_id: postId
        };
    }

    // Helper: Attach tags to post
    async attachTags(postId, tagNames) {
        // Create or find tags
        const tagInstances = await Promise.all(
            tagNames.map(async (tagName) => {
                const slug = tagName.toLowerCase().trim().replace(/\s+/g, '-');
                const [tag] = await Tag.findOrCreate({
                    where: { slug },
                    defaults: {
                        name: tagName.toLowerCase().trim(),
                        slug
                    }
                });
                return tag;
            })
        );

        // Associate tags with post
        const post = await Post.findByPk(postId);
        await post.setTags(tagInstances);
    }

    // Get related posts (by tags)
    async getRelatedPosts(postId, currentTags, limit = 3) {
        if (!currentTags || currentTags.length === 0) {
            return [];
        }

        const tagIds = currentTags.map(tag => tag.id);

        const relatedPosts = await Post.findAll({
            where: {
                id: { [Op.ne]: postId },
                status: 'published'
            },
            include: [
                {
                    model: Tag,
                    as: 'tags',
                    where: { id: { [Op.in]: tagIds } },
                    attributes: [],
                    through: { attributes: [] }
                },
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'display_name', 'avatar_url']
                }
            ],
            attributes: [
                'id',
                'title',
                'slug',
                'excerpt',
                'featured_image_url',
                'published_at',
                [sequelize.fn('COUNT', sequelize.col('tags.id')), 'tag_match_count']
            ],
            group: ['Post.id', 'author.id'],
            order: [[sequelize.literal('tag_match_count'), 'DESC']],
            limit,
            subQuery: false
        });

        return relatedPosts.map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            featured_image_url: post.featured_image_url,
            author: {
                username: post.author.username,
                display_name: post.author.display_name,
                avatar_url: post.author.avatar_url
            },
            published_at: post.published_at
        }));
    }

    // Search posts
    async searchPosts(query, filters = {}) {
        const { page = 1, limit = 20 } = filters;
        const offset = (page - 1) * limit;

        const where = {
            status: 'published',
            [Op.or]: [
                { title: { [Op.iLike]: `%${query}%` } },
                { content: { [Op.iLike]: `%${query}%` } }
            ]
        };

        const { count, rows: posts } = await Post.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'display_name', 'avatar_url']
                },
                {
                    model: Tag,
                    as: 'tags',
                    attributes: ['id', 'name', 'slug'],
                    through: { attributes: [] }
                }
            ],
            order: [['created_at', 'DESC']],
            limit,
            offset
        });

        const postsWithCounts = await Promise.all(
            posts.map(async (post) => {
                const likeCount = await Reaction.count({ where: { post_id: post.id } });
                const commentCount = await Comment.count({ where: { post_id: post.id } });

                return {
                    ...post.toJSON(),
                    like_count: likeCount,
                    comment_count: commentCount
                };
            })
        );

        return {
            posts: postsWithCounts,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(count / limit),
                total_posts: count,
                per_page: limit
            }
        };
    }

    // Get user's posts
    async getUserPosts(userId, options = {}) {
        const {
            page = 1,
            limit = 20,
            status = 'published',
            currentUserId
        } = options;

        const offset = (page - 1) * limit;

        // Build where clause
        const where = { author_id: userId };

        // Only show drafts if viewing own profile
        if (currentUserId !== userId) {
            where.status = 'published';
        } else if (status) {
            where.status = status;
        }

        const { count, rows: posts } = await Post.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'display_name', 'avatar_url']
                },
                {
                    model: Tag,
                    as: 'tags',
                    attributes: ['id', 'name', 'slug'],
                    through: { attributes: [] }
                }
            ],
            order: [['created_at', 'DESC']],
            limit,
            offset
        });

        const postsWithCounts = await Promise.all(
            posts.map(async (post) => {
                const likeCount = await Reaction.count({ where: { post_id: post.id } });
                const commentCount = await Comment.count({ where: { post_id: post.id } });

                return {
                    ...post.toJSON(),
                    like_count: likeCount,
                    comment_count: commentCount
                };
            })
        );

        return {
            posts: postsWithCounts,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(count / limit),
                total_posts: count,
                per_page: limit
            }
        };
    }
}

module.exports = new PostService();