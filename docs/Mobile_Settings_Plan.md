# Kế hoạch triển khai: Nâng cấp Mobile & Trang Cài Đặt

Để đáp ứng yêu cầu tối ưu trên điện thoại và thêm các tính năng cài đặt toàn cục, tôi đề xuất kiến trúc sau:

## 1. Nâng cấp Giao diện Mobile (Responsive Layout)

- **Vấn đề hiện tại:** Sidebar chiếm không gian ngang cố định, gây chật chội trên màn hình điện thoại (dưới 768px).
- **Giải pháp đề xuất:**
  - Thêm một thanh **Top Header** (chỉ hiển thị trên Mobile) chứa nút Hamburger (Menu).
  - Biến **Sidebar** thành dạng Off-canvas (trượt ra từ bên trái) trên màn hình nhỏ và có lớp nền mờ (Overlay) ở dưới.
  - Trên màn hình lớn (Desktop), Sidebar vẫn giữ nguyên hành vi hiển thị cố định bên trái có thể thu gọn.

## 2. Quản lý trạng thái Cài Đặt Toàn Cục (Settings Context)

Sẽ tạo một thư mục `src/contexts/SettingsContext.tsx` để lưu trữ cài đặt bằng React Context và `localStorage` (giúp giữ lại cài đặt sau khi reload trang).

**Các cấu hình bao gồm:**
- `theme`: `'light' | 'dark'`
- `language`: `'vi' | 'en'`
- `speechRate`: `number` (từ 0.5 đến 2.0)

## 3. Cập nhật Dark Mode (Giao diện Sáng/Tối)

Sử dụng tính năng `dark mode` của Tailwind CSS.
- Sửa lại `src/index.css` để thêm custom variant hỗ trợ chuyển đổi class `.dark`.
- Áp dụng các class `dark:bg-slate-900`, `dark:text-white`... vào tất cả component (`MainLayout`, `Sidebar`, `TopicList`, `VocabularyCard`, v.v.).

## 4. Áp dụng Tốc độ phát âm (Speech Rate)

- Cập nhật custom hook `useSpeechSynthesis.ts` để đọc giá trị `speechRate` từ `SettingsContext` và gán vào `utterance.rate`.

## 5. Tùy chọn Ngôn ngữ (Localization)

- Tạo một file `src/utils/i18n.ts` chứa từ điển đơn giản (Ví dụ: `translations = { vi: { title: "Học Từ Vựng" }, en: { title: "Vocabulary" } }`).
- Áp dụng vào Sidebar, Tiêu đề, và phần Cài đặt.

## 6. Trang Cài Đặt (Settings Page)

- Thêm một Route mới `/settings`.
- Thêm một mục "Cài đặt" (Settings) ở dưới cùng của Sidebar.
- Giao diện `SettingsPage.tsx` bao gồm:
  - Khối thay đổi ngôn ngữ (Radio buttons hoặc Select).
  - Khối chỉnh Theme (Sáng/Tối).
  - Khối chỉnh Tốc độ đọc (Slider/Range input từ 0.5 đến 2.0).

---
> [!IMPORTANT]
> Việc áp dụng Dark Mode sẽ yêu cầu tôi phải xem xét lại hệ thống màu sắc hiện tại của Tailwind trong từng file component. Quá trình này sẽ mất một chút thời gian để đảm bảo độ tương phản (contrast) giữa các thành phần giao diện không bị phá vỡ.

Vui lòng bấm **Proceed** nếu bạn đồng ý với kế hoạch này, tôi sẽ tiến hành viết code ngay!
