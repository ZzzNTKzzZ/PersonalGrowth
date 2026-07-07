# Step 8 - Daily Review & Dashboard Analytics

## Mục tiêu

Xây dựng hệ thống tổng kết, đánh giá cuối ngày và bảng điều khiển trung tâm (Dashboard). Đây là module phức tạp nhất về mặt truy vấn dữ liệu, giúp biến mọi dữ liệu rời rạc (Task, Habit, Mood) thành những con số thống kê có ý nghĩa.

1. **Day Review Module:** Cho phép người dùng chấm điểm ngày hôm nay trên 3 tiêu chí (Năng suất, Cảm xúc, Sức khỏe).
2. **Dashboard Module:** Cung cấp API tổng hợp dữ liệu toàn cảnh (Overview).

---

## Cấu trúc Database (Prisma Schema liên quan)

Sử dụng bảng `DayReview` đã khai báo sẵn:

```prisma
model DayReview {
  id           String   @id @default(cuid())
  productivity Int      // Điểm năng suất (VD: 1-10)
  moodScore    Int      // Điểm cảm xúc (VD: 1-10)
  healthScore  Int      // Điểm sức khỏe (VD: 1-10)
  satisfaction Int      // Tổng quan hài lòng (VD: 1-10)
  note         String?
  reviewDate   DateTime // Ngày thực hiện review (không kèm giờ)
  createdAt    DateTime @default(now())
  
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Đảm bảo 1 user chỉ có 1 review cho mỗi ngày
  @@unique([userId, reviewDate])
}
```

---

## Cấu trúc thư mục đề xuất

Tạo 2 thư mục module mới:

```text
src/
└── module/
    ├── day-review/
    │   ├── day-review.module.ts
    │   ├── day-review.controller.ts
    │   ├── day-review.service.ts
    │   ├── day-review.repository.ts
    │   ├── day-review.dto.ts
    │   └── day-review.type.ts
    └── dashboard/
        ├── dashboard.module.ts
        ├── dashboard.controller.ts
        ├── dashboard.service.ts
        └── dashboard.type.ts
```

---

## Danh sách API Endpoints

Tất cả API bắt buộc bảo vệ bằng `JwtAuthGuard`.

### 1. Day Review APIs (`/day-reviews`)
| Method | Endpoint | Yêu cầu DTO | Mô tả |
| :--- | :--- | :--- | :--- |
| **POST** | `/day-reviews` | `CreateDayReviewDto` | Tạo Đánh giá ngày (nhận `reviewDate`). Nếu ngày đó đã có review, báo lỗi Conflict hoặc Upsert. |
| **GET** | `/day-reviews` | Query: `startDate`, `endDate` | Lấy lịch sử các đánh giá ngày để vẽ biểu đồ. |
| **GET** | `/day-reviews/:date` | Không | Lấy chi tiết review của một ngày cụ thể (YYYY-MM-DD). |
| **PATCH** | `/day-reviews/:id` | `UpdateDayReviewDto` | Chỉnh sửa điểm đánh giá. |

### 2. Dashboard APIs (`/dashboard`)
| Method | Endpoint | Yêu cầu DTO | Mô tả |
| :--- | :--- | :--- | :--- |
| **GET** | `/dashboard/summary` | Query: `date` (mặc định hôm nay) | Trả về tổng quan ngày: Số Task hoàn thành, Số Habit check-in. |

---

## Luồng nghiệp vụ & Chú ý quan trọng

1. **Upsert Day Review (Tránh trùng lặp):** Bảng có `@@unique([userId, reviewDate])`. Cần cẩn thận khi POST dữ liệu mới để tránh ném lỗi HTTP 500. Xử lý try-catch để trả về HTTP 409 (Conflict).
2. **Xử lý thời gian (Timezone):** `reviewDate` nên được lưu dưới dạng thời gian chuẩn UTC (chỉ lấy phần YYYY-MM-DD set thời gian về 00:00:00) để không bị lệch ngày.
3. **Hiệu năng Query Dashboard:** Dùng `Promise.all()` chạy song song các truy vấn Prisma thay vì `await` tuần tự.

---

## Thiết kế DTO (Validation)

### 1. CreateDayReviewDto
* `productivity`: Number, bắt buộc, `@Min(1)`, `@Max(10)`.
* `moodScore`: Number, bắt buộc, `@Min(1)`, `@Max(10)`.
* `healthScore`: Number, bắt buộc, `@Min(1)`, `@Max(10)`.
* `satisfaction`: Number, bắt buộc, `@Min(1)`, `@Max(10)`.
* `note`: String, optional, max 500 ký tự.
* `reviewDate`: Date string (`@IsDateString()`), bắt buộc.

### 2. UpdateDayReviewDto
Tương tự `CreateDayReviewDto` nhưng tất cả đều là `optional` (dùng `@PartialType`).

---

## Cấu trúc dữ liệu trả về chuẩn

### DayReviewResponse
```json
{
  "id": "review_cuid",
  "productivity": 8,
  "moodScore": 7,
  "healthScore": 6,
  "satisfaction": 7,
  "note": "Một ngày làm việc khá mệt nhưng hiệu quả",
  "reviewDate": "2026-07-04T00:00:00.000Z",
  "createdAt": "2026-07-04T18:30:00.000Z"
}
```

### DashboardSummaryResponse
```json
{
  "date": "2026-07-04",
  "tasks": {
    "total": 5,
    "completed": 3,
    "completionRate": 60
  },
  "habits": {
    "total": 4,
    "completed": 4,
    "completionRate": 100
  }
}
```
