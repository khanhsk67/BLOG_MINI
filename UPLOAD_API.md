# File Upload API Documentation

## Overview
The MiniBlog API supports file uploads for user avatars and post cover images. Files can be stored locally (development) or on AWS S3 (production).

## Configuration

### Environment Variables
```env
# Base URL for local file access
BASE_URL=http://localhost:3000

# AWS S3 Configuration (Production only)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
```

### Storage Strategy
- **Development**: Files stored locally in `/uploads` directory
- **Production**: Files uploaded to AWS S3 (if credentials configured)

## Upload Specifications

### File Restrictions
- **Allowed Types**: JPEG, JPG, PNG, GIF, WebP
- **Maximum Size**: 5MB per file
- **Max Files** (for multiple upload): 5 files

### Storage Locations
- **Avatars**: `avatars/` folder
- **Post Covers**: `posts/` folder
- **Post Content Images**: `posts/content/` folder

## API Endpoints

### Base URL
```
/api/upload
```

All upload endpoints require authentication (`Authorization: Bearer {token}`)

---

## 1. Upload Avatar

**POST** `/api/upload/avatar`

Upload or update user avatar image.

### Request
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `avatar` (file): Image file

### cURL Example
```bash
curl -X POST http://localhost:3000/api/upload/avatar \
  -H "Authorization: Bearer {token}" \
  -F "avatar=@/path/to/avatar.jpg"
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "avatar_url": "http://localhost:3000/uploads/avatar-1234567890.jpg",
    "user": {
      "id": "user-uuid",
      "username": "johndoe",
      "avatar_url": "http://localhost:3000/uploads/avatar-1234567890.jpg"
    }
  },
  "message": "Avatar uploaded successfully"
}
```

### Notes
- Automatically deletes old avatar when uploading new one
- Updates user profile with new avatar URL
- Returns updated user object

---

## 2. Upload Post Cover Image

**POST** `/api/upload/post-cover`

Upload cover image for a blog post.

### Request
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `cover` (file): Image file

### cURL Example
```bash
curl -X POST http://localhost:3000/api/upload/post-cover \
  -H "Authorization: Bearer {token}" \
  -F "cover=@/path/to/cover.jpg"
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "cover_url": "http://localhost:3000/uploads/cover-1234567890.jpg",
    "file_info": {
      "original_name": "cover.jpg",
      "size": "2.5 MB",
      "mime_type": "image/jpeg"
    }
  },
  "message": "Cover image uploaded successfully"
}
```

### Notes
- Returns the cover URL to use when creating/updating posts
- Can be used standalone or integrated with post creation

---

## 3. Upload Multiple Post Images

**POST** `/api/upload/post-images`

Upload multiple images for post content (e.g., inline images).

### Request
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `images` (file[]): Array of image files (max 5)

### cURL Example
```bash
curl -X POST http://localhost:3000/api/upload/post-images \
  -H "Authorization: Bearer {token}" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.png"
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "image_urls": [
      "http://localhost:3000/uploads/images-1234567890.jpg",
      "http://localhost:3000/uploads/images-1234567891.png"
    ],
    "count": 2,
    "files_info": [
      {
        "original_name": "image1.jpg",
        "size": "1.2 MB",
        "mime_type": "image/jpeg"
      },
      {
        "original_name": "image2.png",
        "size": "890 KB",
        "mime_type": "image/png"
      }
    ]
  },
  "message": "2 image(s) uploaded successfully"
}
```

### Notes
- Upload up to 5 images at once
- Returns array of URLs for embedding in post content
- Useful for rich text editors with image support

---

## 4. Delete Uploaded File

**DELETE** `/api/upload/file`

Delete a previously uploaded file.

### Request
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "file_url": "http://localhost:3000/uploads/image-1234567890.jpg"
}
```

### cURL Example
```bash
curl -X DELETE http://localhost:3000/api/upload/file \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"file_url": "http://localhost:3000/uploads/image-1234567890.jpg"}'
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "message": "File deleted successfully"
  },
  "message": "File deleted successfully"
}
```

### Notes
- Works for both local and S3 stored files
- Returns success even if file doesn't exist
- Use when cleaning up unused uploads

---

## Integration with Posts

### Create Post with Cover Image

**POST** `/api/posts`

You can upload a cover image directly when creating a post.

### Request
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `title` (string): Post title
  - `content` (string): Post content
  - `excerpt` (string, optional): Short description
  - `tags` (array, optional): Array of tags
  - `status` (string, optional): 'draft' or 'published'
  - `cover_image` (file, optional): Cover image file

### cURL Example
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer {token}" \
  -F "title=My Blog Post" \
  -F "content=This is my post content..." \
  -F "excerpt=A short description" \
  -F "tags[]=javascript" \
  -F "tags[]=nodejs" \
  -F "status=published" \
  -F "cover_image=@/path/to/cover.jpg"
```

### Update Post with Cover Image

**PUT** `/api/posts/:id`

Update post and optionally replace cover image.

```bash
curl -X PUT http://localhost:3000/api/posts/{post-id} \
  -H "Authorization: Bearer {token}" \
  -F "title=Updated Title" \
  -F "content=Updated content..." \
  -F "cover_image=@/path/to/new-cover.jpg"
```

### Notes
- Old cover image is automatically deleted when uploading new one
- If no cover_image provided, existing cover remains unchanged
- Cover image is optional for both create and update

---

## Error Responses

### 400 Bad Request - No File
```json
{
  "success": false,
  "error": {
    "message": "No file uploaded",
    "code": "VALIDATION_ERROR"
  }
}
```

### 400 Bad Request - Invalid File Type
```json
{
  "success": false,
  "error": {
    "message": "Invalid file type. Only image/jpeg, image/jpg, image/png, image/gif, image/webp are allowed",
    "code": "VALIDATION_ERROR"
  }
}
```

### 413 Payload Too Large
```json
{
  "success": false,
  "error": {
    "message": "File too large. Maximum size is 5MB",
    "code": "PAYLOAD_TOO_LARGE"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "message": "Failed to upload file to S3",
    "code": "INTERNAL_SERVER_ERROR"
  }
}
```

---

## Frontend Implementation Examples

### JavaScript/Fetch
```javascript
// Upload Avatar
const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch('http://localhost:3000/api/upload/avatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
};

// Create Post with Cover
const createPost = async (postData, coverFile) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('content', postData.content);
  formData.append('status', postData.status);

  if (coverFile) {
    formData.append('cover_image', coverFile);
  }

  postData.tags?.forEach(tag => {
    formData.append('tags[]', tag);
  });

  const response = await fetch('http://localhost:3000/api/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
};
```

### React Example
```jsx
const AvatarUpload = () => {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      console.log('Avatar uploaded:', data.data.avatar_url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleUpload}
    />
  );
};
```

---

## AWS S3 Setup (Production)

### 1. Create S3 Bucket
```bash
aws s3 mb s3://your-miniblog-bucket --region us-east-1
```

### 2. Configure Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-miniblog-bucket/*"
    }
  ]
}
```

### 3. Enable CORS
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 4. Set Environment Variables
```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-miniblog-bucket
NODE_ENV=production
```

---

## Testing with Postman

1. **Select method**: POST
2. **Enter URL**: `http://localhost:3000/api/upload/avatar`
3. **Headers**: Add `Authorization: Bearer {your_token}`
4. **Body**: Select `form-data`
5. **Add field**: Key = `avatar`, Type = `File`, Value = Select file
6. **Send** request

---

## Security Considerations

1. **Authentication Required**: All upload endpoints require valid JWT token
2. **File Type Validation**: Only image types allowed
3. **File Size Limit**: 5MB maximum per file
4. **Virus Scanning**: Consider adding antivirus scanning for production
5. **Rate Limiting**: Apply rate limits to prevent abuse
6. **Storage Quotas**: Implement user storage quotas if needed

---

## Troubleshooting

### Upload Fails with "Cannot read property 'file'"
- Ensure `Content-Type: multipart/form-data` header
- Check field name matches (e.g., 'avatar', 'cover', 'images')

### 413 Payload Too Large
- File exceeds 5MB limit
- Compress image before uploading

### 500 S3 Upload Error
- Verify AWS credentials in `.env`
- Check S3 bucket permissions
- Ensure bucket exists in specified region

### Files Not Accessible
- **Local**: Check `/uploads` directory exists
- **S3**: Verify bucket policy allows public read
- Check BASE_URL in environment variables

---

## Best Practices

1. **Image Optimization**: Compress images before upload
2. **Responsive Images**: Upload multiple sizes for different devices
3. **CDN**: Use CloudFront with S3 for better performance
4. **Cleanup**: Delete unused uploads periodically
5. **Validation**: Validate dimensions on client-side
6. **Progress**: Show upload progress to users
7. **Error Handling**: Implement retry logic for failed uploads
