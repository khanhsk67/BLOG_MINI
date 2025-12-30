# Database Setup Guide - PostgreSQL

## 🗄️ Database đã được cấu hình: PostgreSQL

Backend của bạn đã được setup sẵn với **PostgreSQL** + **Sequelize ORM**.

---

## 📋 Yêu cầu

- **PostgreSQL** version 12 trở lên
- **Node.js** version 14 trở lên

---

## 🚀 Hướng dẫn cài đặt PostgreSQL

### Option 1: Cài đặt PostgreSQL trên Windows (Recommended)

#### Bước 1: Download PostgreSQL
1. Truy cập: https://www.postgresql.org/download/windows/
2. Download PostgreSQL Installer
3. Chọn version mới nhất (16.x hoặc 15.x)

#### Bước 2: Cài đặt
1. Chạy installer
2. Chọn components:
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4 (GUI tool)
   - ✅ Command Line Tools
3. Chọn thư mục cài đặt (mặc định: `C:\Program Files\PostgreSQL\16`)
4. **QUAN TRỌNG**: Nhập password cho user `postgres` (ghi nhớ password này!)
5. Port: `5432` (default)
6. Locale: Default locale
7. Click Next → Install

#### Bước 3: Kiểm tra cài đặt
```bash
# Mở Command Prompt/PowerShell
psql --version
# Output: psql (PostgreSQL) 16.x
```

---

### Option 2: Sử dụng Docker (Nhanh hơn)

```bash
# Pull PostgreSQL image
docker pull postgres:16-alpine

# Run PostgreSQL container
docker run --name miniblog-postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=miniblog_dev \
  -p 5432:5432 \
  -d postgres:16-alpine

# Kiểm tra container
docker ps
```

---

## 🔧 Tạo Database cho MiniBlog

### Cách 1: Sử dụng pgAdmin (GUI)

1. Mở **pgAdmin 4**
2. Kết nối tới PostgreSQL Server:
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: (password bạn đã nhập khi cài đặt)

3. Right-click **Databases** → **Create** → **Database**
4. Điền thông tin:
   - Database name: `miniblog_dev`
   - Owner: `postgres`
5. Click **Save**

### Cách 2: Sử dụng Command Line (psql)

```bash
# Kết nối vào PostgreSQL
psql -U postgres

# Nhập password khi được hỏi

# Tạo database
CREATE DATABASE miniblog_dev;

# Kiểm tra database đã tạo
\l

# Thoát
\q
```

### Cách 3: Sử dụng SQL Client (DBeaver/DataGrip)

1. Download **DBeaver** (Free): https://dbeaver.io/download/
2. Create new connection → PostgreSQL
3. Điền thông tin:
   - Host: `localhost`
   - Port: `5432`
   - Database: `postgres`
   - Username: `postgres`
   - Password: (your password)
4. Test Connection → OK
5. Right-click → Create Database → `miniblog_dev`

---

## ⚙️ Cấu hình Backend

### Bước 1: Cập nhật file `.env`

Mở file `.env` trong thư mục backend và cập nhật:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog_dev
DB_USER=postgres
DB_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE  # ⚠️ Thay bằng password thật
```

**Lưu ý quan trọng:**
- ⚠️ Thay `YOUR_ACTUAL_PASSWORD_HERE` bằng password PostgreSQL thật của bạn
- Đảm bảo `DB_NAME` là `miniblog_dev` (hoặc tên database bạn đã tạo)

### Bước 2: Kiểm tra kết nối

```bash
# Từ thư mục backend
npm run dev
```

**Kết quả mong đợi:**
```
✅ Database connection established successfully.
📊 Database synced in development mode
🚀 Server started successfully!
📡 Environment: development
🌐 Server running on port 3000
📍 API endpoint: http://localhost:3000/api
💚 Health check: http://localhost:3000/api/health
```

**Nếu có lỗi:**
```
❌ Unable to connect to the database: password authentication failed for user "postgres"
```
→ Kiểm tra lại password trong `.env`

---

## 📊 Database Schema

### Auto-sync Tables (Development Mode)

Khi chạy `npm run dev`, Sequelize sẽ **tự động tạo tables** dựa trên models:

**9 Tables sẽ được tạo:**
1. `users` - User accounts
2. `posts` - Blog posts
3. `comments` - Comments with nested replies
4. `reactions` - Likes
5. `tags` - Post tags
6. `post_tags` - Post-Tag relationship (many-to-many)
7. `follows` - User follow system
8. `notifications` - Notification system
9. `saved_posts` - Bookmarked posts

### Xem Tables đã tạo

#### pgAdmin:
1. Mở pgAdmin → `miniblog_dev` → Schemas → public → Tables

#### psql:
```bash
psql -U postgres -d miniblog_dev

# Xem danh sách tables
\dt

# Xem cấu trúc table
\d users
\d posts

# Thoát
\q
```

#### DBeaver:
1. Expand `miniblog_dev` → Schemas → public → Tables

---

## 🧪 Test Database

### Test 1: Kiểm tra Health Check
```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-12-30T00:00:00.000Z",
  "environment": "development"
}
```

### Test 2: Đăng ký user mới
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "display_name": "Test User"
  }'
```

### Test 3: Kiểm tra data trong database

```sql
-- Kết nối vào database
psql -U postgres -d miniblog_dev

-- Kiểm tra user vừa tạo
SELECT * FROM users;

-- Kiểm tra tổng số records
SELECT
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM posts) as total_posts,
  (SELECT COUNT(*) FROM comments) as total_comments;

-- Thoát
\q
```

---

## 🔄 Database Operations

### Sync Database (Development)

Backend tự động sync database khi start:
```javascript
// src/app.js (line 88-91)
if (process.env.NODE_ENV === 'development') {
  await syncDatabase({ alter: true });
  console.log('📊 Database synced in development mode');
}
```

**Modes:**
- `alter: true` - Cập nhật tables mà không xóa data (safe)
- `force: true` - Xóa và tạo lại tất cả tables (⚠️ mất hết data!)

### Reset Database (Xóa hết data)

**⚠️ CẢNH BÁO: Lệnh này xóa TOÀN BỘ data!**

```bash
# Kết nối vào PostgreSQL
psql -U postgres -d miniblog_dev

# Xóa tất cả tables
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

# Grant permissions
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

# Thoát
\q

# Restart backend để tạo lại tables
npm run dev
```

### Backup Database

```bash
# Backup database
pg_dump -U postgres miniblog_dev > backup.sql

# Restore database
psql -U postgres miniblog_dev < backup.sql
```

---

## 🛠️ Troubleshooting

### Lỗi 1: "password authentication failed"
```
❌ Unable to connect to the database: password authentication failed for user "postgres"
```

**Giải pháp:**
1. Kiểm tra password trong `.env`
2. Reset password PostgreSQL:
   ```bash
   # Windows (Run as Administrator)
   psql -U postgres
   ALTER USER postgres WITH PASSWORD 'new_password';
   ```
3. Cập nhật `.env` với password mới

### Lỗi 2: "database does not exist"
```
❌ Unable to connect to the database: database "miniblog_dev" does not exist
```

**Giải pháp:**
```bash
psql -U postgres
CREATE DATABASE miniblog_dev;
\q
```

### Lỗi 3: "could not connect to server"
```
❌ Unable to connect to the database: could not connect to server: Connection refused
```

**Giải pháp:**
1. Kiểm tra PostgreSQL đang chạy:
   ```bash
   # Windows
   services.msc
   # Tìm "PostgreSQL" service → Start

   # Linux/Mac
   sudo service postgresql status
   sudo service postgresql start
   ```

2. Kiểm tra port 5432:
   ```bash
   netstat -an | findstr 5432
   ```

### Lỗi 4: "port 5432 is already in use"

**Giải pháp:**
1. Đổi port trong `.env`:
   ```env
   DB_PORT=5433
   ```
2. Hoặc stop service đang dùng port 5432

### Lỗi 5: Tables không được tạo

**Giải pháp:**
1. Kiểm tra logs khi start server
2. Check models có lỗi syntax không
3. Force sync (⚠️ xóa data):
   ```javascript
   // Tạm thời thay đổi src/app.js
   await syncDatabase({ force: true });
   ```

---

## 📚 Tools Hữu Ích

### 1. pgAdmin 4 (Included)
- GUI tool chính thức của PostgreSQL
- Quản lý database, tables, queries
- **Location**: Start Menu → PostgreSQL → pgAdmin 4

### 2. DBeaver (Recommended)
- Free, cross-platform
- Support nhiều databases
- Download: https://dbeaver.io/download/

### 3. DataGrip (Paid)
- Powerful IDE for databases
- JetBrains product
- https://www.jetbrains.com/datagrip/

### 4. VS Code Extensions
- **PostgreSQL** by Chris Kolkman
- **Database Client** by Weijan Chen

---

## 🎯 Next Steps

Sau khi setup database xong:

1. ✅ Kiểm tra kết nối: `npm run dev`
2. ✅ Test API qua Swagger: http://localhost:3000/api-docs
3. ✅ Register user mới
4. ✅ Login và lấy token
5. ✅ Test tạo post, comment, like

---

## 📝 Database Configuration Summary

```env
# Development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog_dev
DB_USER=postgres
DB_PASSWORD=your_password

# Production (Example)
DB_HOST=your-prod-host.com
DB_PORT=5432
DB_NAME=miniblog_prod
DB_USER=miniblog_user
DB_PASSWORD=strong_password_here
```

---

## 🔒 Security Best Practices

### Development
- ✅ Sử dụng password mạnh cho PostgreSQL
- ✅ Không commit file `.env` vào git
- ✅ Backup database thường xuyên

### Production
- 🔒 Sử dụng SSL/TLS cho database connection
- 🔒 Restrict database access (whitelist IPs)
- 🔒 Use environment variables (không hardcode)
- 🔒 Regular backups
- 🔒 Monitoring & alerts

---

## ❓ FAQs

**Q: Tôi có thể dùng MySQL thay vì PostgreSQL không?**
A: Có, nhưng cần sửa code:
1. Đổi `dialect: 'postgres'` → `dialect: 'mysql'` trong `src/config/database.js`
2. Install `mysql2`: `npm install mysql2`
3. Tạo database MySQL
4. Update `.env` với MySQL credentials

**Q: Dữ liệu có bị mất khi restart server không?**
A: Không, data được lưu trong PostgreSQL database, không bị mất.

**Q: Làm sao để xem queries SQL được execute?**
A: Set `logging: console.log` trong `src/config/database.js` hoặc set `NODE_ENV=development` trong `.env`

**Q: Database có tự động tạo sample data không?**
A: Không, bạn cần tự tạo data qua API hoặc seed scripts.

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs khi start server
2. Xem PostgreSQL logs
3. Test connection với pgAdmin
4. Check firewall/antivirus

---

**Last Updated**: December 30, 2025
**Database Version**: PostgreSQL 16.x
**ORM**: Sequelize 6.37.7
