# Step 7 - Self-Reflection Modules (Mood & Journal)

## Mục tiêu

Xây dựng cụm tính năng giúp người dùng phản chiếu và theo dõi nội tâm (Self-Reflection). Bước này sẽ được chia làm hai module độc lập nhưng có tính chất tương đồng nhau:
1. **Mood Module (Theo dõi cảm xúc):** Cho phép người dùng ghi nhận mức độ cảm xúc nhiều lần trong ngày, kèm theo nguyên nhân hoặc ghi chú nhanh.
2. **Journal Module (Nhật ký cá nhân):** Nơi ghi chép các đoạn văn bản dài, chèn link hình ảnh để lưu giữ kỷ niệm hoặc suy nghĩ.

Sau khi hoàn thành bước này, backend có khả năng cung cấp API CRUD (Tạo, Đọc, Sửa, Xóa) cơ bản cho cả hai tính năng trên, đảm bảo tính riêng tư dữ liệu (IDOR).

---

## Cấu trúc Database (Prisma Schema liên quan)

Sử dụng các bảng `Mood`, `Journal` và enum `MoodLevel` đã khai báo sẵn:

```prisma
enum MoodLevel {
  VERY_HAPPY
  HAPPY
  NORMAL
  SAD
  VERY_SAD
}

model Mood {
  id        String    @id @default(cuid())
  level     MoodLevel
  reason    String?
  note      String?
  createdAt DateTime  @default(now())
  
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Journal {
  id        String   @id @default(cuid())
  title     String?
  content   String
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## Cấu trúc thư mục đề xuất

Tạo 2 thư mục module mới trong `src/module/`:

```text
src/
└── module/
    ├── mood/
    │   ├── mood.module.ts
    │   ├── mood.controller.ts
    │   ├── mood.service.ts
    │   ├── mood.repository.ts
    │   ├── mood.dto.ts
    │   └── mood.type.ts
    └── journal/
        ├── journal.module.ts
        ├── journal.controller.ts
        ├── journal.service.ts
        ├── journal.repository.ts
        ├── journal.dto.ts
        └── journal.type.ts
```

---

## Danh sách API Endpoints

Tất cả API bắt buộc bảo vệ bằng `JwtAuthGuard`.

### 1. Mood APIs (`/moods`)
| Method | Endpoint | Yêu cầu DTO | Mô tả |
| :--- | :--- | :--- | :--- |
| **POST** | `/moods` | `CreateMoodDto` | Tạo ghi nhận cảm xúc mới (level bắt buộc) |
| **GET** | `/moods` | Query: `startDate`, `endDate` | Lấy danh sách cảm xúc, sắp xếp mới nhất lên đầu |
| **PATCH** | `/moods/:id` | `UpdateMoodDto` | Cập nhật nguyên nhân / ghi chú / level của cảm xúc |
| **DELETE**| `/moods/:id` | Không | Xóa ghi nhận cảm xúc |

### 2. Journal APIs (`/journals`)
| Method | Endpoint | Yêu cầu DTO | Mô tả |
| :--- | :--- | :--- | :--- |
| **POST** | `/journals` | `CreateJournalDto` | Viết nhật ký mới (content bắt buộc) |
| **GET** | `/journals` | Query: `page`, `limit` | Lấy danh sách nhật ký (có phân trang, sắp xếp mới nhất lên đầu) |
| **GET** | `/journals/:id`| Không | Lấy chi tiết nội dung 1 bài nhật ký |
| **PATCH** | `/journals/:id`| `UpdateJournalDto` | Chỉnh sửa nhật ký |
| **DELETE**| `/journals/:id`| Không | Xóa bài nhật ký |

---

## Luồng nghiệp vụ & Chú ý quan trọng

1. **Bảo mật (IDOR):** Mọi hành động Edit/Delete/View Detail của Mood và Journal đều phải kiểm tra `userId` truy vấn trong DB có khớp với `userId` từ JWT token không.
2. **Xử lý ngày tháng (Mood):** API `GET /moods` nên hỗ trợ query truyền vào ngày bắt đầu và kết thúc (`?startDate=...&endDate=...`) để Frontend có thể lấy dữ liệu theo tuần/tháng nhằm vẽ biểu đồ.
3. **Phân trang (Journal):** API `GET /journals` bắt buộc phải có phân trang. Trả về metadata như `{ data: [...], meta: { total, page, limit } }`.

---

## Thiết kế DTO (Validation)

### 1. CreateMoodDto
* `level`: Enum (`VERY_HAPPY`, `HAPPY`, `NORMAL`, `SAD`, `VERY_SAD`), bắt buộc.
* `reason`: String, optional, max 100 ký tự.
* `note`: String, optional, max 500 ký tự.

### 2. UpdateMoodDto
Tương tự `CreateMoodDto` nhưng tất cả các trường đều là `optional`.

### 3. CreateJournalDto
* `title`: String, optional, max 200 ký tự.
* `content`: String, bắt buộc, tối thiểu 2 ký tự.
* `imageUrl`: String (`@IsUrl()`), optional.

### 4. UpdateJournalDto
Tương tự `CreateJournalDto` nhưng tất cả các trường đều là `optional`.

---

## Cấu trúc dữ liệu trả về chuẩn

### MoodResponse
```json
{
  "id": "mood_cuid",
  "level": "HAPPY",
  "reason": "Hoàn thành công việc",
  "note": "Hôm nay làm việc rất hiệu quả",
  "createdAt": "2026-07-04T12:00:00.000Z"
}
```

### JournalResponse (Danh sách có phân trang)
```json
{
  "data": [
    {
      "id": "journal_cuid",
      "title": "Chuyến đi Đà Lạt",
      "content": "Hôm nay thời tiết rất đẹp...",
      "imageUrl": "https://example.com/image.jpg",
      "createdAt": "2026-07-04T12:00:00.000Z",
      "updatedAt": "2026-07-04T12:00:00.000Z"
    }
  ],
  "meta": {
    "createdAt": "2026-07-04T12:00:00.000Z",
    "total": 15,
    "page": 1,
    "limit": 10
  }
}
```
