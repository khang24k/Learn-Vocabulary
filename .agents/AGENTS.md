# Cấu hình Agent cho dự án HocTuVung

<RULE[vite_typescript]>
**QUAN TRỌNG:** Trong dự án Vite + React + TypeScript này, mỗi khi bạn (Agent) import một `Type` hoặc `Interface` từ một file khác, bạn bắt buộc PHẢI sử dụng cú pháp `import type { ... }` hoặc `import { type ... }`.
Tuyệt đối không được dùng `import { ... }` thông thường cho Type/Interface. 
Lý do: Trình biên dịch esbuild của Vite sẽ loại bỏ các interface nhưng lại để lại dòng import thông thường, gây ra lỗi màn hình trắng (Uncaught SyntaxError: does not provide an export named).
</RULE[vite_typescript]>

<RULE[tailwind_darkmode_responsive]>
- Luôn luôn ưu tiên thiết kế Responsive (tương thích cả Mobile và Desktop).
- Mọi component UI mới phải hỗ trợ Dark Mode bằng cách tích hợp trực tiếp các class `dark:` của Tailwind CSS (ví dụ: `bg-white dark:bg-slate-800`).
</RULE[tailwind_darkmode_responsive]>

<RULE[i18n_translation]>
- Mọi chuỗi văn bản (text) hiển thị cho người dùng phải được định nghĩa trong `src/utils/i18n.ts` và sử dụng thông qua hook `useSettings().t`.
- Không được code cứng (hardcode) tiếng Việt hoặc tiếng Anh trực tiếp vào mã nguồn HTML/TSX trừ khi đó là văn bản dùng một lần không cần quốc tế hóa.
</RULE[i18n_translation]>

<RULE[react_scroll_restoration]>
**QUAN TRỌNG:** Khi thực hiện tính năng khôi phục vị trí cuộn (scroll restoration) trong React:
- TUYỆT ĐỐI KHÔNG SỬ DỤNG `useEffect` kết hợp với `setTimeout` để cuộn, vì điều này sẽ gây ra hiện tượng chớp màn hình (flash) hoặc trượt (giật) khó chịu cho người dùng.
- BẮT BUỘC SỬ DỤNG `useLayoutEffect` để gọi hàm `scrollTo()` (ví dụ: `element.scrollTo({ top: position, behavior: 'instant' })`). Thao tác này đảm bảo vị trí cuộn được thiết lập đồng bộ trước khi trình duyệt vẽ (paint) màn hình, giúp trải nghiệm khôi phục trang hoàn toàn tức thì và mượt mà.
</RULE[react_scroll_restoration]>
