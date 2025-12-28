# MiniBlog Backend API

A comprehensive blog platform backend built with Node.js, Express, and PostgreSQL. This API provides a complete blogging ecosystem with user management, posts, comments, reactions, follows, notifications, and an admin panel.

## Features

### Core Features
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Profile management, follow/unfollow system
- **Post Management**: Create, read, update, delete posts with draft/publish status
- **Comment System**: Nested comments with reply functionality
- **Reaction System**: Like/unlike posts with engagement tracking
- **Saved Posts**: Bookmark posts for later reading
- **Notifications**: Real-time notifications for likes, comments, and follows
- **Admin Panel**: Comprehensive admin dashboard for platform management

### Technical Features
- RESTful API architecture
- Sequelize ORM with PostgreSQL
- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Input validation with express-validator
- Error handling middleware
- Rate limiting
- CORS support
- Swagger API documentation
- Security headers with Helmet

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Database**: PostgreSQL
- **ORM**: Sequelize v6.37.7
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Security**: Helmet, CORS, express-rate-limit
- **File Upload**: Multer (configured, ready to use)
- **Real-time**: Socket.io (installed, ready for implementation)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd blog-mini-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

4. **Create database**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE miniblog_db;
```

5. **Run database migrations** (Auto-sync on first run)
```bash
npm start
# Database tables will be created automatically using Sequelize sync
```

6. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:3000`

## API Documentation

### Swagger UI
Access the interactive API documentation at:
```
http://localhost:3000/api-docs
```

### API Modules

#### 1. Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /refresh-token` - Refresh access token
- `POST /logout` - Logout user
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `POST /change-password` - Change password (authenticated)
- `GET /verify-email/:token` - Verify email address
- `GET /me` - Get current user profile

#### 2. Users (`/api/users`)
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile
- `POST /users/:id/follow` - Follow user
- `DELETE /users/:id/unfollow` - Unfollow user
- `GET /users/:id/followers` - Get user followers
- `GET /users/:id/following` - Get users being followed
- `GET /users/:id/posts` - Get user's posts
- `GET /users/:id/liked-posts` - Get posts liked by user
- `GET /users/:id/saved-posts` - Get user's saved posts
- `GET /users/search` - Search users

#### 3. Posts (`/api/posts`)
- `GET /posts` - Get all posts (paginated)
- `GET /posts/:id` - Get single post
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `GET /posts/search` - Search posts
- `GET /posts/tags/:tag` - Get posts by tag
- `GET /posts/:id/related` - Get related posts
- `POST /posts/:id/like` - Like post
- `DELETE /posts/:id/unlike` - Unlike post
- `GET /posts/:id/likes` - Get users who liked post
- `POST /posts/:id/comments` - Add comment to post
- `GET /posts/:id/comments` - Get post comments

#### 4. Comments (`/api/comments`)
- `GET /comments/:id` - Get comment
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment
- `POST /comments/:id/reply` - Reply to comment
- `GET /comments/:id/replies` - Get comment replies

#### 5. Notifications (`/api/notifications`)
- `GET /notifications` - Get user notifications
- `GET /notifications/unread-count` - Get unread count
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/mark-all-read` - Mark all as read
- `DELETE /notifications/:id` - Delete notification
- `DELETE /notifications` - Delete all notifications

#### 6. Admin Panel (`/api/admin`)
See [ADMIN_API.md](./ADMIN_API.md) for detailed admin documentation.

**User Management:**
- `GET /admin/users` - Get all users
- `GET /admin/users/:id` - Get user detail
- `PUT /admin/users/:id/ban` - Ban user
- `PUT /admin/users/:id/unban` - Unban user
- `DELETE /admin/users/:id` - Delete user

**Post Management:**
- `GET /admin/posts` - Get all posts
- `DELETE /admin/posts/:id` - Delete post
- `PUT /admin/posts/:id/featured` - Set featured post

**System:**
- `GET /admin/stats` - Get system statistics
- `GET /admin/search` - Global search
- `GET /admin/featured-posts` - Get featured posts

### Health Check
```
GET /api/health
```

## Database Models

### User
- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String, Hashed)
- `display_name` (String)
- `bio` (Text)
- `avatar_url` (String)
- `role` (Enum: user/admin)
- `is_active` (Boolean)
- `email_verified` (Boolean)
- `created_at`, `updated_at`

### Post
- `id` (UUID, Primary Key)
- `author_id` (UUID, Foreign Key → User)
- `title` (String)
- `slug` (String, Unique)
- `content` (Text)
- `excerpt` (String, Auto-generated)
- `cover_image_url` (String)
- `status` (Enum: draft/published)
- `is_featured` (Boolean)
- `view_count` (Integer)
- `published_at` (DateTime)
- `created_at`, `updated_at`

### Comment
- `id` (UUID, Primary Key)
- `post_id` (UUID, Foreign Key → Post)
- `user_id` (UUID, Foreign Key → User)
- `parent_comment_id` (UUID, Foreign Key → Comment, Nullable)
- `content` (Text)
- `created_at`, `updated_at`

### Reaction
- `id` (UUID, Primary Key)
- `post_id` (UUID, Foreign Key → Post)
- `user_id` (UUID, Foreign Key → User)
- `created_at`
- Unique constraint: (post_id, user_id)

### Follow
- `id` (UUID, Primary Key)
- `follower_id` (UUID, Foreign Key → User)
- `following_id` (UUID, Foreign Key → User)
- `created_at`
- Unique constraint: (follower_id, following_id)

### Notification
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → User)
- `type` (Enum: like/comment/reply/follow)
- `related_user_id` (UUID, Foreign Key → User)
- `related_post_id` (UUID, Foreign Key → Post)
- `is_read` (Boolean)
- `created_at`

### SavedPost
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → User)
- `post_id` (UUID, Foreign Key → Post)
- `created_at`
- Unique constraint: (user_id, post_id)

### Tag & PostTag
- Tag-based categorization system
- Many-to-many relationship between Posts and Tags

## Project Structure

```
blog-mini-backend/
├── src/
│   ├── app.js                 # Express app setup
│   ├── config/
│   │   ├── auth.js           # JWT & bcrypt config
│   │   ├── database.js       # Sequelize config
│   │   └── swagger.js        # Swagger config
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── comment.controller.js
│   │   ├── notification.controller.js
│   │   ├── post.controller.js
│   │   ├── reaction.controller.js
│   │   ├── savedPost.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js      # Auth & authorization
│   │   ├── error.middleware.js     # Error handling
│   │   └── validation.middleware.js # Input validation
│   ├── models/
│   │   ├── index.js          # Model relationships
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Reaction.js
│   │   ├── Follow.js
│   │   ├── Notification.js
│   │   ├── SavedPost.js
│   │   ├── Tag.js
│   │   └── PostTag.js
│   ├── routes/
│   │   ├── index.js          # Route aggregator
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── comment.routes.js
│   │   ├── notification.routes.js
│   │   ├── post.routes.js
│   │   └── user.routes.js
│   ├── services/
│   │   ├── admin.service.js
│   │   ├── auth.service.js
│   │   ├── comment.service.js
│   │   ├── notification.service.js
│   │   ├── post.service.js
│   │   ├── reaction.service.js
│   │   ├── savedPost.service.js
│   │   └── user.service.js
│   └── utils/
│       ├── errors.js         # Custom error classes
│       ├── response.js       # Response helpers
│       ├── slug.js          # Slug generation
│       └── validators.js    # Validation utilities
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── ADMIN_API.md
```

## Authentication

### JWT Tokens
The API uses two types of tokens:
- **Access Token**: Short-lived (1 hour), used for API requests
- **Refresh Token**: Long-lived (7 days), used to get new access tokens

### Using Authentication

1. **Register or Login**
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

2. **Use the Access Token**
```bash
Authorization: Bearer <access_token>
```

3. **Refresh Token when expired**
```bash
POST /api/auth/refresh-token
{
  "refreshToken": "<refresh_token>"
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": [] // Optional validation errors
  }
}
```

### Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `INTERNAL_SERVER_ERROR` - Server error

## Security Features

- **Password Hashing**: bcrypt with 10 rounds
- **JWT Authentication**: Secure token-based auth
- **Role-based Access Control**: User/Admin roles
- **Input Validation**: Comprehensive validation on all endpoints
- **Rate Limiting**: Prevents abuse
- **CORS**: Configured cross-origin requests
- **Helmet**: Security headers
- **SQL Injection Protection**: Sequelize ORM parameterized queries
- **XSS Protection**: Input sanitization

## Testing

Access Swagger UI for interactive API testing:
```
http://localhost:3000/api-docs
```

## Environment Variables

See `.env.example` for all available configuration options.

Required variables:
- `DB_*` - Database configuration
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - Refresh token secret

Optional variables:
- `AWS_*` - AWS S3 for file uploads
- `EMAIL_*` - Email service for password reset
- `RATE_LIMIT_*` - Rate limiting configuration

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm start
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure PostgreSQL with connection pooling
4. Set up proper CORS origins
5. Enable rate limiting
6. Configure AWS S3 for file uploads
7. Set up email service for notifications
8. Use process manager (PM2, systemd)
9. Set up reverse proxy (nginx)
10. Enable HTTPS

## API Rate Limits

Default rate limits:
- Window: 15 minutes
- Max requests: 100 per window

Adjust in `.env`:
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

## Roadmap

- [ ] Email verification system
- [ ] Password reset via email
- [ ] AWS S3 file upload implementation
- [ ] Socket.io real-time notifications
- [ ] Report/Flag system for content moderation
- [ ] Analytics and insights dashboard
- [ ] Comment reactions
- [ ] Post sharing functionality
- [ ] User reputation system
- [ ] Advanced search with filters
