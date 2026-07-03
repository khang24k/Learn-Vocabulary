# Hoàn tất: Hệ thống Tài khoản & Đồng bộ Dữ liệu

Tôi đã triển khai thành công toàn bộ kiến trúc cho Hệ thống Tài khoản và Đồng bộ dữ liệu theo kế hoạch sử dụng **Neon PostgreSQL + Prisma + Vercel Serverless Functions**.

## Các thay đổi chính đã thực hiện

### 1. Database & Prisma
- Đã cài đặt `prisma`, `@prisma/client`, `@prisma/adapter-pg` và các thư viện hỗ trợ như `bcryptjs`, `jsonwebtoken`.
- Đã tạo `prisma/schema.prisma` với 3 bảng chính: `User`, `Settings`, `Progress`.
- Đã tạo `prisma.config.ts` để tương thích với phiên bản Prisma 7 mới nhất trên môi trường serverless.

### 2. Vercel Serverless APIs
Tất cả API được đặt trong thư mục `api/` để Vercel tự động triển khai thành các Serverless Functions:
- `api/auth/register.ts`: Xử lý đăng ký tài khoản bằng nickname (kiểm tra nickname trùng lặp, mã hóa mật khẩu với `bcrypt`).
- `api/auth/login.ts`: Xác thực đăng nhập và trả về token.
- `api/auth/logout.ts`: Xóa auth token khỏi cookie.
- `api/auth/me.ts`: Trả về thông tin của user hiện tại (kèm theo tiến độ học và cài đặt) dựa trên token.
- `api/user/profile.ts`: Cập nhật nickname và avatar.
- `api/sync/settings.ts`: Lưu cài đặt giao diện (theme, ngôn ngữ, tốc độ đọc) lên database.
- `api/sync/progress.ts`: Lưu tiến độ từng từ vựng đã học thành công lên database.

### 3. Giao diện (UI) & Context
- **AuthContext**: Quản lý trạng thái đăng nhập toàn cục và tự động fetch thông tin người dùng khi mở ứng dụng.
- **AuthModal**: Giao diện Modal nổi bật cho phép Đăng ký / Đăng nhập.
- **ProfileModal**: Giao diện chọn Avatar từ danh sách có sẵn (sử dụng *DiceBear API* để cung cấp avatar vui nhộn) và đổi tên.
- **Sidebar**: Tích hợp nút Đăng nhập hoặc hiển thị thông tin User/Avatar sau khi đăng nhập thành công.
- **Đồng bộ tự động**:
  - `ProgressContext` đã được cấu hình để gửi tiến độ lên API ngay khi một từ mới được học. Khi đăng nhập ở thiết bị khác, hệ thống sẽ gộp (merge) tiến độ học trên server vào local.
  - `SettingsContext` cũng đồng bộ lên server mỗi khi có thay đổi (chuyển theme, đổi ngôn ngữ).

---

> [!IMPORTANT]
> **Hướng dẫn kiểm thử và cấu hình Database**
> 1. Hiện tại code đã hoàn thiện nhưng cần một **Database thực tế (DATABASE_URL)** để hoạt động. Bạn hãy tạo một project trên **Neon.tech** hoặc **Vercel Postgres**.
> 2. Lấy chuỗi kết nối (connection string) và thêm vào file `.env` ở thư mục gốc:
>    ```env
>    DATABASE_URL="postgres://user:password@endpoint-pooler.neon.tech/neondb?sslmode=require"
>    JWT_SECRET="mot-chuoi-bi-mat-bat-ky-cua-ban"
>    ```
> 3. Chạy lệnh sau để khởi tạo các bảng trong Database:
>    ```bash
>    npx prisma db push
>    ```
> 4. Do API dùng Vercel functions (`/api/*`), nếu bạn chạy ở môi trường local bằng `npm run dev` thông thường của Vite thì API sẽ không hoạt động. Để test full cả frontend và backend API ở local, bạn hãy chạy lệnh:
>    ```bash
>    npx vercel dev
>    ```
>    *(Lệnh này yêu cầu đã cài Vercel CLI, nếu chưa hãy chạy `npm i -g vercel`)*.

Nếu bạn gặp bất kỳ vấn đề gì khi thiết lập Database, hãy báo cho tôi biết!
