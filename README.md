# 🌿 Green Library Management System (Thư viện số)

Chào mừng bạn đến với **Green Library**, một hệ thống quản lý thư viện kỹ thuật số hiện đại, tối giản và hiệu quả. Dự án được xây dựng tập trung vào trải nghiệm người dùng với tông màu Emerald Green (Xanh ngọc lục bảo) sang trọng, mang lại cảm giác tri thức và bền vững.

Đây là đồ án môn học Web Development, xây dựng trên kiến trúc **MVC (Model-View-Controller)** chuyên nghiệp và tích hợp cơ sở dữ liệu đám mây **Firebase**.

---

## ✨ Các Chức Năng Chính

### 📖 Đối mặt Sinh viên (Người mượn)
*   **Đăng ký & Đăng nhập (Auth):** Hệ thống xác thực người dùng qua Email/Mật khẩu lưu trữ trên Firebase Auth.
*   **Duyệt Sách (Catalog):** Giao diện lưới hiện đại, hiển thị sách nổi bật, đánh giá sao (⭐️) và trạng thái sẵn có (Available).
*   **Tạo Phiếu Mượn (SLP):** Sinh viên có thể chọn sách, chọn ngày trả dự kiến và tạo phiếu mượn (Borrow Slip) tự động với mã Slip riêng biệt.
*   **Quản Lý Sách Đang Mượn:** Theo dõi hạn trả sách, trạng thái "Chờ nhận" hoặc "Đã nhận".
*   **Gia hạn Sách (Renew):** Tích hợp công nghệ AJAX giúp gia hạn sách (+14 ngày) tức thì mà không cần tải lại trang.
*   **Lịch sử Mượn Trả:** Lưu giữ hành trình đọc sách của sinh viên, bao gồm cả các phiếu đã trả hoặc đã hủy.
*   **Hồ sơ Cá nhân:** Chỉnh sửa tên, ngành học và ảnh đại diện (Avatar) với cơ chế kiểm soát dữ liệu đầu vào.

### 🛡️ Đối mặt Thủ thư (Admin)
*   **Bảng Điều Khiển (Dashboard):** Thống kê tổng quan về số lượng đầu sách, người dùng, phiếu mượn đang hoạt động và tỷ lệ lưu kho.
*   **Quản Lý Kho Sách (Inventory CRUD):** Thêm, sửa, xóa sách. Khi chỉnh sửa, hệ thống bảo vệ tính toàn vẹn giữa "Số lượng hiện có" và "Tổng số lượng".
*   **Quản Lý Phiếu Mượn (Transactions):**
    *   Xác nhận mượn, xác nhận trả hoặc hủy phiếu.
    *   **Logic Tự Động:** Khi một cuốn sách được trả hoặc phiếu bị hủy, hệ thống tự động cộng trả lại 01 cuốn vào kho sách.
    *   **Tìm kiếm mạnh mẽ:** Tìm kiếm phiếu mượn theo Mã phiếu hoặc MSSV trực tiếp từ cơ sở dữ liệu (Server-side search).
*   **Quản Lý Người Dùng:** Xem danh sách sinh viên đã đăng ký và thông tin chi tiết.

---

## 🛠️ Công Nghệ Sử Dụng

1.  **Backend:** Node.js, Express.js (Runtime & Web Framework).
2.  **Frontend:** EJS (Templating Engine), HTML5, CSS3 (Vanilla Design System).
3.  **Database & Auth:** Google Firebase (Cloud Firestore & Firebase Authentication).
4.  **Bảo mật:**
    *   **Helmet:** Tăng cường bảo mật HTTP headers.
    *   **Session:** Quản lý phiên đăng nhập qua `express-session`.
    *   **Middleware:** Chặn truy cập trái phép vào các trang quản trị (Auth & Role Check).
    *   **Sanitization:** Làm sạch và giới hạn độ dài dữ liệu người dùng nhập vào.
5.  **Fonts & Icons:** Google Fonts (Inter, Outfit), FontAwesome (Iconography).

---

## 🚀 Hướng Dẫn Cài Đặt (Setup Guide)

Khi tải code về từ GitHub, bạn hãy làm theo các bước sau để chạy ứng dụng:

### 1. Cài đặt môi trường
Đảm bảo máy tính của bạn đã cài đặt **Node.js** (Phiên bản 16 trở lên).

### 2. Cài đặt thư viện (Dependencies)
Mở Terminal tại thư mục dự án và chạy lệnh:
```bash
npm install
```

### 3. Cấu hình biến môi trường
1. Copy file `.env.example` và đổi tên thành `.env`.
2. Mở file `.env` và điền các thông tin cần thiết:
   - `SESSION_SECRET`: Một chuỗi ký tự bất kỳ để bảo mật phiên làm việc.
   - `ADMIN_EMAIL`: Email quản trị (Ví dụ: `huuthienk23@gmail.com`).
3. **Kết nối Firebase**:
   - Truy cập Firebase Console, tải file `serviceAccountKey.json` của dự án.
   - Lưu file này vào thư mục `config/` (Hoặc đặt ở thư mục gốc và chỉnh đường dẫn `FIREBASE_SERVICE_ACCOUNT_PATH` trong `.env`).

### 4. Khởi chạy ứng dụng
Chạy lệnh sau để bắt đầu:
```bash
npm start
```
Sau đó, truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Thông Tin Đăng Nhập Kiểm Thử (Test Credentials)

| Vai trò | Email | Mật khẩu | 
| :--- | :--- | :--- | 
| **Thủ thư (Admin)** | `loclock23@gmail.com` | `admin123` | 
| **Sinh viên (User)** | *(Đăng ký tài khoản mới trên giao diện)* | |

---

## 🌟 Tính Năng Mới Nổi Bật (New Features)

-   **G-Bot AI Trợ lý**: Robot hỗ trợ tự động hiện lên sau 5 giây để hướng dẫn mượn sách.
-   **Advanced Search**: Công cụ tìm kiếm đa năng theo Tên sách, Tác giả và Thể loại.
-   **Smart Categorization**: Tự động nhóm sách theo thể loại ngay tại trang chủ.
-   **Custom 404 Page**: Trang báo lỗi mang phong cách "Green Library" chuyên nghiệp.

## 📂 Cấu Trúc Thư Mục

```text
/green-library
│   app.js              # Điểm khởi đầu của Server
│   package.json        # Quản lý thư viện và script
│   serviceAccountKey.json # File khóa kết nối Firebase
│
├───config              # Cấu hình Firebase
├───controllers         # Xử lý logic nghiệp vụ (Admin, Book, Auth)
├───middleware          # Các bộ lọc kiểm soát truy cập
├───models              # Tương tác với cơ sở dữ liệu Firestore
├───public              # File tĩnh (CSS, Hình ảnh)
│   └───css
│           style.css   # Toàn bộ hệ thống Design System
├───routes              # Định tuyến URLs
└───views               # Các trang giao diện EJS
    ├───admin           # Giao diện Thủ thư
    ├───auth            # Giao diện Đăng nhập/Đăng ký
    ├───components      # Các phần dùng chung (Header, Footer)
    └───user            # Giao diện Sinh viên
```


