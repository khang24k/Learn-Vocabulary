# Kế hoạch triển khai: Ứng dụng Học Từ Vựng Tiếng Anh (Vite + React + TS)

Ứng dụng web luyện nghe và kiểm tra phát âm Tiếng Anh sử dụng **React, TypeScript, Tailwind CSS** và tích hợp **Web Speech API**. 

## 1. Cấu trúc thư mục dự án (Project Structure)

Dự án sẽ được khởi tạo bằng Vite (`npx create-vite hoctuvung-web --template react-ts`) với cấu trúc phân lớp rõ ràng:

```text
hoctuvung-web/
├── public/
│   └── data.json               # Nguồn dữ liệu từ vựng (tổng hợp từ 27 chủ đề)
├── src/
│   ├── types/
│   │   └── index.ts            # Định nghĩa Interface/Type (Topic, Word)
│   ├── hooks/
│   │   ├── useSpeechRecognition.ts  # Custom hook cho Speech-to-Text (Micro)
│   │   └── useSpeechSynthesis.ts    # Custom hook cho Text-to-Speech (Loa)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx  # Layout chính (bao bọc toàn bộ app)
│   │   │   └── Sidebar.tsx     # Thanh điều hướng có thể thu gọn
│   │   ├── vocabulary/
│   │   │   ├── TopicList.tsx   # Hiển thị danh sách 27 chủ đề (Grid)
│   │   │   ├── TopicDetail.tsx # Danh sách từ vựng của 1 chủ đề
│   │   │   └── VocabularyCard.tsx # Thẻ từ vựng (Logic phát âm/thu âm chính)
│   │   └── common/
│   │       └── SearchBar.tsx   # Thanh tìm kiếm từ vựng toàn cục
│   ├── App.tsx                 # Cấu hình Routing (react-router-dom)
│   ├── main.tsx
│   └── index.css               # Cấu hình Tailwind CSS
├── tailwind.config.js
└── tsconfig.json
```

## 2. Cấu trúc Dữ liệu (data.json & Types)

Dữ liệu sẽ được nạp thông qua fetch API từ `public/data.json`. Dưới đây là mẫu JSON và định nghĩa TypeScript:

**`public/data.json` (Mẫu rút gọn):**
```json
[
  {
    "id": 1,
    "topicName": "JOB - NGHỀ NGHIỆP",
    "words": [
      {
        "STT": 1,
        "VOCABULARY": "accountant",
        "WORD TYPE": "n",
        "PRONUNCIATION": "/əˈkaʊn.t̬ənt/",
        "MEANING": "kế toán"
      },
      {
        "STT": 2,
        "VOCABULARY": "actor/actress",
        "WORD TYPE": "n",
        "PRONUNCIATION": "/ˈæk.tɚ/ /ˈæk.trəs/",
        "MEANING": "diễn viên"
      }
    ]
  }
]
```

**`src/types/index.ts`:**
```typescript
export interface Word {
  STT: number;
  VOCABULARY: string;
  "WORD TYPE": string;
  PRONUNCIATION: string;
  MEANING: string;
}

export interface Topic {
  id: number;
  topicName: string;
  words: Word[];
}
```

## 3. Code Layout Chính & Sidebar

Sử dụng Tailwind CSS để xây dựng Layout responsive, có sidebar thu gọn được.

**`src/components/layout/Sidebar.tsx`:**
```tsx
import React from 'react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  return (
    <aside 
      className={`bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col h-screen sticky top-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!isCollapsed && <span className="font-bold text-xl text-blue-400 truncate">Học Từ Vựng</span>}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-800 focus:outline-none flex-shrink-0 mx-auto"
        >
          {/* Menu Icon (Hamburger) */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          <li>
            <a href="#" className="flex items-center p-3 rounded-lg hover:bg-slate-800 transition-colors group">
              <span className="text-xl">📚</span>
              {!isCollapsed && <span className="ml-3 font-medium">Chủ đề</span>}
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-3 rounded-lg hover:bg-slate-800 transition-colors group">
              <span className="text-xl">🔍</span>
              {!isCollapsed && <span className="ml-3 font-medium">Tra từ</span>}
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
```

**`src/components/layout/MainLayout.tsx`:**
```tsx
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <main className="flex-1 flex flex-col transition-all duration-300">
        {/* Có thể thêm Header ở đây nếu cần */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
```

## 4. Kế hoạch Verification & Các bước tiếp theo

1. **Khởi tạo dự án & Dependencies:** Chạy `npx create-vite`, cài đặt `tailwindcss`, `react-router-dom`, `lucide-react` (cho các icon mượt mà).
2. **Setup Dữ liệu:** Di chuyển file `data.json` đã được tạo từ bước trước vào thư mục `public/`.
3. **Phát triển Hooks:** Viết `useSpeechRecognition` xử lý logic press-and-hold cực kỳ cẩn thận để tránh memory leaks.
4. **Xây dựng VocabularyCard:** Kết nối dữ liệu JSON vào UI thẻ từ vựng với đầy đủ tính năng kiểm tra phát âm, hiện dấu tick xanh (✔) và popup giải nghĩa.

> [!IMPORTANT]  
> Web Speech API (`SpeechRecognition`) hiện tại được hỗ trợ tốt nhất trên Google Chrome và Edge. Để ứng dụng hoạt động ổn định, ta sẽ thêm fallback an toàn nếu người dùng mở trên trình duyệt không hỗ trợ.

> [!NOTE]
> Bạn có muốn tôi tiến hành **chạy script tạo dự án Vite**, cài đặt cấu hình Tailwind và tự động sinh mã nguồn cho các file trên ngay trong thư mục `c:\Users\khng\Desktop\hoctuvung\hoctuvung-web` không? Vui lòng bấm **Proceed** để tôi bắt đầu code toàn bộ hệ thống!
