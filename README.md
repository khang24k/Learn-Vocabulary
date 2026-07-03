# Learn Vocabulary Web App

Ứng dụng web giúp bạn học từ vựng tiếng Anh hiệu quả qua các chủ đề đa dạng, kết hợp luyện nghe và phát âm.
Được xây dựng với giao diện hiện đại, tối ưu trải nghiệm người dùng cùng hệ thống lưu trữ đồng bộ trên Cloud.

🌐 **Demo trực tuyến:** [https://learn-vocabulary-lake.vercel.app/](https://learn-vocabulary-lake.vercel.app/)

## 🚀 Công nghệ sử dụng
- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Backend/API:** Vercel Serverless Functions
- **Database:** Prisma ORM, PostgreSQL

## 🛠️ Hướng dẫn cài đặt và chạy Local

**1. Cài đặt các thư viện phụ thuộc**
```bash
npm install
```

**2. Cấu hình biến môi trường**
Tạo file `.env` ở thư mục gốc của dự án và khai báo các thông tin kết nối Database:
```env
DATABASE_URL="chuỗi_kết_nối_postgres_của_bạn(prj này mình sử dụng Neon)"
JWT_SECRET="khóa_bí_mật_cho_jwt(tùy chọn ngẫu nhiên)"
```

**3. Khởi chạy dự án**
Vì dự án có sử dụng API backend (Serverless Functions), bạn cần chạy thông qua lệnh của Vercel thay vì lệnh `npm run dev` thông thường:
```bash
npx vercel dev
```
*(Nếu chưa cài Vercel CLI, hệ thống sẽ tự động tải xuống. Bạn có thể truy cập `http://localhost:3000` sau khi server khởi động xong).*
