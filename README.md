# 🚀 Personal Growth App (Fullstack Mobile & Backend)

Hệ thống ứng dụng di động quản lý cá nhân toàn diện: **Theo dõi Thói quen (Habits)**, **Lịch trình công việc (Calendar & Tasks)**, **Nhật ký (Journal)**, và **Tổng quan chỉ số sống (Dashboard)**.

Ứng dụng được xây dựng trên kiến trúc Fullstack hiện đại với **React Native (Expo)** ở Frontend và **NestJS (Prisma ORM + PostgreSQL)** ở Backend.

---

## 🎨 Tính năng nổi bật trên Giao diện (Frontend)

### 1. ⚡ **Quản lý Thói quen (Habits Tracker)**
* **Vòng tròn tiến độ SVG**: Hiển thị % hoàn thành thói quen trong ngày.
* **Chuỗi Streak thông minh**: Theo dõi số ngày liên tiếp giữ thói quen (Streak hiện tại & Streak kỷ lục tốt nhất).
* **Lịch Habit dạng Grid (Multi-dot)**: Mỗi ngày hiển thị các chấm màu đại diện cho các thói quen diễn ra. Khi chọn ngày, ô lịch được phủ khung màu xanh lá chữ nhật bo góc (`rounded-lg`).
* **Check-in / Uncheck linh hoạt**: Tích chọn hoàn thành hoặc hủy tích chọn đồng bộ ngay lập tức với Backend.

### 2. 📅 **Lịch trình & Công việc (Calendar & Schedule)**
* **Lịch dạng Ngày (Day View Timeline)**: Khung dòng thời gian 24 giờ trực quan.
* **Lịch dạng Tuần (Week View Grid)**: Xem toàn bộ công việc trong tuần.
* **Lịch dạng Tháng (Month View Grid)**: Lưới lịch tháng kết hợp khung **Agenda Vertical Timeline** ở nửa dưới màn hình.
* **Phân loại danh mục (Categories)**: Công việc, Học tập, Sức khỏe, Cá nhân, Du lịch, Hội thảo với bảng màu sắc chuẩn hóa.

### 3. 📊 **Trang chủ & Tổng quan (Dashboard)**
* Thẻ tổng quan điểm số **Habit Score**, **Mood Score**, **Well-being**.
* Biểu đồ đường (Gifted Charts) theo dõi xu hướng cảm xúc & tiến độ.
* Tóm tắt công việc & thói quen cần hoàn thành hôm nay.

### 4. 📖 **Nhật ký cá nhân (Journal)**
* Ghi chép nhật ký, lưu giữ kỷ niệm đính kèm nhãn cảm xúc (**Mood**).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### **Frontend (Mobile App)**
* **Framework**: React Native (`v0.86`), Expo (`v57`), Expo Router.
* **Styling**: NativeWind (`v4`), Tailwind CSS, Class Variance Authority (`cva`).
* **Components**: Clean UI Component system (`<Text>` variants, `<Card>`, `<Calendar>`, `<Badge>`, `<SegmentedControl>`).
* **Icons & Graphics**: Ionicons (`@expo/vector-icons`), React Native SVG.

### **Backend (API Server)**
* **Framework**: NestJS (TypeScript).
* **Database & ORM**: PostgreSQL + Prisma ORM.
* **Authentication**: JWT Bearer Token Guard.
* **Validation**: Class Validator & Class Transformer.

---

## 📂 Cấu trúc dự án (Project Structure)

```text
Personal/
├── client/                     # Mã nguồn Frontend (React Native Expo)
│   ├── src/
│   │   ├── app/                # Expo Router Navigation
│   │   │   └── (tabs)/         # Các màn hình chính (index, calendar, habits, journal)
│   │   ├── components/         # UI Components (calendar, ui, journal...)
│   │   ├── lib/                # HTTP API Client & utils
│   │   ├── services/           # Services gọi API NestJS (habit.service, task.service)
│   │   └── types/              # TypeScript Types
│   └── tailwind.config.js      # Cấu hình Bảng màu & Theme Design Token
│
└── server/                     # Mã nguồn Backend (NestJS API Server)
    ├── prisma/                 # Database Schema & Migrations
    │   └── schema.prisma
    └── src/
        ├── common/             # Interceptors, Guards, Decorators
        └── module/             # NestJS Modules
            ├── habit/          # API Thói quen & Streak calculation
            ├── task/           # API Lịch trình & Công việc
            ├── journal/        # API Nhật ký
            ├── dashboard/      # API Tổng quan & Thống kê
            ├── category/       # API Danh mục
            ├── auth/           # API Xác thực
            └── users/          # API Người dùng
```

---

## 🌐 Các API Endpoint chính (NestJS Backend)

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

---

## 🚀 Hướng dẫn Chạy dự án (Getting Started)

### 1. Khởi chạy Backend (NestJS Server)
```bash
cd server
npm install
npx prisma generate
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
Dự án được phát triển riêng bởi **ZzzNTKzzZ**.
