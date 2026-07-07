# Step 6 - Habit Tracker Module (NestJS)

## Mục tiêu

Xây dựng hệ thống quản lý và theo dõi thói quen hằng ngày (Habit Tracker) của người dùng. Đây là module cốt lõi thứ hai giúp người dùng xây dựng lối sống tích cực qua việc hoàn thành các mục tiêu định kỳ (Hàng ngày, Hàng tuần, Hàng tháng).

Sau khi hoàn thành bước này, backend có khả năng:
* Quản lý các thói quen (Tạo, sửa, xóa, lấy danh sách thói quen).
* Ghi nhận việc thực hiện thói quen (Habit Record) cho từng ngày cụ thể.
* Tính toán chuỗi ngày hoàn thành liên tiếp (Streak) hiện tại và dài nhất của từng thói quen.
* Tính toán tỷ lệ hoàn thành thói quen phục vụ báo cáo.
* Đảm bảo tính bảo mật (IDOR): Chỉ chủ sở hữu thói quen mới có thể xem, cập nhật, xóa hoặc ghi nhận record thói quen đó.

---

## Cấu trúc Database (Prisma Schema liên quan)

Module này sử dụng các bảng `Habit`, `HabitRecord` và enum `HabitFrequency` trong [schema.prisma](file:///c:/Users/ADMIN/Desktop/Personal/server/prisma/schema.prisma):

```prisma
enum HabitFrequency {
  DAILY
  WEEKLY
  MONTHLY
}

model Habit {
  id        String         @id @default(cuid())
  name      String
  frequency HabitFrequency
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
  
  userId    String
  user      User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  records   HabitRecord[]
}

model HabitRecord {
  id          String   @id @default(cuid())
  completedAt DateTime @default(now())
  
  habitId     String
  habit       Habit    @relation(fields: [habitId], references: [id], onDelete: Cascade)
}
```

---

## Cấu trúc thư mục đề xuất

Tính năng này được chia thành 1 module lớn nằm trong `src/module/habit/`:

```text
src/
└── module/
    └── habit/
        ├── habit.module.ts
        ├── habit.controller.ts
        ├── habit.service.ts
        ├── habit.repository.ts
        ├── habit.dto.ts
        └── habit.type.ts
```

---

## Danh sách API Endpoints

Tất cả các API dưới đây **bắt buộc** phải được bảo vệ bởi `JwtAuthGuard`.

### 1. Quản lý Thói quen (Habit Management APIs)

| Method | Endpoint | Yêu cầu DTO | Mô tả |
| :--- | :--- | :--- | :--- |
| **POST** | `/habits` | `CreateHabitDto` | Tạo mới một thói quen |
| **GET** | `/habits` | Không | Lấy danh sách thói quen của bản thân (kèm danh sách records gần nhất) |
| **GET** | `/habits/:id` | Không | Lấy chi tiết thói quen kèm toàn bộ lịch sử hoàn thành |
| **PATCH** | `/habits/:id` | `UpdateHabitDto` | Cập nhật thói quen (Tên, Tần suất) |
| **DELETE** | `/habits/:id` | Không | Xóa thói quen (Tự động xóa toàn bộ HabitRecord liên kết qua Cascade) |

### 2. Ghi nhận Hoàn thành (Habit Record APIs)

| Method | Endpoint | Yêu cầu DTO | Mô tả |
| :--- | :--- | :--- | :--- |
| **POST** | `/habits/:id/records` | `CheckHabitDto` (optional) | Ghi nhận hoàn thành thói quen (mặc định lấy thời điểm hiện tại, hoặc truyền ngày cụ thể) |
| **DELETE** | `/habits/:id/records/:recordId` | Không | Hủy ghi nhận hoàn thành thói quen (xóa HabitRecord) |

---

## Luồng nghiệp vụ & Bảo mật quan trọng

### 1. Phòng chống lỗ hổng phân quyền (IDOR)
* Khi xem chi tiết, cập nhật, xóa Habit, hoặc tạo/xóa HabitRecord, hệ thống **bắt buộc** phải kiểm tra xem `userId` của Habit đó có trùng khớp với `userId` từ JWT Token hay không.
* Khi thực hiện hành động trên HabitRecord, hệ thống phải đảm bảo HabitRecord đó thuộc về một Habit mà người dùng hiện tại sở hữu.

### 2. Logic tính toán Streak & Thống kê (Nghiệp vụ nâng cao)
* **Streak hiện tại (Current Streak)**: Tính tổng số ngày liên tiếp tính từ hôm nay (hoặc hôm qua nếu hôm nay chưa hoàn thành) ngược về quá khứ mà thói quen có ít nhất một record hoàn thành mỗi ngày (áp dụng cho `DAILY`).
* **Streak dài nhất (Max Streak)**: Chuỗi ngày hoàn thành liên tiếp dài nhất đạt được trong lịch sử.
* **Tỷ lệ hoàn thành (Completion Rate)**: Phần trăm số ngày hoàn thành trên tổng số ngày từ khi thói quen được tạo.

---

## Thiết kế DTO (Validation)

### 1. CreateHabitDto
* `name`: String, bắt buộc, độ dài 2-100 ký tự.
* `frequency`: Enum (`DAILY`, `WEEKLY`, `MONTHLY`), bắt buộc.

### 2. UpdateHabitDto
* Tương tự `CreateHabitDto` nhưng tất cả các trường đều là `optional`.

### 3. CheckHabitDto
* `completedAt`: Date string (ISO 8601), optional (nếu không truyền, hệ thống sẽ sử dụng thời gian hiện tại).

---

## Cấu trúc dữ liệu trả về chuẩn

### HabitResponse
```json
{
  "id": "habit_cuid",
  "name": "Đọc sách 30 phút",
  "frequency": "DAILY",
  "createdAt": "2026-07-04T12:00:00.000Z",
  "updatedAt": "2026-07-04T12:00:00.000Z",
  "streak": {
    "current": 5,
    "max": 12
  },
  "completionRate": 0.5,
  "records": [
    {
      "id": "record_cuid_1",
      "completedAt": "2026-07-04T08:30:00.000Z"
    },
    {
      "id": "record_cuid_2",
      "completedAt": "2026-07-03T09:15:00.000Z"
    }
  ]
}
```
