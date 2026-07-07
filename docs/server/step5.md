# Step 5 - Task & Category Module (NestJS)

## Mục tiêu

Xây dựng hệ thống quản lý danh mục công việc (Category) và lịch trình công việc cá nhân (Task) của người dùng. Đây là module nền tảng đầu tiên trong các chức năng chính của ứng dụng Personal Growth Tracker.

Sau khi hoàn thành bước này, backend có khả năng:
* Quản lý các danh mục công việc (Học tập, Công việc, Sức khỏe, Giải trí, v.v.).
* Quản lý lịch trình công việc cá nhân (Tạo, sửa, xóa, lấy danh sách công việc).
* Lọc danh sách công việc theo trạng thái (`TODO`, `IN_PROGRESS`, `DONE`), theo danh mục (`categoryId`) hoặc theo thời gian thực hiện.
* Đảm bảo tính bảo mật và quyền sở hữu: Người dùng chỉ có thể quản lý danh mục và công việc do chính mình tạo ra.

---

## Cấu trúc Database (Prisma Schema liên quan)

Module này sử dụng các bảng `Category`, `Task` và enum `TaskStatus` trong [schema.prisma](file:///c:/Users/ADMIN/Desktop/Personal/server/prisma/schema.prisma):

```prisma
enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

model Category {
  id        String   @id @default(cuid())
  name      String
  color     String?
  icon      String?
  createdAt DateTime @default(now())
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks     Task[]
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  dueDate     DateTime?
  status      TaskStatus @default(TODO)
  completedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoryId  String?
  category    Category?  @relation(fields: [categoryId], references: [id])
}
```

---

## Cấu trúc thư mục đề xuất

Để đảm bảo tính modular, các tính năng được chia thành 2 sub-module nhỏ nằm trong `src/module/`:

```text
src/
└── module/
    ├── category/
    │   ├── category.module.ts
    │   ├── category.controller.ts
    │   ├── category.service.ts
    │   ├── category.repository.ts
    │   ├── category.dto.ts
    │   └── category.type.ts
    │
    └── task/
        ├── task.module.ts
        ├── task.controller.ts
        ├── task.service.ts
        ├── task.repository.ts
        ├── task.dto.ts
        └── task.type.ts
```

---

## Danh sách API Endpoints

Tất cả các API dưới đây **bắt buộc** phải được bảo vệ bởi `JwtAuthGuard`.

### 1. Quản lý Danh mục (Category APIs)

| Method | Endpoint | Yêu cầu DTO | Mô tả |
| :--- | :--- | :--- | :--- |
| **POST** | `/categories` | `CreateCategoryDto` | Tạo mới một danh mục công việc |
| **GET** | `/categories` | Không | Lấy danh sách toàn bộ danh mục của bản thân |
| **GET** | `/categories/:id` | Không | Lấy chi tiết một danh mục cụ thể |
| **PATCH** | `/categories/:id` | `UpdateCategoryDto` | Sửa thông tin danh mục (Tên, màu sắc, icon) |
| **DELETE** | `/categories/:id` | Không | Xóa danh mục (Tự động set `categoryId` của các Task thuộc về nó thành null) |

### 2. Quản lý Công việc (Task APIs)

| Method | Endpoint | Yêu cầu DTO | Mô tả |
| :--- | :--- | :--- | :--- |
| **POST** | `/tasks` | `CreateTaskDto` | Tạo mới một công việc cá nhân |
| **GET** | `/tasks` | Query params (Lọc) | Lấy danh sách công việc (hỗ trợ lọc theo `status`, `categoryId`, `dueDate`) |
| **GET** | `/tasks/:id` | Không | Lấy thông tin chi tiết một công việc cụ thể |
| **PATCH** | `/tasks/:id` | `UpdateTaskDto` | Cập nhật công việc (Tiêu đề, trạng thái, hạn chót, danh mục) |
| **DELETE** | `/tasks/:id` | Không | Xóa bỏ công việc khỏi hệ thống |

---

## Luồng nghiệp vụ & Bảo mật quan trọng

### 1. Phòng chống lỗ hổng phân quyền (IDOR)
*   Khi truy cập chi tiết, cập nhật hoặc xóa một Category hoặc Task, hệ thống **phải** kiểm tra xem `userId` của bản ghi đó có trùng khớp với `userId` lấy từ JWT Access Token hay không.
*   Nếu không trùng khớp, ném ra lỗi `403 Forbidden` hoặc `404 Not Found`.

### 2. Ràng buộc quan hệ hợp lệ
*   Khi tạo hoặc sửa Task có truyền kèm `categoryId`, hệ thống **bắt buộc** phải kiểm tra xem danh mục đó có thuộc sở hữu của người dùng hiện tại hay không trước khi liên kết dữ liệu. Tránh việc liên kết công việc với danh mục của người dùng khác.

---

## Thiết kế DTO (Validation)

### 1. Category DTOs
*   `CreateCategoryDto`:
    *   `name`: String, bắt buộc, độ dài 2-50 ký tự.
    *   `color`: String (Mã hex/CSS), optional.
    *   `icon`: String (Tên icon), optional.
*   `UpdateCategoryDto`: Tương tự `CreateCategoryDto` nhưng tất cả các trường đều là `optional`.

### 2. Task DTOs
*   `CreateTaskDto`:
    *   `title`: String, bắt buộc, độ dài 2-100 ký tự.
    *   `description`: String, optional.
    *   `dueDate`: Date string (ISO 8601), optional.
    *   `categoryId`: String, optional.
*   `UpdateTaskDto`:
    *   `title`: String, optional.
    *   `description`: String, optional.
    *   `dueDate`: Date string, optional.
    *   `status`: Enum (TaskStatus: `TODO`, `IN_PROGRESS`, `DONE`), optional.
    *   `categoryId`: String, optional (truyền `null` nếu muốn bỏ liên kết danh mục).

---

## Cấu trúc dữ liệu trả về chuẩn

### CategoryResponse
```json
{
  "id": "category_cuid",
  "name": "Học tập",
  "color": "#3B82F6",
  "icon": "book-open",
  "createdAt": "2026-07-03T12:00:00.000Z"
}
```

### TaskResponse
```json
{
  "id": "task_cuid",
  "title": "Học Java Core",
  "description": "Hoàn thành bài tập hướng đối tượng",
  "status": "TODO",
  "dueDate": "2026-07-04T17:00:00.000Z",
  "completedAt": null,
  "createdAt": "2026-07-03T12:00:00.000Z",
  "category": {
    "id": "category_cuid",
    "name": "Học tập",
    "color": "#3B82F6"
  }
}
```
