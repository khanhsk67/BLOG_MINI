# Báo cáo Chi tiết Chức năng Web Project Blog_Mini

## 1. Quản lý Tài khoản & Xác thực (Authentication & Security)
Hệ thống cung cấp quy trình bảo mật chặt chẽ để quản lý danh tính người dùng.
*   **Đăng ký thành viên**:
    *   Hỗ trợ tạo tài khoản với các trường thông tin chi tiết: Email, Username, Mật khẩu và Tên hiển thị.
    *   Tự động kiểm tra tính hợp lệ của mật khẩu (độ dài tối thiểu, ký tự đặc biệt) để đảm bảo an toàn.
*   **Đăng nhập & Xác thực**:
    *   Cơ chế đăng nhập bảo mật sử dụng JWT (JSON Web Token).
    *   Hệ thống tự động quản lý phiên làm việc thông qua Access Token và Refresh Token, giúp người dùng duy trì trạng thái đăng nhập mà không cần nhập lại mật khẩu liên tục.
*   **Quản lý phiên**:
    *   Tự động điều hướng bảo vệ các trang yêu cầu quyền truy cập (Protected Routes).
    *   Chức năng Đăng xuất an toàn, xóa toàn bộ token khỏi thiết bị.

## 2. Quản lý Bài viết & Nội dung (Content Management System)
Chức năng cốt lõi cho phép người dùng sáng tạo và quản lý nội dung số.
*   **Soạn thảo & Đăng tải**:
    *   Hỗ trợ trình soạn thảo văn bản phong phú (Rich Text/Markdown).
    *   Cho phép đính kèm ảnh bìa (Featured Image) và gắn thẻ (Tags) để phân loại nội dung.
*   **Quản lý trạng thái**:
    *   Hỗ trợ lưu nháp (Draft) hoặc xuất bản công khai (Published).
    *   Người dùng có thể Chỉnh sửa (Edit) hoặc Xóa (Delete) bài viết đã đăng.
*   **Hiển thị thông minh**:
    *   Phân trang (Pagination) tự động cho danh sách bài viết.
    *   Sắp xếp bài viết theo các tiêu chí: Mới nhất, Phổ biến nhất, hoặc Theo xu hướng.

## 3. Tương tác Cộng đồng (Community Engagement)
Thúc đẩy sự trao đổi và kết nối giữa các thành viên.
*   **Bình luận đa cấp**:
    *   Cho phép người dùng để lại ý kiến dưới bài viết.
    *   Hỗ trợ trả lời (Reply) trực tiếp vào bình luận của người khác (Nested Comments).
*   **Biểu đạt cảm xúc**:
    *   Hệ thống ghi nhận lượt Thích (Like) cho bài viết.
    *   Hiển thị bộ đếm tương tác (số lượt xem, lượt thích, lượt bình luận) theo thời gian thực.

## 4. Mạng xã hội & Kết nối (Social Connectivity)
Xây dựng mạng lưới người dùng và luồng thông tin cá nhân hóa.
*   **Hệ thống Theo dõi (Follow System)**:
    *   Người dùng có thể "Theo dõi" (Follow) các tác giả yêu thích.
    *   Quản lý danh sách "Đang theo dõi" (Following) và "Người theo dõi" (Followers).
*   **Bảng tin Cá nhân hóa (Personalized Feed)**:
    *   Trang chủ tự động tổng hợp bài viết mới từ những người mà bạn đang theo dõi.
    *   Giúp người dùng không bỏ lỡ nội dung từ cộng đồng quan tâm.

## 5. Tiện ích & Cá nhân hóa (Utilities & Personalization)
Các công cụ bổ trợ giúp nâng cao trải nghiệm sử dụng.
*   **Lưu trữ cá nhân (Bookmarks)**:
    *   Chức năng "Lưu bài viết" giúp người dùng tạo kho lưu trữ kiến thức riêng để đọc lại sau.
*   **Tìm kiếm & Khám phá**:
    *   Bộ lọc tìm kiếm thông minh theo Từ khóa hoặc Tags.
    *   Trang "Khám phá" (Explore) đề xuất các nội dung đang thịnh hành.
*   **Thông báo (Notifications)**:
    *   Cập nhật tức thì khi có người tương tác với bài viết hoặc theo dõi tài khoản của bạn.

## 6. Giao diện & Trải nghiệm người dùng (UX/UI Experience)
Tối ưu hóa khả năng hiển thị và tương tác người dùng.
*   **Giao diện thích ứng (Responsive Design)**:
    *   Thiết kế tương thích hoàn hảo trên mọi thiết bị: Desktop, Tablet, và Mobile.
*   **Chế độ Giao diện (Theming)**:
    *   Hỗ trợ chuyển đổi linh hoạt giữa Chế độ Sáng (Light Mode) và Chế độ Tối (Dark Mode) phục vụ nhu cầu đọc trong các điều kiện ánh sáng khác nhau.

