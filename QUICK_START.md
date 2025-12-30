# Quick Start Guide - MiniBlog Backend

## 🚀 Bắt đầu nhanh (5 phút)

### Bước 1: Tạo Database với pgAdmin 4

1. **Mở pgAdmin 4**
   - Tìm pgAdmin 4 trong Start Menu
   - Nhập Master Password (nếu được hỏi)

2. **Kết nối PostgreSQL Server**
   - Mở rộng tree bên trái: `Servers` → `PostgreSQL 16` (hoặc version bạn có)
   - Nhập password nếu được hỏi

3. **Tạo Database mới**
   - Right-click vào **Databases**
   - Chọn **Create** → **Database...**
   - Điền thông tin:
     ```
     Database name: miniblog_dev
     Owner: postgres
     ```
   - Click **Save**

✅ Database đã được tạo!

---

### Bước 2: Cập nhật file `.env`

Mở file `.env` trong thư mục backend và kiểm tra/cập nhật:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog_dev
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRESQL_PASSWORD  # ⚠️ Thay bằng password thật
```

**Lưu ý:**
- `DB_PASSWORD` phải là password bạn đặt khi cài PostgreSQL
- Nếu quên password, có thể reset trong pgAdmin

---

### Bước 3: Cài dependencies (nếu chưa)

```bash
cd c:\Blog_mini_WebProject\blog-mini-backend
npm install
```

---

### Bước 4: Chạy Backend

```bash
npm run dev
```

**Kết quả mong đợi:**

```
✅ Database connection established successfully.
📊 Database synced in development mode
✅ Database synchronized successfully.
🚀 Server started successfully!
📡 Environment: development
🌐 Server running on port 3000
📍 API endpoint: http://localhost:3000/api
💚 Health check: http://localhost:3000/api/health
```

✅ **Backend đã chạy thành công!**

---

### Bước 5: Kiểm tra Tables đã tạo

**Trong pgAdmin 4:**
1. Mở rộng: `Databases` → `miniblog_dev` → `Schemas` → `public` → `Tables`
2. Bạn sẽ thấy 9 tables:
   - `comments`
   - `follows`
   - `notifications`
   - `post_tags`
   - `posts`
   - `reactions`
   - `saved_posts`
   - `tags`
   - `users`

---

### Bước 6: Test API

#### Test 1: Health Check
Mở browser: http://localhost:3000/api/health

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-12-30T...",
  "environment": "development"
}
```

#### Test 2: Swagger Docs
Mở browser: http://localhost:3000/api-docs

Bạn sẽ thấy giao diện Swagger với tất cả API endpoints.

#### Test 3: Đăng ký User mới

**Trong Swagger:**
1. Mở endpoint: `POST /api/auth/register`
2. Click **Try it out**
3. Điền JSON:
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "display_name": "Administrator"
}
```
4. Click **Execute**

**Response 201:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid...",
      "username": "admin",
      "email": "admin@example.com",
      "display_name": "Administrator",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  },
  "message": "User registered successfully"
}
```

#### Test 4: Kiểm tra User trong Database

**Trong pgAdmin 4:**
1. Right-click table `users` → **View/Edit Data** → **All Rows**
2. Bạn sẽ thấy user vừa tạo!

---

## 🎉 Hoàn thành!

Backend đã sẵn sàng với:
- ✅ Database PostgreSQL kết nối thành công
- ✅ 9 tables tự động tạo
- ✅ API server chạy trên port 3000
- ✅ Swagger docs tại /api-docs
- ✅ User registration hoạt động

---

## 🔧 Troubleshooting

### ❌ Lỗi: "password authentication failed"

**Nguyên nhân:** Password trong `.env` không đúng

**Giải pháp:**
1. Mở pgAdmin 4
2. Right-click `PostgreSQL 16` server → **Properties** → **Connection**
3. Xem password đang dùng
4. Hoặc reset password:
   ```sql
   -- Trong pgAdmin, Tools → Query Tool
   ALTER USER postgres WITH PASSWORD 'new_password';
   ```
5. Cập nhật `.env` với password mới

### ❌ Lỗi: "database does not exist"

**Giải pháp:**
- Kiểm tra lại đã tạo database `miniblog_dev` chưa
- Hoặc tạo lại theo Bước 1

### ❌ Lỗi: "port 3000 already in use"

**Giải pháp:**
- Đổi port trong `.env`:
  ```env
  PORT=3001
  ```
- Hoặc stop process đang dùng port 3000

---

## 📚 Next Steps

1. **Tạo Admin User:**
   ```sql
   -- Trong pgAdmin, Tools → Query Tool, chọn database miniblog_dev
   UPDATE users
   SET role = 'admin'
   WHERE email = 'admin@example.com';
   ```

2. **Test Admin Endpoints:**
   - Login với admin account
   - Copy `accessToken`
   - Trong Swagger, click **Authorize**, nhập: `Bearer {token}`
   - Test các admin endpoints

3. **Tạo Post mẫu:**
   - Login
   - POST /api/posts
   - Upload ảnh cover (optional)

4. **Test tất cả features:**
   - Comment
   - Like
   - Follow
   - Notifications
   - Save posts

---

## 📖 Documentation

- **Complete API Guide**: [API_ENDPOINTS.md](./API_ENDPOINTS.md)
- **Admin Panel Guide**: [ADMIN_API.md](./ADMIN_API.md)
- **Upload Guide**: [UPLOAD_API.md](./UPLOAD_API.md)
- **Database Setup**: [DATABASE_SETUP.md](./DATABASE_SETUP.md)
- **Main README**: [README.md](./README.md)

---

## 🎯 Available NPM Scripts

```bash
npm start      # Production mode
npm run dev    # Development with auto-reload
npm test       # Run tests (not implemented yet)
```

---

**Happy Coding! 🚀**
