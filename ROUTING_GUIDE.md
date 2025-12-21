# MiniBlog - Complete URL & Routing Guide

## 📍 Public Routes (No Authentication Required)

### Authentication Pages
- **`/login`** - User login page
  - POST to `/api/auth/login` with `{ email, password }`
  - Demo credentials: `user@example.com` / `SecurePass123!`

- **`/signup`** - User registration page
  - POST to `/api/auth/register` with `{ email, username, password, display_name }`
  - Password requirements: min 8 chars, 1 uppercase, 1 number, 1 special char (!@#$%^&*)

---

## 🔐 Protected Routes (Authentication Required)

### Main Feed
- **`/`** (Home)
  - Main feed with all posts
  - Requires valid `authToken` in localStorage
  - Shows user's feed with posts from all users

### User Profiles (Future Implementation)
- **`/profile/:username`** - View user profile
- **`/profile/me`** - Current user's profile
- **`/profile/me/settings`** - Edit profile settings

### Post Management (Future Implementation)
- **`/compose`** - Create new post
- **`/posts/:id`** - View individual post detail
- **`/posts/:id/edit`** - Edit post
- **`/posts/:id/delete`** - Delete post

### User Features (Future Implementation)
- **`/saved`** - View saved posts
- **`/notifications`** - View all notifications
- **`/following`** - View following list
- **`/followers`** - View followers list

---

## 🔌 API Endpoints

### Authentication Endpoints

#### Register New User
\`\`\`
POST /api/auth/register
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "display_name": "John Doe"
}

Response (201):
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "username": "johndoe",
    "display_name": "John Doe",
    "avatar_url": "https://...",
    "email_verified": false,
    "created_at": "2025-11-16T..."
  },
  "tokens": {
    "access_token": "jwt_access_...",
    "refresh_token": "jwt_refresh_...",
    "token_type": "Bearer",
    "expires_in": 86400
  }
}
\`\`\`

#### Login User
\`\`\`
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "username": "johndoe",
    "display_name": "John Doe",
    "avatar_url": "https://...",
    "role": "user"
  },
  "tokens": {
    "access_token": "jwt_access_...",
    "refresh_token": "jwt_refresh_...",
    "token_type": "Bearer",
    "expires_in": 86400
  }
}
\`\`\`

#### Logout User
\`\`\`
POST /api/auth/logout
Authorization: Bearer <access_token>

Response (200):
{
  "message": "Logged out successfully"
}
\`\`\`

---

### Post Endpoints

#### Get All Posts
\`\`\`
GET /api/posts?page=1&limit=20&status=published&sort=latest

Query Parameters:
- page (optional): Page number, default 1
- limit (optional): Items per page (1-50), default 20
- status (optional): 'published' or 'draft'
- sort (optional): 'latest', 'popular', 'trending'

Response (200):
{
  "posts": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 25,
    "total_posts": 486,
    "per_page": 20,
    "has_next": true,
    "has_prev": false
  }
}
\`\`\`

#### Get Single Post
\`\`\`
GET /api/posts/:id

Path Parameters:
- id: Post UUID or slug

Response (200):
{
  "id": "post-123",
  "title": "Post Title",
  "slug": "post-title",
  "content": "...",
  "author": {...},
  "tags": [...],
  "view_count": 342,
  "like_count": 28,
  "comment_count": 15,
  "published_at": "2025-11-16T..."
}
\`\`\`

#### Create Post
\`\`\`
POST /api/posts
Authorization: Bearer <access_token>
Content-Type: application/json

Request:
{
  "title": "My First Blog Post",
  "content": "Full content with markdown support...",
  "excerpt": "Brief summary (optional)",
  "featured_image_url": "https://...",
  "tags": ["technology", "web-development"],
  "status": "published"
}

Response (201):
{
  "id": "post-123",
  "title": "My First Blog Post",
  "slug": "my-first-blog-post",
  "author_id": "user-123",
  ...
}
\`\`\`

#### Update Post
\`\`\`
PUT /api/posts/:id
Authorization: Bearer <access_token>
Content-Type: application/json

Request: (Partial updates supported)
{
  "title": "Updated Title",
  "content": "Updated content...",
  "status": "published"
}

Response (200): Updated post object
\`\`\`

#### Delete Post
\`\`\`
DELETE /api/posts/:id
Authorization: Bearer <access_token>

Response (200):
{
  "message": "Post deleted successfully",
  "post_id": "post-123"
}
\`\`\`

---

### Comment Endpoints

#### Get Comments for Post
\`\`\`
GET /api/comments?post_id=<post_id>&page=1&limit=20

Query Parameters:
- post_id (required): Post ID
- page (optional): Default 1
- limit (optional): Default 20, max 50

Response (200):
{
  "comments": [...],
  "pagination": {...}
}
\`\`\`

#### Create Comment
\`\`\`
POST /api/comments
Authorization: Bearer <access_token>
Content-Type: application/json

Request:
{
  "post_id": "post-123",
  "content": "Great article! Thanks for sharing.",
  "parent_comment_id": null
}

Response (201):
{
  "id": "comment-123",
  "post_id": "post-123",
  "user": {...},
  "content": "Great article! Thanks for sharing.",
  "parent_comment_id": null,
  "created_at": "2025-11-16T..."
}
\`\`\`

#### Update Comment
\`\`\`
PUT /api/comments/:id
Authorization: Bearer <access_token>
Content-Type: application/json

Request:
{
  "content": "Updated comment content"
}

Response (200): Updated comment object
\`\`\`

#### Delete Comment
\`\`\`
DELETE /api/comments/:id
Authorization: Bearer <access_token>

Response (200):
{
  "message": "Comment deleted successfully",
  "comment_id": "comment-123"
}
\`\`\`

---

## 📝 Authentication Flow

### Flow Diagram
\`\`\`
1. User visits /login or /signup
2. Submit credentials to /api/auth/login or /api/auth/register
3. Receive access_token and refresh_token
4. Store tokens in localStorage:
   - localStorage.setItem('authToken', access_token)
   - localStorage.setItem('refreshToken', refresh_token)
5. Redirect to home (/)
6. App checks for authToken on load - if missing, redirect to /login
7. Include Authorization header on protected API calls:
   Authorization: Bearer <access_token>
8. Click logout in header to clear tokens and return to /login
\`\`\`

---

## 🔑 Quick Reference

| Route | Method | Auth Required | Purpose |
|-------|--------|---------------|---------|
| `/` | GET | ✅ | Home feed |
| `/login` | GET | ❌ | Login page |
| `/signup` | GET | ❌ | Registration page |
| `/api/auth/register` | POST | ❌ | Register user |
| `/api/auth/login` | POST | ❌ | Login user |
| `/api/auth/logout` | POST | ✅ | Logout user |
| `/api/posts` | GET | ❌ | List posts |
| `/api/posts` | POST | ✅ | Create post |
| `/api/posts/:id` | GET | ❌ | View post |
| `/api/posts/:id` | PUT | ✅ | Update post |
| `/api/posts/:id` | DELETE | ✅ | Delete post |
| `/api/comments` | GET | ❌ | Get comments |
| `/api/comments` | POST | ✅ | Create comment |
| `/api/comments/:id` | PUT | ✅ | Update comment |
| `/api/comments/:id` | DELETE | ✅ | Delete comment |

---

## 🔄 Error Responses

All errors follow this format:

\`\`\`json
{
  "error": {
    "message": "Human readable error message",
    "code": "ERROR_CODE",
    "status": 400
  }
}
\`\`\`

### Common Error Codes
- `VALIDATION_ERROR` (422): Invalid request data
- `UNAUTHORIZED` (401): Missing or invalid authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `SERVER_ERROR` (500): Internal server error

---

## 📚 Environment Variables

No additional environment variables are required for the demo. The app uses:
- `localStorage` for token storage (client-side)
- Mock data for API responses
- Base URL: `http://localhost:3000` (local) or your deployed URL

---

## 🚀 Next Steps

To integrate with a real backend:

1. Replace mock data in API routes with actual database queries
2. Implement proper JWT token generation and validation
3. Add database models for users, posts, comments, etc.
4. Set up proper error handling and validation
5. Add email verification for sign-ups
6. Implement refresh token rotation
7. Add rate limiting for sensitive endpoints
8. Set up proper CORS policies

---

**Last Updated**: November 16, 2025  
**MiniBlog Version**: 1.0 Beta
