# Step 3 - Authentication (NestJS)

## Mục tiêu

Xây dựng hệ thống xác thực cho backend bằng NestJS, sử dụng JWT và Refresh Token làm nền tảng cho toàn bộ các module phía sau.

Sau khi hoàn thành bước này, backend có khả năng:

* Đăng ký tài khoản
* Đăng nhập
* Đăng xuất (Thu hồi Refresh Token trong Database)
* Làm mới Access Token (Refresh Token rotation & comparison)
* Lấy thông tin người dùng hiện tại (qua JWT Guard)
* Phân quyền Role-Based Authorization (USER, ADMIN, SUPER_ADMIN)

---

## Cấu trúc thư mục thực tế

```text
src/
├── common/
│   ├── decorator/
│   │   └── user.decorator.ts       # Decorator lấy thông tin User từ request
│   └── guard/
│       └── jwt-auth.guard.ts       # Guard bảo vệ API bằng Access Token
│
└── module/
    ├── auth/
    │   ├── auth.controller.ts      # Định nghĩa các endpoint xác thực
    │   ├── auth.dto.ts             # Validation dữ liệu đầu vào (Register, Login, Refresh)
    │   ├── auth.module.ts          # Đăng ký Controller, Service, Repository, JWT Module
    │   ├── auth.repository.ts      # Tương tác với DB (User, Profile, RefreshToken)
    │   ├── auth.service.ts         # Logic nghiệp vụ (Hash, Token, Register, Login, Refresh, Logout)
    │   └── auth.type.ts            # Định nghĩa các TypeScript interfaces
    │
    └── prisma/                     # Module kết nối cơ sở dữ liệu
```

---

## Cấu hình Database (Prisma Schema)

Cập nhật vào `prisma/schema.prisma` các cấu trúc phân quyền và lưu trữ Token:

```prisma
enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}

model User {
  id                 String      @id @default(cuid())
  email              String      @unique
  password           String
  role               Role        @default(USER)
  hashedRefreshToken String?
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt
  
  profile            Profile?
  // ... các quan hệ khác
}
```

---

## Cấu hình Biến môi trường (.env)

Cần bổ sung vào file `.env` các khóa cấu hình sau:

```env
JWT_ACCESS_SECRET="a56jRl009PqBAk4e96qdZvxiIsxiBZzNK1s2XLkjfzc"
JWT_REFRESH_SECRET="xBs1jgh9cdvQ74jrNwVS1sSDFYsgIfd2QWphHxw37oL"
ACCESS_TOKEN_TIME="15m"
REFRESH_TOKEN_TIME="7d"
```

---

## Danh sách API endpoints

| Method | Endpoint       | Yêu cầu Guard | Mô tả |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Không | Đăng ký tài khoản mới |
| **POST** | `/auth/login` | Không | Đăng nhập và nhận bộ đôi Token |
| **POST** | `/auth/refresh` | Không | Truyền Refresh Token để lấy bộ đôi Token mới |
| **POST** | `/auth/logout` | `JwtAuthGuard` | Đăng xuất và xóa Refresh Token khỏi DB |
| **GET** | `/auth/me` | `JwtAuthGuard` | Lấy thông tin user hiện tại từ JWT Payload |

---

## JWT Payload thiết kế

Chứa thông tin cơ bản phục vụ phân quyền và định danh:

```json
{
  "id": "user_id_here",
  "email": "user@example.com",
}
```

---

## Quy trình bảo mật & luồng nghiệp vụ

### 1. Đăng ký & Đăng nhập
*   Mật khẩu được băm bằng `bcrypt` trước khi lưu vào database.
*   Khi đăng nhập thành công:
    1. Sinh ra `accessToken` và `refreshToken` dựa trên JWT Payload.
    2. Băm `refreshToken` bằng `bcrypt`.
    3. Lưu chuỗi hash đó vào trường `hashedRefreshToken` của `User` trong Database.
    4. Trả cả hai token về cho Client.

### 2. Làm mới Access Token (Refresh)
*   Client gửi `refreshToken` dạng plain text lên.
*   Hệ thống xác thực chữ ký JWT của Refresh Token.
*   Lấy thông tin `sub` (User ID) từ payload của token và tìm User trong Database.
*   So khớp chuỗi plain text `refreshToken` với `hashedRefreshToken` được lưu trong DB bằng `bcrypt.compare`.
*   Nếu trùng khớp, tiến hành tạo cặp Access Token và Refresh Token mới (Refresh Token Rotation) rồi cập nhật lại mã hash mới vào DB.

### 3. Đăng xuất (Logout)
*   Yêu cầu `JwtAuthGuard` để lấy thông tin `user.sub`.
*   Cập nhật trường `hashedRefreshToken` của người dùng này trong Database thành `null`. Điều này đảm bảo Refresh Token cũ lập tức bị vô hiệu hóa kể cả khi chưa hết hạn.

---

## Thứ tự triển khai thực tế

*   **Phase 1:** Thiết kế Database Schema & chạy Migration (`npx prisma generate` & `npx prisma db push`).
*   **Phase 2:** Triển khai Repository các phương thức đọc/ghi dữ liệu người dùng và cập nhật token.
*   **Phase 3:** Viết AuthService giải quyết logic Register, Login, Refresh, Logout kết hợp `bcrypt` và `JwtService`.
*   **Phase 4:** Cấu hình `JwtModule` với biến môi trường trong `AuthModule` và tạo `JwtAuthGuard`.
*   **Phase 5:** Định nghĩa `AuthController` và test các luồng dữ liệu bằng Postman hoặc công cụ HTTP Client.
