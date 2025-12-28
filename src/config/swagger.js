const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MiniBlog API Documentation',
      version: '1.0.0',
      description: 'API documentation for MiniBlog - A blog sharing platform',
      contact: {
        name: 'MiniBlog Team',
        email: 'support@miniblog.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'http://localhost:3000/api',
        description: 'API base URL'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer {token}'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            username: { type: 'string' },
            display_name: { type: 'string' },
            avatar_url: { type: 'string', format: 'uri' },
            bio: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            is_active: { type: 'boolean' },
            email_verified: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            author_id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            content: { type: 'string' },
            excerpt: { type: 'string' },
            slug: { type: 'string' },
            featured_image_url: { type: 'string', format: 'uri' },
            status: { type: 'string', enum: ['draft', 'published'] },
            view_count: { type: 'integer' },
            is_featured: { type: 'boolean' },
            published_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            post_id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            parent_comment_id: { type: 'string', format: 'uuid', nullable: true },
            content: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            message: { type: 'string' },
            error: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                details: { type: 'array', items: { type: 'object' } }
              }
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Posts', description: 'Post management endpoints' },
      { name: 'Comments', description: 'Comment management endpoints' },
      { name: 'Reactions', description: 'Like/Reaction endpoints' },
      { name: 'Saved Posts', description: 'Bookmark endpoints' }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
