---
name: Hoctuvung Component Builder
description: Hướng dẫn tiêu chuẩn để tạo các Component UI mới trong dự án học từ vựng (React, Tailwind v4, i18n).
---

# Hoctuvung Component Builder

Mỗi khi bạn được yêu cầu xây dựng một Component mới cho dự án này, hãy tuân theo các bước và cấu trúc chuẩn sau:

## 1. Import Types an toàn
Luôn sử dụng `import type` cho các Interfaces/Types.
```tsx
// SAI:
// import { Word } from '../../types';

// ĐÚNG:
import type { Word } from '../../types';
```

## 2. Sử dụng Settings Context (i18n & Theme)
Sử dụng custom hook `useSettings()` để lấy các cấu hình toàn cục.
```tsx
import { useSettings } from '../../contexts/SettingsContext';

export const MyComponent = () => {
  const { t, theme } = useSettings();
  
  return (
    <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
      {t.myTranslationKey}
    </div>
  );
}
```

## 3. Responsive & Dark Mode
- Component phải tự điều chỉnh kích thước cho màn hình di động (sử dụng `flex-col sm:flex-row`, v.v.).
- Mọi màu sắc đều phải có biến thể `dark:` đi kèm để đảm bảo giao diện Sáng/Tối hoạt động mượt mà. Đề xuất sử dụng màu `slate` cho các khối nền.

## 4. Xử lý Speech (Phát âm và Thu âm)
- Nếu cần phát âm: Dùng `const { speak } = useSpeechSynthesis();`
- Nếu cần thu âm: Dùng `const { startRecording, stopRecording, transcript, isRecording } = useSpeechRecognition();`
