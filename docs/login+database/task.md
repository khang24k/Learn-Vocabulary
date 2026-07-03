# Hệ thống Tài khoản & Đồng bộ Dữ liệu

- `[x]` Giai đoạn 1: Khởi tạo Backend & API
  - `[x]` Cài đặt Prisma và các thư viện cần thiết (`bcryptjs`, `jsonwebtoken`, `cookie`).
  - `[x]` Khởi tạo Prisma Schema và kết nối DB.
  - `[x]` Tạo API `POST /api/auth/register`.
  - `[x]` Tạo API `POST /api/auth/login`.
  - `[x]` Tạo API `POST /api/auth/logout`.
  - `[x]` Tạo API `GET /api/auth/me`.
  - `[x]` Tạo API `PUT /api/user/profile`.
  - `[x]` Tạo API `PUT /api/sync/settings`.
  - `[x]` Tạo API `POST /api/sync/progress`.

- `[x]` Giai đoạn 2: Tích hợp UI Authentication
  - `[x]` Tạo `AuthContext` quản lý state đăng nhập.
  - `[x]` Xây dựng UI Form Đăng nhập / Đăng ký.
  - `[x]` Kiểm tra lấy thông tin đăng nhập khi mở app.

- `[x]` Giai đoạn 3: Tích hợp Đồng bộ (Sync) dữ liệu
  - `[x]` Cập nhật `ProgressContext` gọi API khi user đăng nhập.
  - `[x]` Cập nhật `SettingsContext` đồng bộ dữ liệu.

- `[x]` Giai đoạn 4: Tính năng Hồ sơ (Profile)
  - `[x]` Hiển thị Avatar & Nickname trên Sidebar.
  - `[x]` Tạo giao diện chọn Avatar mặc định.
