# Git commit

Sử dụng định dạng chuẩn **Conventional Commits** cho tất cả các thông báo commit.

## Cú pháp cơ bản
`<type>(<scope>): <message>`

### Ví dụ
* `feat(auth): add login and register endpoints`
* `fix(habit): correct streak calculation bug`
* `docs(readme): update setup instructions`
* `refactor(user): clean up validation logic`
* `chore(deps): update prisma version`

### Các loại (Types) được phép sử dụng
* **feat**: Thêm một tính năng mới (Ví dụ: tạo module mới, thêm chức năng mới).
* **fix**: Sửa một lỗi (bug).
* **docs**: Các thay đổi chỉ liên quan đến tài liệu (ví dụ: cập nhật file `.md`, Swagger).
* **style**: Các thay đổi không làm ảnh hưởng đến logic của code (khoảng trắng, format, xóa dấu chấm phẩy thừa...).
* **refactor**: Một thay đổi về code không sửa lỗi cũng không thêm tính năng (ví dụ: đổi tên biến, tối ưu hóa thuật toán).
* **perf**: Thay đổi code để cải thiện hiệu năng.
* **test**: Thêm các test case bị thiếu hoặc sửa test hiện có.
* **chore**: Cập nhật các tác vụ liên quan đến quá trình build, cấu hình tool (ví dụ: thêm dependencies vào package.json).

### Quy tắc quan trọng
1. Cả `type` và `scope` đều phải viết thường (lowercase).
2. Phần `scope` (phạm vi) nằm trong ngoặc đơn, mô tả module bị thay đổi (ví dụ: `auth`, `habit`, `user`, `ui`, v.v.).
3. Phần `message` ghi tóm tắt mục đích commit, khuyến khích viết bằng tiếng Anh ngắn gọn ở thì hiện tại (dùng `add` thay vì `added`).