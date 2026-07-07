# Step 4 - User Module (NestJS)

## Mục tiêu

Xây dựng module quản lý thông tin người dùng (User Module) để lưu trữ thông tin hồ sơ, mật khẩu và các cài đặt cá nhân, đồng thời chuẩn bị dữ liệu sở hữu cho các module thói quen (Habit), cảm xúc (Mood), nhật ký (Journal) sau này.

Sau khi hoàn thành bước này, backend có khả năng:
* Cung cấp thông tin chi tiết của người dùng hiện tại (Hồ sơ + Cài đặt) thông qua `/users/me`.
* Cập nhật thông tin cá nhân (Họ tên, ngày sinh, giới tính) thông qua `/users/profile`.
* Cập nhật các cấu hình hiển thị & hệ thống (Múi giờ, Theme) thông qua `/users/settings`.
* Đổi mật khẩu bảo mật (So khớp bcrypt, kiểm tra mật khẩu cũ và băm mật khẩu mới) thông qua `/users/password`.

*(Lưu ý: API xóa tài khoản người dùng được lược bỏ theo yêu cầu thực tế của dự án).*

---

## Cấu trúc Database (Prisma Schema thực tế)

Các thông tin hồ sơ và cài đặt chi tiết được liên kết với bảng `User` thông qua bảng `Profile` trong [schema.prisma](file:///c:/Users/ADMIN/Desktop/Personal/server/prisma/schema.prisma):

```prisma
enum Gender {
  MALE
  FEMALE
}

enum Theme {
  LIGHT
  DARK
  SYSTEM
}

model Profile {
  id        String    @id @default(cuid())
  fullName  String?
  avatar    String?
  birthday  DateTime?
  gender    Gender?
  theme     Theme     @default(LIGHT)
  timezone  String    @default("Asia/Ho_Chi_Minh")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## Cấu trúc thư mục triển khai

Module người dùng được triển khai độc lập trong thư mục `src/module/user/` để phân tách rõ ràng với module xác thực:

```text
src/
└── module/
    └── user/
        ├── user.module.ts          # Đăng ký UserController, UserService, UserRepository
        ├── user.controller.ts      # Định nghĩa các endpoints quản lý người dùng
        ├── user.service.ts         # Logic nghiệp vụ xử lý dữ liệu và đổi mật khẩu
        ├── user.repository.ts      # Tương tác với DB (User và Profile) thông qua Prisma
        ├── user.dto.ts             # Các DTO validate dữ liệu đầu vào (Profile, Password, Settings)
        └── user.type.ts            # Định nghĩa UserResponse và các interfaces liên quan
```

---

## Danh sách API Endpoints

Tất cả các API trong module này **bắt buộc** phải được bảo vệ bởi `JwtAuthGuard`.

| Method | Endpoint | Yêu cầu DTO | Mô tả |
| :--- | :--- | :--- | :--- |
| **GET** | `/users/me` | Không | Lấy thông tin tài khoản, hồ sơ và cài đặt của bản thân |
| **PATCH** | `/users/profile` | `UpdateProfileDto` | Cập nhật thông tin cá nhân (Họ tên, ngày sinh, giới tính, ảnh đại diện) |
| **PATCH** | `/users/settings` | `UpdateSettingsDto` | Cập nhật cấu hình hiển thị (Múi giờ, Theme) |
| **PATCH** | `/users/password` | `ChangePasswordDto` | Đổi mật khẩu hiện tại (Yêu cầu mật khẩu cũ) |

---

## Luồng nghiệp vụ chính

### 1. Lấy thông tin bản thân (`GET /users/me`)
*   Lấy `userId` từ token thông qua `request.user.id`.
*   Repository truy vấn bảng `User` đồng thời `include` bảng `Profile` qua quan hệ khóa ngoại `userId`.
*   Chuyển đổi dữ liệu và loại bỏ các trường bảo mật (`password`, `hashedRefreshToken`) trước khi trả về dưới định dạng `UserResponse`.

### 2. Cập nhật hồ sơ & Cài đặt (`PATCH /users/profile` & `PATCH /users/settings`)
*   Dữ liệu được kiểm tra bằng các decorator validation trong `UpdateProfileDto` và `UpdateSettingsDto`.
*   Thực hiện câu lệnh `prisma.profile.update` dựa trên khóa duy nhất `userId`.
*   Trả về dữ liệu người dùng mới sau khi cập nhật thành công dưới dạng `UserResponse`.

### 3. Đổi mật khẩu (`PATCH /users/password`)
*   Tìm thông tin người dùng hiện tại (bao gồm mật khẩu băm cũ).
*   Sử dụng `bcrypt.compare` để kiểm tra `currentPassword` có khớp với mật khẩu trong DB hay không.
*   Kiểm tra mật khẩu mới không trùng mật khẩu cũ và khớp với mật khẩu xác nhận (`confirmPassword`).
*   Băm mật khẩu mới bằng `bcrypt.hash(newPassword, 10)` và cập nhật vào DB.

---

## Thiết Kế DTO & Validation (`user.dto.ts`)

### 1. `UpdateProfileDto`
*   `fullName`: String, optional, từ 2 đến 50 ký tự.
*   `birthday`: Date, optional.
*   `gender`: Enum (Gender), optional.
*   `avatar`: String, optional.

### 2. `UpdateSettingsDto`
*   `theme`: Enum (Theme: `LIGHT`, `DARK`, `SYSTEM`), optional.
*   `timezone`: String, optional.

### 3. `ChangePasswordDto`
*   `currentPassword`: String, bắt buộc, từ 8 đến 100 ký tự.
*   `newPassword`: String, bắt buộc, từ 8 đến 100 ký tự.
*   `confirmPassword`: String, bắt buộc, khớp với `newPassword`.

---

## Cấu trúc dữ liệu trả về chuẩn (UserResponse)

Loại bỏ mật khẩu và các token nhạy cảm, trả về định dạng lồng nhau gọn gàng:

```json
{
  "id": "cuid_string",
  "email": "user@example.com",
  "createdAt": "2026-07-03T09:00:00.000Z",
  "profile": {
    "fullName": "Nguyễn Văn A",
    "avatar": "https://example.com/avatar.png",
    "birthday": "2000-01-01T00:00:00.000Z",
    "gender": "MALE",
    "theme": "LIGHT",
    "timezone": "Asia/Ho_Chi_Minh"
  }
}
```
