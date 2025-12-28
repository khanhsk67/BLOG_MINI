# Admin Panel API Documentation

## Overview
The Admin Panel provides comprehensive management capabilities for administrators to monitor and control the MiniBlog platform. All admin endpoints require authentication and admin role.

## Authentication
All admin routes require:
1. Valid JWT token in `Authorization` header
2. User role must be `admin`

## Base URL
```
/api/admin
```

## Endpoints

### 1. System Statistics
**GET** `/api/admin/stats`

Get overall system statistics and metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "users": {
        "total": 150,
        "active": 145,
        "banned": 5,
        "new_last_week": 12
      },
      "posts": {
        "total": 450,
        "published": 420,
        "draft": 30,
        "new_last_week": 25
      },
      "engagement": {
        "total_comments": 890,
        "total_likes": 1250,
        "total_follows": 320
      }
    }
  }
}
```

---

### 2. Global Search
**GET** `/api/admin/search?q={query}&limit={limit}`

Search across users, posts, and comments.

**Query Parameters:**
- `q` (required): Search query string
- `limit` (optional): Results per category (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "posts": [...],
    "comments": [...]
  }
}
```

---

### 3. Featured Posts
**GET** `/api/admin/featured-posts`

Get all featured posts (maximum 10).

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "title": "Post Title",
        "is_featured": true,
        "author": {
          "id": "uuid",
          "username": "author_name",
          "display_name": "Author Display Name"
        }
      }
    ]
  }
}
```

---

## User Management

### 4. Get All Users
**GET** `/api/admin/users`

Get paginated list of all users with filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search by username, email, or display_name
- `role` (optional): Filter by role (user/admin)
- `isActive` (optional): Filter by active status (true/false)
- `sortBy` (optional): Sort field (default: created_at)
- `sortOrder` (optional): Sort order (ASC/DESC, default: DESC)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [...]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### 5. Get User Detail
**GET** `/api/admin/users/:id`

Get detailed information about a specific user including statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "is_active": true,
      "stats": {
        "posts_count": 15,
        "comments_count": 45,
        "likes_count": 120,
        "followers_count": 25,
        "following_count": 30
      }
    }
  }
}
```

---

### 6. Ban User
**PUT** `/api/admin/users/:id/ban`

Deactivate a user account.

**Request Body:**
```json
{
  "reason": "Violation of community guidelines" // Optional, max 500 chars
}
```

**Restrictions:**
- Cannot ban admin users
- User must be currently active

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "User banned successfully",
    "user": {...},
    "reason": "Violation of community guidelines"
  }
}
```

---

### 7. Unban User
**PUT** `/api/admin/users/:id/unban`

Reactivate a banned user account.

**Restrictions:**
- User must be currently banned

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "User unbanned successfully",
    "user": {...}
  }
}
```

---

### 8. Delete User
**DELETE** `/api/admin/users/:id`

Permanently delete a user and all related data (cascade delete).

**Restrictions:**
- Cannot delete admin users
- This action is permanent and irreversible

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully",
    "deletedUser": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

---

## Post Management

### 9. Get All Posts
**GET** `/api/admin/posts`

Get paginated list of all posts with filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (published/draft)
- `search` (optional): Search by title or content
- `sortBy` (optional): Sort field (default: created_at)
- `sortOrder` (optional): Sort order (ASC/DESC, default: DESC)

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "title": "Post Title",
        "status": "published",
        "author": {
          "id": "uuid",
          "username": "author_name",
          "email": "author@example.com"
        }
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 450,
    "totalPages": 23
  }
}
```

---

### 10. Delete Post
**DELETE** `/api/admin/posts/:id`

Permanently delete a post and all related data (cascade delete).

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Post deleted successfully",
    "deletedPost": {
      "id": "uuid",
      "title": "Post Title",
      "author": {...}
    }
  }
}
```

---

### 11. Set/Unset Featured Post
**PUT** `/api/admin/posts/:id/featured`

Mark or unmark a post as featured.

**Request Body:**
```json
{
  "is_featured": true // or false to unmark
}
```

**Restrictions:**
- Only published posts can be featured

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Post marked as featured",
    "post": {...}
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "message": "Unauthorized",
    "code": "UNAUTHORIZED"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "message": "Access denied. Admin only.",
    "code": "FORBIDDEN"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "message": "User not found",
    "code": "NOT_FOUND"
  }
}
```

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "message": "Validation error",
    "code": "VALIDATION_ERROR",
    "details": [...]
  }
}
```

---

## Implementation Details

### Security Features
1. **Role-based Access Control**: All routes protected by `adminOnly` middleware
2. **Admin Protection**: Admins cannot ban/delete other admins
3. **Validation**: Input validation using express-validator
4. **Cascade Delete**: Related data automatically removed when deleting users/posts

### Database Queries
- Uses Sequelize ORM with PostgreSQL
- Implements pagination for large datasets
- Uses case-insensitive search (iLike operator)
- Optimized queries with proper indexing

### Service Layer Architecture
```
Routes (admin.routes.js)
  → Controller (admin.controller.js)
    → Service (admin.service.js)
      → Models (User, Post, etc.)
```

---

## Testing with Swagger

Access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

1. First, authenticate using the `/api/auth/login` endpoint
2. Copy the JWT token from the response
3. Click "Authorize" button in Swagger UI
4. Enter: `Bearer {your_token}`
5. Now you can test all admin endpoints

---

## Example Usage

### Create an Admin User
First, register a normal user and manually update their role in the database:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'admin@example.com';
```

### Ban a User
```bash
curl -X PUT http://localhost:3000/api/admin/users/{userId}/ban \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Spam posting"}'
```

### Get System Stats
```bash
curl http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer {token}"
```

### Search Globally
```bash
curl "http://localhost:3000/api/admin/search?q=javascript&limit=5" \
  -H "Authorization: Bearer {token}"
```

---

## Notes

- All timestamps are in ISO 8601 format
- Pagination starts at page 1
- Default limit is 20 items per page
- Maximum search results per category: 10
- Featured posts limit: 10
- Ban reason maximum length: 500 characters
