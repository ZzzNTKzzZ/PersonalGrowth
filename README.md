# 🚀 Personal Growth App (Fullstack Mobile & Backend)

Hệ thống ứng dụng di động quản lý phát triển cá nhân toàn diện: **Theo dõi Thói quen (Habits Tracker)**, **Lịch trình công việc (Calendar & Tasks)**, **Đánh giá cuối ngày (Daily Review)**, **Nhật ký cảm xúc (Journal)**, và **Bảng tổng quan chỉ số sống (Dashboard)**.

Ứng dụng được xây dựng trên kiến trúc Fullstack hiện đại với **React Native (Expo)** ở Frontend và **NestJS (Prisma ORM + PostgreSQL)** ở Backend.

---

## 🎨 Tính năng nổi bật trên Giao diện (Frontend)

### 1. ⚡ **Quản lý Thói quen (Habits Tracker)**
* **Vòng tròn tiến độ SVG**: Hiển thị % hoàn thành thói quen trong ngày trực quan.
* **Chuỗi Streak thông minh**: Theo dõi số ngày liên tiếp giữ thói quen (Streak hiện tại & Streak kỷ lục tốt nhất) tính toán động từ database.
* **Lịch Habit dạng Grid (Multi-dot)**: Mỗi ngày hiển thị các chấm màu đại diện cho các thói quen đã hoàn thành.
* **Check-in / Uncheck tương tác**: Tích chọn hoàn thành hoặc hủy tích chọn ngay lập tức từ cả trang chủ lẫn trang thói quen.
* **Khử trùng lặp dữ liệu (Deduplication)**: Cơ chế lọc ID duy nhất đảm bảo không bị nhân đôi phần tử.

### 2. 📅 **Lịch trình & Công việc (Calendar & Schedule)**
* **Lịch Ngày (Day View Timeline)**: Khung dòng thời gian 24 giờ trực quan.
* **Lịch Tuần (Week View Grid)**: Xem toàn bộ công việc và thời lượng trong tuần.
* **Lịch Tháng (Month View Grid)**: Lưới lịch tháng kết hợp khung **Agenda Vertical Timeline** chi tiết.
* **Phân loại danh mục (Categories)**: Công việc, Học tập, Sức khỏe, Cá nhân, Du lịch, Hội thảo với bảng màu sắc chuẩn hóa.
* **Event Modal**: Tạo mới và chỉnh sửa sự kiện đồng bộ với giao diện.

### 3. 🌟 **Đánh giá cuối ngày (Daily Review)**
* **Bộ chọn điểm số tương tác (1 – 10)** cho 4 khía cạnh:
  - ⚡ **Productivity** (Hiệu suất làm việc)
  - 😊 **Mood** (Tâm trạng & Cảm xúc)
  - 🏃 **Health** (Sức khỏe & Vận động)
  - ⭐ **Satisfaction** (Mức độ hài lòng chung)
* **Thẻ Điểm Phát Triển Bản Thân**: Tự động tính toán điểm số trung bình (`/10`) kèm thông điệp động viên.
* **Ghi chú suy ngẫm**: Ghi lại thành tựu trong ngày và bài học rút ra cho ngày mai.
* **Lưu & Tự động nạp**: Hỗ trợ xem lại lịch sử đánh giá các ngày trước đó qua thanh chọn ngày.

### 4. 📊 **Trang chủ & Tổng quan (Dashboard)**
* Thẻ tổng quan điểm số **Habit Score**, **Task Score**, **Mood Score**, **Well-being**.
* Biểu đồ đường (Gifted Charts) theo dõi xu hướng tiến độ và cảm xúc trong tuần.
* Banner nhắc nhở **Đánh giá & Tổng kết hôm nay** truy cập nhanh.
* Tích hợp **Pull-to-refresh** làm mới toàn bộ dữ liệu.

### 5. 📖 **Nhật ký cá nhân (Journal)**
* Ghi chép nhật ký, lưu giữ kỷ niệm đính kèm nhãn cảm xúc (**Mood**).
* Modal tạo và chỉnh sửa nhật ký chuẩn hóa giao diện.

### 6. 🔐 **Xác thực & Bảo mật (Auth Flow)**
* Quản lý phiên đăng nhập an toàn với **`expo-secure-store`**.
* **Axios Request Interceptor**: Tự động gắn header `Authorization: Bearer <token>` vào mọi yêu cầu.
* **Axios Response Interceptor**: Tự động bắt mã lỗi `401 Unauthorized`, gọi endpoint `/auth/refresh` và retry request ngầm mượt mà.
* **Root Navigation Guard**: Tự động điều hướng và bảo vệ các tuyến đường riêng tư.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### **Frontend (Mobile App)**
* **Framework**: React Native (`v0.86`), Expo (`v57`), Expo Router (`v57`).
* **Styling**: NativeWind (`v4`), Tailwind CSS, Class Variance Authority (`cva`).
* **State & Storage**: React Context API (`AuthProvider`), `expo-secure-store`.
* **Networking**: `axios` (với Request/Response Interceptors & Queue Retry).
* **Components**: UI Component System (`<Card>`, `<Calendar>`, `<Badge>`, `<SegmentedControl>`, `<Checkbox>`).
* **Charts & Graphics**: `react-native-gifted-charts`, `react-native-svg`, Ionicons (`@expo/vector-icons`).

### **Backend (API Server)**
* **Framework**: NestJS (TypeScript).
* **Database & ORM**: PostgreSQL + Prisma ORM (Prisma v7 với `@prisma/adapter-pg`).
* **Authentication**: JWT Access Token (15m) + JWT Refresh Token (7d) + `JwtAuthGuard`.
* **Validation**: `class-validator` & `class-transformer`.

---

## 📂 Cấu trúc dự án (Project Structure)

```text
Personal/
├── client/                     # Mã nguồn Frontend (React Native Expo)
│   ├── src/
│   │   ├── app/                # Expo Router Navigation
│   │   │   ├── (auth)/         # Màn hình Xác thực (login, register)
│   │   │   ├── (tabs)/         # Màn hình chính (index, calendar, habits, journal)
│   │   │   ├── journal/        # Màn hình mở rộng (daily-review.tsx)
│   │   │   └── _layout.tsx     # Root Layout bọc AuthProvider & Route Guard
│   │   ├── components/         # UI Components (calendar, dashboard, journal, ui)
│   │   ├── context/            # React Context (auth-context.tsx)
│   │   ├── lib/                # HTTP API Client với Axios Interceptors (api.ts)
│   │   ├── services/           # Services gọi API NestJS (auth, dashboard, habit, task, journal, day-review)
│   │   └── types/              # TypeScript Type Definitions
│   └── tailwind.config.js      # Cấu hình Bảng màu & Design Token
│
└── server/                     # Mã nguồn Backend (NestJS API Server)
    ├── prisma/                 # Database Schema & Seed Script
    │   ├── schema.prisma       # 9 Data Models (User, Profile, Task, Habit, HabitRecord, Journal, DayReview, Mood, Category)
    │   └── seed.ts             # Kịch bản dọn sạch DB và nạp dữ liệu mẫu
    └── src/
        ├── common/             # Interceptors, Guards (jwt-auth.guard.ts), Decorators
        └── module/             # NestJS Feature Modules
            ├── auth/           # Đăng ký, Đăng nhập, Refresh Token, Logout
            ├── users/          # Quản lý thông tin người dùng & Profile
            ├── category/       # Quản lý danh mục công việc
            ├── task/           # Quản lý lịch trình & công việc
            ├── habit/          # Quản lý thói quen & tính toán chuỗi Streak
            ├── journal/        # Quản lý bài viết nhật ký
            ├── day-review/     # Đánh giá cuối ngày & tính điểm phát triển
            └── dashboard/      # Tổng hợp tỷ lệ hoàn thành theo ngày
```

---

## 🌐 Các API Endpoint chính (NestJS Backend)

### 🔐 **Auth API (`/auth`)**
* `POST /auth/register`: Đăng ký tài khoản mới.
* `POST /auth/login`: Đăng nhập, trả về `accessToken` và `refreshToken`.
* `POST /auth/refresh`: Cấp mới Access Token bằng Refresh Token.
* `POST /auth/logout`: Thu hồi Refresh Token và đăng xuất.

### 🌟 **Day Review API (`/day-reviews`)**
* `POST /day-reviews`: Tạo mới hoặc cập nhật đánh giá ngày (`productivity`, `moodScore`, `healthScore`, `satisfaction`, `note`).
* `GET /day-reviews/:date`: Lấy thông tin đánh giá theo ngày cụ thể (`YYYY-MM-DD`).
* `GET /day-reviews`: Lấy danh sách lịch sử đánh giá.

### ⚡ **Habits API (`/habits`)**
* `GET /habits`: Lấy danh sách thói quen + Chuỗi Current Streak & Max Streak.
* `POST /habits`: Tạo thói quen mới.
* `PATCH /habits/:id`: Sửa thói quen.
* `DELETE /habits/:id`: Xóa thói quen.
* `POST /habits/:id/records`: Điểm danh hoàn thành (Check-in).
* `DELETE /habits/:id/records/:recordId`: Hủy điểm danh (Uncheck).

### 📋 **Tasks API (`/tasks`)**
* `GET /tasks`: Lọc danh sách công việc (theo trạng thái, danh mục, ngày).
* `POST /tasks`: Tạo công việc mới (`startTime`, `endTime`, `dueDate`, `categoryId`).
* `PATCH /tasks/:id`: Cập nhật trạng thái / khung giờ công việc.
* `DELETE /tasks/:id`: Xóa công việc.

### 📖 **Journals API (`/journals`)**
* `GET /journals`: Lấy danh sách nhật ký phân trang.
* `POST /journals`: Tạo bài nhật ký mới.
* `PATCH /journals/:id`: Chỉnh sửa nhật ký.
* `DELETE /journals/:id`: Xóa bài nhật ký.

### 📊 **Dashboard API (`/dashboard`)**
* `GET /dashboard/summary?date=YYYY-MM-DD`: Tổng hợp số lượng và % hoàn thành của Task & Habit trong ngày.

---

## 🚀 Hướng dẫn Chạy dự án (Getting Started)

### 1. Khởi chạy Backend (NestJS Server)
```bash
cd server
npm install
npx prisma generate
npx tsx prisma/seed.ts      # (Tùy chọn) Xóa sạch DB cũ & Nạp dữ liệu mẫu sạch sẽ
npm run start:dev
```
*Server chạy tại: `http://localhost:3000`*

### 2. Khởi chạy Frontend (Expo Mobile Client)
```bash
cd client
npm install
npx expo start
```
*Quét mã QR bằng ứng dụng Expo Go trên điện thoại hoặc chọn phím `a` để mở Android Emulator / `i` cho iOS Simulator.*

---

## 📝 Giấy phép (License)
Dự án được phát triển bởi **ZzzNTKzzZ** / **n22tk05**.

