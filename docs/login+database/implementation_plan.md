# Kế hoạch triển khai Hệ thống Tài khoản & Đồng bộ Dữ liệu

Kế hoạch này vạch ra các bước chi tiết để xây dựng hệ thống tài khoản, cơ sở dữ liệu và API cho ứng dụng Học Từ Vựng.

## 1. So sánh & Lựa chọn Cơ sở dữ liệu (Database)

Vì frontend sẽ được deploy lên Vercel và ứng dụng cần khả năng mở rộng tốt với chi phí thấp (Free tier), dưới đây là so sánh các lựa chọn:

| Tiêu chí | Supabase (PostgreSQL) | Neon PostgreSQL | Firebase Firestore | MongoDB Atlas |
| :--- | :--- | :--- | :--- | :--- |
| **Loại DB** | SQL (Relational) | SQL (Relational) | NoSQL (Document) | NoSQL (Document) |
| **Free Tier** | Tốt (500MB DB) | Rất tốt (0.5GB, 100h compute) | Tốt (1GB, giới hạn read/write) | Tốt (512MB) |
| **Vercel Integration** | Tốt | **Cực kỳ xuất sắc** | Khá | Tốt |
| **Custom Auth (Nickname)** | Cần workaround (fake email) | Tự do thiết kế | Cần nâng cấp gói trả phí để dùng Cloud Functions | Tự do thiết kế |

**Khuyến nghị: Chọn Neon PostgreSQL (hoặc Vercel Postgres - được support bởi Neon) kết hợp với Prisma ORM.**
- **Lý do:** 
  1. Dễ dàng tạo các Serverless API trong thư mục `api/` của Vercel (không cần chuyển sang Next.js).
  2. SQL/Prisma cực kỳ phù hợp để lưu trữ cấu trúc quan hệ rõ ràng (User -> Settings, User -> Progress).
  3. Cho phép tự xây dựng hệ thống Auth linh hoạt bằng Nickname + Password (điều mà Supabase Auth hay Firebase Auth mặc định không hỗ trợ tốt vì chúng ưu tiên Email/Social login).

## 2. Phương án Xác thực (Authentication)

- **Cơ chế:** Dùng **JWT (JSON Web Token)**.
- **Cách lưu trữ an toàn:** Lưu JWT trong **HttpOnly Cookies** thông qua Vercel API Routes.
- **Lý do:** JWT là lựa chọn hoàn hảo cho kiến trúc Serverless (như Vercel API) vì nó phi trạng thái (stateless), không cần query database để xác thực token. HttpOnly cookie giúp chống lại các cuộc tấn công XSS (kẻ gian không thể dùng Javascript đọc được token).
- **Mã hóa Password:** Sử dụng `bcrypt` (hoặc `bcryptjs` để tương thích tốt với môi trường serverless/edge).

## 3. Thiết kế Database Schema (Prisma Schema)

```prisma
model User {
  id        String   @id @default(uuid())
  nickname  String   @unique
  password  String   // Hashed password
  avatar    String?  // URL of avatar

  // Quan hệ 1-1 với Settings
  settings  Settings?

  // Quan hệ 1-N với Tiến độ học
  progress  Progress[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Settings {
  id         String @id @default(uuid())
  userId     String @unique
  user       User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  theme      String @default("light") // "light" | "dark"
  language   String @default("vi")    // "vi" | "en"
  speechRate Float  @default(1.0)
}

model Progress {
  id         String @id @default(uuid())
  userId     String
  user       User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  topicId    Int
  vocabulary String

  createdAt  DateTime @default(now())

  @@unique([userId, topicId, vocabulary]) // Tránh lưu trùng 1 từ nhiều lần
}
```

## 4. Thiết kế API Endpoints (Vercel Serverless Functions)

Tất cả API sẽ đặt trong thư mục `/api/` (Vercel tự động nhận diện thành serverless functions).

- **Auth APIs:**
  - `POST /api/auth/register`: Nhận `nickname`, `password`. Hash mật khẩu, tạo user, trả về user info & set JWT cookie. *(Check lỗi trùng nickname)*.
  - `POST /api/auth/login`: Nhận `nickname`, `password`. Kiểm tra, set JWT cookie. *(Check lỗi sai password/không tồn tại)*.
  - `POST /api/auth/logout`: Xóa JWT cookie.
  - `GET /api/auth/me`: Kiểm tra JWT, trả về thông tin User + Settings + Progress hiện tại. *(Xử lý token hết hạn/chưa đăng nhập)*.
  
- **User APIs:**
  - `PUT /api/user/profile`: Cập nhật `avatar`, `nickname`.

- **Sync APIs:**
  - `PUT /api/sync/settings`: Nhận payload settings mới và cập nhật DB.
  - `POST /api/sync/progress`: Ghi nhận thêm 1 từ (vocabulary) đã học vào topic tương ứng.

## 5. Kế hoạch triển khai (Các bước tích hợp không gây lỗi chức năng cũ)

**Giai đoạn 1: Khởi tạo Backend & API**
1. Cài đặt Prisma, thiết lập Neon PostgreSQL DB, tạo Schema.
2. Viết các Vercel Serverless Functions (`/api/...`) cho Đăng ký, Đăng nhập, và Verify Token. Cài đặt thư viện `jsonwebtoken` và `bcryptjs`.
3. Kiểm thử API qua Postman/Thunder Client.

**Giai đoạn 2: Tích hợp UI Authentication**
1. Tạo trang / Modal Đăng nhập & Đăng ký trên React.
2. Tạo `AuthContext` để quản lý trạng thái đăng nhập của người dùng.
3. Khi khởi động ứng dụng (mount), gọi API `/api/auth/me` để kiểm tra đăng nhập.
   - Nếu lỗi/không có token -> Sử dụng **Guest Mode** (giữ nguyên cách dùng `localStorage` hiện tại).
   - Nếu thành công -> Cập nhật state vào `AuthContext`.

**Giai đoạn 3: Tích hợp Đồng bộ (Sync) dữ liệu**
1. **Tiến độ học (Progress):** Sửa lại logic trong `ProgressContext`.
   - Nếu là Guest: Lưu `localStorage` (như cũ).
   - Nếu là Logged User: Khi `markWordAsLearned` được gọi, ngoài việc update UI, gọi API `POST /api/sync/progress` ngầm (background) để lưu lên server. Khi load ứng dụng lần đầu, lấy toàn bộ progress từ `/api/auth/me` nạp vào state.
2. **Cài đặt (Settings):** Tương tự, sửa logic trong `SettingsContext`. Khi user đổi theme/ngôn ngữ, đồng bộ lên server nếu đã đăng nhập.

**Giai đoạn 4: Tính năng Hồ sơ (Profile)**
1. Cập nhật Sidebar/Header hiển thị Avatar và Nickname khi đã đăng nhập.
2. Tạo giao diện để đổi Avatar (có thể cho phép chọn từ một danh sách các Avatar có sẵn để không phải lo lắng về chi phí lưu trữ file/S3).

---

> [!IMPORTANT]  
> **Quyết định chờ duyệt (User Review Required):**
> 1. Bạn có đồng ý sử dụng kiến trúc **Neon PostgreSQL + Prisma + Vercel Serverless Functions (/api)** như đề xuất không?
> 2. Về phần Avatar, thay vì cho phép upload ảnh (sẽ cần thêm dịch vụ lưu trữ như AWS S3/Cloudinary), ta có thể cung cấp sẵn một danh sách các "Avatar động vật/nhân vật" mặc định để người dùng chọn. Bạn thấy sao về phương án này?

Vui lòng xem xét kế hoạch và đưa ra phản hồi hoặc nhấn **Proceed** nếu bạn đồng ý để tôi tiến hành bước đầu tiên (Giai đoạn 1).
