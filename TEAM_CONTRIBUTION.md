# 👥 Bảng Phân Chia Nhiệm Vụ Nhóm (Team Contribution)

**Vai trò**: Quản lý hạ tầng và luồng dữ liệu chính của ứng dụng.
- **Nhiệm vụ cụ thể**:
  - Khởi tạo Server Express, cấu hình Middleware và tích hợp Router.
  - Kết nối và cấu hình Firebase Admin SDK.
  - Quản lý các biến môi trường (`.env`) và các thư viện phụ thuộc (`package.json`).
- **Các file cần học kỹ**:
  - `app.js` (Tệp khởi đầu của toàn bộ server).
  - `config/firebase.js` (Nơi kết nối Database).
  - `routes/` (Toàn bộ các file định hướng URL).

---

**Vai trò**: Đảm bảo người dùng đăng nhập an toàn và đúng quyền hạn.
- **Nhiệm vụ cụ thể**:
  - Lập trình chức năng Đăng ký tài khoản (lưu vào Firestore).
  - Lập trình Đăng nhập và quản lý Phiên (Session).
  - Viết Middleware để chặn Sinh viên vào trang Quản trị.
- **Các file cần học kỹ**:
  - `controllers/authController.js` (Logic đăng nhập/đăng ký).
  - `middleware/authMiddleware.js` (Logic bảo mật phân quyền).
  - `views/auth/` (Toàn bộ giao diện Login/Register).

---

**Vai trò**: Xây dựng trải nghiệm chính cho người mượn sách.
- **Nhiệm vụ cụ thể**:
  - Lập trình chức năng Tìm kiếm sách nâng cao.
  - Xử lý logic Mượn sách (Borrow) và Gia hạn sách (Renew).
  - Hiển thị Lịch sử mượn trả và Tủ sách cá nhân.
- **Các file cần học kỹ**:
  - `controllers/bookController.js` (Xử lý các hành động của sinh viên).
  - `models/bookModel.js` (Các hàm `borrowBook`, `renewTransaction`, `searchBooks`).
  - `views/user/` (Trang chủ, chi tiết sách, trang gia hạn).

---

**Vai trò**: Xây dựng công cụ quản lý chuyên sâu cho nhân viên thư viện.
- **Nhiệm vụ cụ thể**:
  - Xây dựng Dashboard thống kê kho sách.
  - Lập trình quản trị sách (CRUD: Thêm, sửa, xóa đầu sách).
  - Quản lý phê duyệt và thu hồi sách (Cập nhật trạng thái phiếu mượn).
- **Các file cần học kỹ**:
  - `controllers/adminController.js` (Logic quản trị kho).
  - `views/admin/` (Giao diện Dashboard, bảng quản lý sách).
  - `models/bookModel.js` (Hàm `addBook`, `updateBook`, `updateTransactionStatus`).

---

**Vai trò**: Đảm bảo trang web bóng bẩy, sống động và dễ sử dụng.
- **Nhiệm vụ cụ thể**:
  - Xây dựng Design System (Màu sắc, Typography, Shadows).
  - Lập trình Trợ lý ảo G-Bot (Logic tự động chào và trả lời nhanh).
  - Thiết kế các thành phần dùng chung (Header, Footer, Alerts).
  - Xử lý trang lỗi 404 tùy chỉnh.
- **Các file cần học kỹ**:
  - `public/css/style.css` (Linh hồn của giao diện).
  - `views/components/chatbox.ejs` (Logic của G-Bot).
  - `views/components/alerts.ejs` & `views/error.ejs`.

---


1.  **Thành viên 01 & 02** học cùng nhau vì nó liên quan đến cấu trúc.
2.  **Thành viên 03 & 04** là người nắm giữ Logic nghiệp vụ, cần thảo luận kỹ về Database.
3.  **Thành viên 05** nên kiểm tra lại hiển thị của tất cả các file EJS sau khi chỉnh sửa CSS.
