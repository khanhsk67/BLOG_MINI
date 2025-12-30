# MiniBlog Backend - Project Overview

## 📊 Repository Information

**Repository:** https://github.com/khanhsk67/BLOG_MINI.git
**Current Branch:** khanh/BackEnd
**Total JavaScript Files:** 51 files
**Last Update:** December 29, 2025

---

## 🏗️ Project Structure

```
blog-mini-backend/
├── src/
│   ├── app.js                      # Express application entry point
│   ├── config/                     # Configuration files (6 files)
│   │   ├── auth.js                 # JWT & bcrypt config
│   │   ├── database.js             # PostgreSQL/Sequelize config
│   │   ├── redis.js                # Redis config (empty - ready for caching)
│   │   ├── swagger.js              # API documentation config
│   │   └── upload.js               # Multer & AWS S3 upload config
│   ├── controllers/                # Route handlers (9 files)
│   │   ├── admin.controller.js     # Admin management endpoints
│   │   ├── auth.controller.js      # Authentication endpoints
│   │   ├── comment.controller.js   # Comment CRUD
│   │   ├── notification.controller.js  # Notification management
│   │   ├── post.controller.js      # Post CRUD with file upload
│   │   ├── reaction.controller.js  # Like/Unlike
│   │   ├── savedPost.controller.js # Bookmark posts
│   │   ├── upload.controller.js    # File upload endpoints
│   │   └── user.controller.js      # User profile & follow
│   ├── middleware/                 # Custom middleware (4 files)
│   │   ├── auth.middleware.js      # JWT auth, admin check
│   │   ├── error.middleware.js     # Global error handler
│   │   ├── rateLimit.middleware.js # Rate limiting
│   │   └── validation.middleware.js # Input validation
│   ├── models/                     # Database models (9 files)
│   │   ├── index.js                # Model associations
│   │   ├── User.js                 # User model
│   │   ├── Post.js                 # Post model
│   │   ├── Comment.js              # Comment model (nested)
│   │   ├── Reaction.js             # Like model
│   │   ├── Tag.js                  # Tag model
│   │   ├── PostTag.js              # Many-to-many pivot
│   │   ├── Follow.js               # User follow system
│   │   ├── Notification.js         # Notification model
│   │   └── SavedPost.js            # Bookmarked posts
│   ├── routes/                     # API routes (8 files)
│   │   ├── index.js                # Route aggregator
│   │   ├── admin.routes.js         # Admin endpoints
│   │   ├── auth.routes.js          # Auth endpoints
│   │   ├── comment.routes.js       # Comment endpoints
│   │   ├── notification.routes.js  # Notification endpoints
│   │   ├── post.routes.js          # Post endpoints with upload
│   │   ├── upload.routes.js        # Upload endpoints
│   │   └── user.routes.js          # User endpoints
│   ├── services/                   # Business logic (10 files)
│   │   ├── admin.service.js        # Admin operations
│   │   ├── auth.service.js         # Authentication logic
│   │   ├── comment.service.js      # Comment operations
│   │   ├── email.service.js        # Email service (empty)
│   │   ├── notification.service.js # Notification triggers
│   │   ├── post.service.js         # Post CRUD, search, tags
│   │   ├── reaction.service.js     # Like operations
│   │   ├── savedPost.service.js    # Bookmark operations
│   │   ├── upload.service.js       # AWS S3 & local upload
│   │   └── user.service.js         # User profile, follow
│   └── utils/                      # Utility functions (4 files)
│       ├── errors.js               # Custom error classes
│       ├── response.js             # Response helpers
│       ├── slug.js                 # Slug generation
│       └── validators.js           # Validation utilities
├── uploads/                        # Local file storage
│   ├── .gitignore                  # Ignore uploaded files
│   └── .gitkeep                    # Keep directory in git
├── .env                            # Environment variables (not in git)
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies & scripts
├── package-lock.json               # Dependency lock
├── README.md                       # Main documentation
├── ADMIN_API.md                    # Admin endpoints guide
├── API_ENDPOINTS.md                # Complete API reference
└── UPLOAD_API.md                   # Upload endpoints guide
```

---

## 📦 Dependencies

### Production Dependencies (15 packages)
```json
{
  "aws-sdk": "^2.1692.0",           // AWS S3 file storage
  "bcryptjs": "^3.0.3",             // Password hashing
  "cors": "^2.8.5",                 // CORS middleware
  "dotenv": "^17.2.3",              // Environment variables
  "express": "^5.1.0",              // Web framework
  "express-rate-limit": "^8.2.1",   // Rate limiting
  "express-validator": "^7.3.1",    // Input validation
  "helmet": "^8.1.0",               // Security headers
  "jsonwebtoken": "^9.0.2",         // JWT authentication
  "mongoose": "^8.19.1",            // MongoDB (not used)
  "morgan": "^1.10.1",              // HTTP logging
  "multer": "^2.0.2",               // File upload handling
  "pg": "^8.16.3",                  // PostgreSQL driver
  "sequelize": "^6.37.7",           // ORM for PostgreSQL
  "socket.io": "^4.8.1",            // Real-time (installed, not implemented)
  "swagger-jsdoc": "^6.2.8",        // Swagger docs generation
  "swagger-ui-express": "^5.0.1"    // Swagger UI
}
```

### Development Dependencies (3 packages)
```json
{
  "eslint": "^9.39.1",              // Code linting
  "nodemon": "^3.1.11",             // Auto-reload
  "prettier": "^3.6.2"              // Code formatting
}
```

---

## 🎯 Implemented Features

### ✅ Core Features (100% Complete)

#### 1. Authentication System
- ✅ User registration with validation
- ✅ Login with JWT tokens (access + refresh)
- ✅ Token refresh mechanism
- ✅ Password hashing with bcrypt
- ✅ Change password
- ✅ Get current user profile
- 🔄 Email verification (route exists, not implemented)
- 🔄 Password reset via email (route exists, not implemented)

#### 2. User Management
- ✅ Get user profile with statistics
- ✅ Update user profile
- ✅ Follow/Unfollow users
- ✅ Get followers list (paginated)
- ✅ Get following list (paginated)
- ✅ Search users
- ✅ Get user's posts
- ✅ Get user's liked posts
- ✅ Get user's saved posts

#### 3. Post Management
- ✅ Create post with cover image upload
- ✅ Update post with cover image
- ✅ Delete post (with cascade)
- ✅ Get posts (pagination, filters, sorting)
- ✅ Get single post with related posts
- ✅ Search posts (full-text)
- ✅ Tag system (auto-create, associate)
- ✅ Draft/Published status
- ✅ Auto-generate slug and excerpt
- ✅ View counter
- ✅ Featured posts

#### 4. Comment System
- ✅ Create comment
- ✅ Nested replies (parent_comment_id)
- ✅ Get post comments (paginated)
- ✅ Get comment replies
- ✅ Update comment
- ✅ Delete comment (cascade replies)

#### 5. Reaction/Like System
- ✅ Like post
- ✅ Unlike post
- ✅ Get users who liked post
- ✅ Get posts liked by user
- ✅ Like counter

#### 6. Saved Posts
- ✅ Save/Bookmark post
- ✅ Unsave post
- ✅ Get user's saved posts

#### 7. Notification System
- ✅ Notification model
- ✅ Auto-create notifications for:
  - Like on post
  - Comment on post
  - Reply to comment
  - New follower
- ✅ Get user notifications (paginated, filtered)
- ✅ Unread count
- ✅ Mark as read (single & all)
- ✅ Delete notifications (single & all)

#### 8. File Upload System
- ✅ Multer configuration (local + S3)
- ✅ Upload avatar
- ✅ Upload post cover image
- ✅ Upload multiple post images
- ✅ Delete uploaded files
- ✅ Automatic old file cleanup
- ✅ File validation (type, size)
- ✅ AWS S3 integration (production)
- ✅ Local storage (development)
- ✅ Static file serving

#### 9. Admin Panel
- ✅ System statistics dashboard
- ✅ User management:
  - List all users (paginated, filtered)
  - View user details with stats
  - Ban/Unban users
  - Delete users (cannot delete admins)
- ✅ Post management:
  - List all posts (paginated, filtered)
  - Delete posts
  - Set/Unset featured posts
- ✅ Global search (users, posts, comments)
- ✅ Role-based access control

---

## 🔄 Features Ready but Not Implemented

### 1. Real-time Features (Socket.io installed)
- 🔄 Real-time notifications
- 🔄 Online/Offline status
- 🔄 Typing indicators
- 🔄 Live comment updates

### 2. Email Service (service file exists, empty)
- 🔄 Email verification
- 🔄 Password reset emails
- 🔄 Notification emails

### 3. Redis Caching (config file exists, empty)
- 🔄 Cache posts
- 🔄 Cache user data
- 🔄 Session management
- 🔄 Rate limiting with Redis

---

## 📝 API Endpoints Summary

### Total Endpoints: 47+

| Module | Endpoints | Status |
|--------|-----------|--------|
| Authentication | 9 | ✅ Complete |
| Users | 10 | ✅ Complete |
| Posts | 6 | ✅ Complete |
| Comments | 6 | ✅ Complete |
| Reactions | 3 | ✅ Complete |
| Saved Posts | 2 | ✅ Complete |
| Notifications | 6 | ✅ Complete |
| Upload | 4 | ✅ Complete |
| Admin | 11 | ✅ Complete |

---

## 📚 Documentation Files

1. **README.md** (13KB)
   - Project overview
   - Installation guide
   - Database models
   - API documentation
   - Technology stack

2. **ADMIN_API.md** (8KB)
   - 11 admin endpoints
   - Request/response examples
   - Security features
   - Error handling

3. **UPLOAD_API.md** (11KB)
   - File upload guide
   - AWS S3 setup
   - Frontend examples
   - Troubleshooting

4. **API_ENDPOINTS.md** (27KB) ⭐ NEW
   - Complete API reference
   - All 47+ endpoints
   - Request/response examples
   - Authentication flow
   - React/Next.js examples
   - Error handling guide

---

## 🗄️ Database Schema

### Models: 9 tables

1. **Users**
   - Authentication
   - Profile data
   - Role-based access

2. **Posts**
   - Content management
   - Draft/Published
   - View counter
   - Featured flag

3. **Comments**
   - Nested structure
   - Self-referencing

4. **Reactions**
   - User-Post relationship
   - Unique constraint

5. **Tags**
   - Auto-create
   - Slug-based

6. **PostTag**
   - Many-to-many pivot
   - Post-Tag relationship

7. **Follow**
   - User-User relationship
   - Follower/Following

8. **Notification**
   - Type: like/comment/reply/follow
   - Read status

9. **SavedPost**
   - Bookmark system
   - User-Post relationship

### Relationships:
- User → Posts (1:N)
- User → Comments (1:N)
- Post → Comments (1:N)
- Post → Reactions (1:N)
- Post ↔ Tags (N:N)
- User ↔ Users (N:N - Follow)
- Comment → Comments (1:N - Nested)
- User → Notifications (1:N)
- User → SavedPosts (1:N)

---

## 🔐 Security Features

✅ **Authentication & Authorization**
- JWT access tokens (1h expiry)
- JWT refresh tokens (7d expiry)
- Password hashing (bcrypt, 10 rounds)
- Role-based access control (user/admin)

✅ **Input Validation**
- express-validator on all endpoints
- Type checking
- Length limits
- Format validation

✅ **Security Middleware**
- Helmet (security headers)
- CORS configuration
- Rate limiting (100 req/15min)
- SQL injection prevention (Sequelize)

✅ **File Upload Security**
- File type validation
- File size limits (5MB)
- Malicious file prevention

---

## 📊 Code Statistics

| Category | Count |
|----------|-------|
| Total Files | 51 JS files |
| Models | 9 files |
| Controllers | 9 files |
| Services | 10 files |
| Routes | 8 files |
| Middleware | 4 files |
| Config | 6 files |
| Utils | 4 files |
| Documentation | 4 MD files |

---

## 🚀 Recent Commits

1. **895722b** - update file API endpoint.md
2. **9b23b29** - Chức năng Upload File - Avatar và Post Cover Images
3. **ceb5b01** - Thêm Documentation và NPM Scripts
4. **5846bae** - Chức năng Admin Panel - Quản lý User và Post
5. **eeb348e** - Chức năng Notification System
6. **cab087b** - Chức năng Authentication, User Management, Comment, Reaction và Saved Posts

---

## 🎯 Next Steps / Recommendations

### High Priority
1. **Socket.io Real-time** - Already installed, implement real-time notifications
2. **Email Service** - Implement email verification and password reset
3. **Testing** - Add unit and integration tests

### Medium Priority
4. **Redis Caching** - Implement caching for performance
5. **Report/Flag System** - Content moderation
6. **Analytics** - User activity tracking

### Low Priority
7. **Advanced Search** - Full-text search enhancement
8. **API Versioning** - Prepare for future changes
9. **Logging System** - Structured logging with Winston

---

## 🛠️ NPM Scripts

```json
{
  "start": "node src/app.js",           // Production mode
  "dev": "nodemon src/app.js",          // Development with auto-reload
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

---

## 🌐 API Access Points

- **API Base**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health
- **Swagger Docs**: http://localhost:3000/api-docs
- **Static Files**: http://localhost:3000/uploads/{filename}

---

## ✅ Quality Checklist

- ✅ MVC Architecture
- ✅ Service Layer Pattern
- ✅ Error Handling Middleware
- ✅ Input Validation
- ✅ Authentication & Authorization
- ✅ Database Relationships
- ✅ File Upload System
- ✅ API Documentation
- ✅ Environment Configuration
- ✅ Security Best Practices
- ⏳ Unit Tests (Not implemented)
- ⏳ Integration Tests (Not implemented)
- ⏳ CI/CD Pipeline (Not implemented)

---

## 📌 Notes

- **Database**: PostgreSQL (Sequelize ORM)
- **Authentication**: JWT-based
- **File Storage**: Local (dev) / AWS S3 (prod)
- **API Docs**: Swagger/OpenAPI 3.0
- **Code Style**: ESLint + Prettier configured
- **Branch Strategy**: Feature branches (khanh/BackEnd)

---

## 🎓 Learning Resources

This project demonstrates:
- RESTful API design
- JWT authentication
- File upload handling
- Database relationships
- Role-based access control
- Input validation
- Error handling
- API documentation
- MVC architecture
- Service layer pattern

---

**Last Updated**: December 30, 2025
**Maintained By**: khanhsk67
**Repository**: https://github.com/khanhsk67/BLOG_MINI.git
