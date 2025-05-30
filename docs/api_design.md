# Tài liệu API

## UC01: Đăng ký tài khoản

##### Thông tin kỹ thuật

- **Mục đích**: Tạo tài khoản mới cho người dùng và gửi mã xác thực qua email.
- **Phân tích yêu cầu**:
  - Người dùng cung cấp email và mật khẩu.
  - Email phải duy nhất trong hệ thống.
  - Mật khẩu được mã hóa trước khi lưu.
  - Gửi mã xác thực (4 chữ số) qua email, hết hạn sau 4 phút.
  - Tài khoản được tạo với vai trò mặc định (`USER`) và trạng thái chưa kích hoạt (`enabled=false`).

| Thành phần         | Đặc tả                                                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                                                                    |
| Endpoint           | /api/v1/auth/register                                                                                                                   |
| Authentication     | Không yêu cầu                                                                                                                           |
| Request            | JSON chứa email và password                                                                                                             |
| Response (Success) | JSON chứa thông báo thành công                                                                                                          |
| Response (Error)   | 400 Bad Request (dữ liệu không hợp lệ), 409 Conflict (email đã tồn tại), 500 Internal Server Error (lỗi server hoặc gửi email thất bại) |

##### Request

```json
{
  "name": "example",
  "email": "user@example.com",
  "password": "securepassword123",
  "confirm-password": "securepassword123"
}
```

##### Response (Success)

```json
{
  "message": "Register successfully"
}
```

##### Response (Error)

```json
{
  "error": "USER_ALREADY_EXISTS",
  "message": "Người dùng đã tồn tại"
}
```

## UC02: Xác thực email

##### Thông tin kỹ thuật

- **Mục đích**: Kích hoạt tài khoản bằng cách xác thực mã được gửi qua email.
- **Phân tích yêu cầu**:
  - Người dùng cung cấp email và mã xác thực (4 chữ số).
  - Mã phải khớp với mã đã lưu và chưa hết hạn (4 phút).
  - Sau khi xác thực thành công, tài khoản được kích hoạt (`enabled=true`), và mã xác thực bị xóa.

| Thành phần         | Đặc tả                                                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                                                                     |
| Endpoint           | /api/v1/auth/verify                                                                                                                      |
| Authentication     | Không yêu cầu                                                                                                                            |
| Request            | JSON chứa email và code                                                                                                                  |
| Response (Success) | JSON chứa thông báo thành công                                                                                                           |
| Response (Error)   | 400 Bad Request (mã không hợp lệ), 410 Gone (mã hết hạn hoặc không khớp), 404 Not Found (email không tồn tại), 500 Internal Server Error |

##### Request

```json
{
  "email": "user@example.com",
  "code": "1234"
}
```

##### Response (Success)

```json
{
  "message": "Verify successfully"
}
```

##### Response (Error)

```json
{
  "error": "ACTIVATION_CODE_NOT_MATCH",
  "message": "Invalid or expired verification code."
}
```

## UC03: Đăng nhập

##### Thông tin kỹ thuật

- **Mục đích**: Xác thực người dùng và cấp JWT access token và refresh token.
- **Phân tích yêu cầu**:
  - Yêu cầu email và mật khẩu.
  - Tài khoản phải được kích hoạt (`enabled=true`).
  - Sử dụng Spring Security để xác thực thông tin đăng nhập.
  - Trả về access token và refresh token nếu xác thực thành công.

| Thành phần         | Đặc tả                                                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                                                                     |
| Endpoint           | /api/v1/auth/login                                                                                                                       |
| Authentication     | Không yêu cầu                                                                                                                            |
| Request            | JSON chứa email và password                                                                                                              |
| Response (Success) | JSON chứa access_token và refresh_token                                                                                                  |
| Response (Error)   | 401 Unauthorized (thông tin đăng nhập sai hoặc tài khoản chưa kích hoạt), 404 Not Found (email không tồn tại), 500 Internal Server Error |

##### Request

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

##### Response (Success)

```json
{
  "message": "Login successfully",
  "result": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

##### Response (Error)

```json
{
  "error": "UNAUTHENTICATED",
  "message": "Tài khoản hoặc mật khẩu chưa đúng"
}
```

## UC04: Lấy lại phiên đăng nhập (refresh token)

##### Thông tin kỹ thuật

- **Mục đích**: Cấp lại access token mới bằng refresh token hợp lệ.
- **Phân tích yêu cầu**:
  - Refresh token phải hợp lệ và thuộc về tài khoản đã kích hoạt.
  - Trả về access token mới và giữ nguyên refresh token.

| Thành phần         | Đặc tả                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                                                                                    |
| Endpoint           | /api/v1/auth/refresh-token                                                                                                                              |
| Authentication     | Yêu cầu refresh token hợp lệ                                                                                                                            |
| Request            | JSON chứa refresh_token                                                                                                                                 |
| Response (Success) | JSON chứa access_token và refresh_token                                                                                                                 |
| Response (Error)   | 401 Unauthorized (refresh token không hợp lệ), 404 Not Found (email không tồn tại), 403 Forbidden (tài khoản chưa kích hoạt), 500 Internal Server Error |

##### Request

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### Response (Success)

```json
{
  "message": "Refresh token successfully",
  "result": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

##### Response (Error)

```json
{
  "error": "INVALID_TOKEN",
  "message": "Token không hợp lệ"
}
```

## UC05: Quên mật khẩu

##### Thông tin kỹ thuật

- **Mục đích**: Gửi mã xác thực qua email để đặt lại mật khẩu.
- **Phân tích yêu cầu**:
  - Người dùng cung cấp email đã đăng ký.
  - Gửi mã xác thực (4 chữ số) qua email, hết hạn sau 4 phút.
  - Lưu mã xác thực đã mã hóa và thời gian hết hạn vào cơ sở dữ liệu.

| Thành phần         | Đặc tả                                                                         |
| ------------------ | ------------------------------------------------------------------------------ |
| Method             | POST                                                                           |
| Endpoint           | /api/v1/auth/forgot-password                                                   |
| Authentication     | Không yêu cầu                                                                  |
| Request            | JSON chứa email                                                                |
| Response (Success) | JSON chứa thông báo thành công                                                 |
| Response (Error)   | 404 Not Found (email không tồn tại), 500 Internal Server Error (lỗi gửi email) |

##### Request

```json
{
  "email": "user@example.com"
}
```

##### Response (Success)

```json
{
  "message": "Forgot password successfully"
}
```

##### Response (Error)

```json
{
  "error": "500",
  "message": "Internal Server Error"
}
```

## UC06: ResetPassword

##### Thông tin kỹ thuật

- **Mục đích**: Đặt lại mật khẩu bằng mã xác thực.
- **Phân tích yêu cầu**:
  - Yêu cầu email, mã xác thực, và mật khẩu mới.
  - Mã xác thực phải khớp và chưa hết hạn (4 phút).
  - Mật khẩu mới được mã hóa trước khi lưu.
  - Xóa mã xác thực và thời gian hết hạn sau khi đặt lại thành công.

| Thành phần         | Đặc tả                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                              |
| Endpoint           | /api/v1/auth/reset-password                                                                       |
| Authentication     | Không yêu cầu                                                                                     |
| Request            | JSON chứa email, code, và new_password                                                            |
| Response (Success) | JSON chứa thông báo thành công                                                                    |
| Response (Error)   | 400 Bad Request (mã không hợp lệ), 404 Not Found (email không tồn tại), 500 Internal Server Error |

##### Request

```json
{
  "email": "user@example.com",
  "code": "1234",
  "new_password": "newsecurepassword123"
}
```

##### Response (Success)

```json
{
  "message": "Reset password successfully"
}
```

##### Response (Error)

```json
{
  "error": "ACTIVATION_CODE_NOT_MATCH",
  "message": "Mã kích hoạt không đúng"
}
```

## UC07: Đăng xuất

##### Thông tin kỹ thuật

- **Mục đích**: Kết thúc phiên đăng nhập của người dùng.
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập (yêu cầu access token hợp lệ).
  - Xóa hoặc vô hiệu hóa refresh token trong hệ thống.
  - Xóa thông tin xác thực khỏi SecurityContext.
  - **Lưu ý**: Chưa có triển khai trong mã nguồn cung cấp.

| Thành phần         | Đặc tả                                                                               |
| ------------------ | ------------------------------------------------------------------------------------ |
| Method             | POST                                                                                 |
| Endpoint           | /api/v1/logout                                                                       |
| Authentication     | Bắt buộc (access token hợp lệ)                                                       |
| Request            | Không cần thêm tham số ngoài thông tin xác thực                                      |
| Response (Success) | JSON chứa thông báo thành công                                                       |
| Response (Error)   | 401 Unauthorized (chưa đăng nhập hoặc token không hợp lệ), 500 Internal Server Error |

##### Response (Success)

```json
{
  "message": "Logged out successfully."
}
```

##### Response (Error)

```json
{
  "error": "UNAUTHENTICATED",
  "message": "Tài khoản hoặc mật khẩu chưa đúng"
}
```

## UC08: Xem hồ sơ cá nhân

##### Thông tin kỹ thuật

- **Mục đích**: Lấy thông tin của người dùng đang đăng nhập.

| Thành phần         | Đặc tả                                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Method             | GET                                                                                                               |
| Endpoint           | /api/v1/me                                                                                                        |
| Authentication     | Bắt buộc. Server cần biết ai đang yêu cầu để trả về đúng hồ sơ                                                    |
| Request            | Không cần thêm tham số nào ngoài thông tin xác thực                                                               |
| Response (Success) | JSON chứa thông tin người dùng (ví dụ: user_id, username, email, full_name, bio, profile_picture_url, created_at) |
| Response (Error)   | 401 Unauthorized (nếu chưa đăng nhập), 500 Internal Server Error                                                  |

##### Response (Success)

```json
{
  "user_id": "123456789",
  "full_name": "Đỗ Thành Đạt",
  "bio": "Code by day, dream by night",
  "avt_url": "https://poops.com/dat.jpg",
  "posts_count": [],
  "followers_count": [],
  "following_count": [],
  "is_verified": true,
  "joined_at": "2024-01-01T08:00:00Z",
  "email": "dat@example.com"
}
```

## UC09: Chỉnh sửa hồ sơ cá nhân

##### Thông tin kỹ thuật

- **Mục đích**: Cập nhật thông tin hồ sơ của người dùng đang đăng nhập.
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập để chỉnh sửa hồ sơ.
  - Chỉ có thể chỉnh sửa hồ sơ của chính mình.
  - Các trường có thể chỉnh sửa: full_name, bio, dob, gender.
  - Tên người dùng và email phải duy nhất trong hệ thống (kiểm tra không được thực hiện trong mã hiện tại).
  - Cần xác thực dữ liệu đầu vào.

| Thành phần         | Đặc tả                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Method             | PATCH                                                                                                                                          |
| Endpoint           | /api/v1/users/update-info                                                                                                                      |
| Authentication     | Bắt buộc                                                                                                                                       |
| Request            | JSON chứa các trường cần cập nhật: full_name, bio, dob, gender                                                                                 |
| Response (Success) | JSON chứa thông tin hồ sơ đã cập nhật                                                                                                          |
| Response (Error)   | 400 Bad Request (dữ liệu không hợp lệ), 401 Unauthorized (chưa đăng nhập), 404 Not Found (người dùng không tồn tại), 500 Internal Server Error |

##### Request

```json
{
  "full_name": "Đỗ Thành Đạt",
  "bio": "Updated bio"
}
```

##### Response (Success)

```json
{
  "message": "Update info successfully",
  "result": {
    "id": "123456789",
    "email": "dat@example.com",
    "full_name": "Đỗ Thành Đạt",
    "bio": "Updated bio",
    "avt_url": "https://poops.com/dat.jpg"
  }
}
```

##### Response (Error)

```json
{
  "error": "NOT_FOUND_USER",
  "message": "Không tìm thấy người dùng"
}
```

## UC10: Xem hồ sơ người dùng khác

##### Thông tin kỹ thuật

- **Mục đích**: Lấy thông tin hồ sơ của một người dùng khác.
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập để xem hồ sơ.
  - Có thể xem hồ sơ của bất kỳ người dùng nào trong hệ thống.
  - Thông tin hiển thị bao gồm: id, email, full_name, bio, dob, gender, avt_url, profile_url, followers, following.

| Thành phần         | Đặc tả                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| Method             | GET                                                                                                |
| Endpoint           | /api/v1/users/profile/{userId}                                                                     |
| Authentication     | Bắt buộc                                                                                           |
| Request            | Path parameter: userId                                                                             |
| Response (Success) | JSON chứa thông tin người dùng                                                                     |
| Response (Error)   | 401 Unauthorized (chưa đăng nhập), 404 Not Found (userId không tồn tại), 500 Internal Server Error |

##### Response (Success)

```json
{
  "message": "Get profile successfully",
  "result": {
    "id": "987654321",
    "full_name": "Nguyễn Văn B",
    "bio": "Living the dream",
    "avt_url": "https://poops.com/other.jpg",
    "followers": [],
    "following": [],
    "posts": []
  }
}
```

##### Response (Error)

```json
{
  "error": "NOT_FOUND_USER",
  "message": "Không tìm thấy người dùng"
}
```

## UC11: Thay đổi avatar image

##### Thông tin kỹ thuật

- **Mục đích**: Cập nhật ảnh đại diện của người dùng.
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập.
  - **Lưu ý**: Chưa được triển khai đầy đủ trong mã nguồn (`UserService.changeAvatar` trả về null).
  - Hỗ trợ định dạng ảnh: JPEG, PNG (giả định).
  - Kích thước file tối đa: 5MB (giả định).

| Thành phần         | Đặc tả                                                                           |
| ------------------ | -------------------------------------------------------------------------------- |
| Method             | PATCH                                                                            |
| Endpoint           | /api/v1/users/change-avatar-image                                                |
| Authentication     | Bắt buộc                                                                         |
| Request            | Form-data chứa file ảnh (avatar)                                                 |
| Response (Success) | JSON chứa thông báo thành công                                                   |
| Response (Error)   | 400 Bad Request (file không hợp lệ), 401 Unauthorized, 500 Internal Server Error |

##### Response (Success)

```json
{
  "message": "Change avatar successfully",
  "result": "Updated user avatar"
}
```

##### Response (Error)

```json
{
  "error": "INVALID_FILE",
  "message": "Invalid file format or size."
}
```

## UC13: Thay đổi mật khẩu

##### Thông tin kỹ thuật

- **Mục đích**: Cập nhật mật khẩu của người dùng đang đăng nhập.
- **Phân tích yêu cầu**:
  - Yêu cầu mật khẩu hiện tại (old_password), mật khẩu mới (new_password), và xác nhận mật khẩu mới (confirm_password).
  - Mật khẩu mới phải khớp với xác nhận mật khẩu.
  - Mật khẩu hiện tại phải đúng.

| Thành phần         | Đặc tả                                                                                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Method             | PATCH                                                                                                                                                                  |
| Endpoint           | /api/v1/users/change-password                                                                                                                                          |
| Authentication     | Bắt buộc                                                                                                                                                               |
| Request            | JSON chứa old_password, new_password, confirm_password                                                                                                                 |
| Response (Success) | JSON chứa thông báo thành công                                                                                                                                         |
| Response (Error)   | 400 Bad Request (mật khẩu không hợp lệ hoặc không khớp), 401 Unauthorized (mật khẩu hiện tại sai), 404 Not Found (người dùng không tồn tại), 500 Internal Server Error |

##### Request

```json
{
  "old_password": "oldpassword123",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

##### Response (Success)

```json
{
  "message": "Change password successfully"
}
```

##### Response (Error)

```json
{
  "error": "INVALID_PASSWORD",
  "message": "Mật khẩu không khớp"
}
```

## UC14: Theo dõi người dùng

##### Thông tin kỹ thuật

- **Mục đích**: Cho phép người dùng theo dõi một người dùng khác.
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập.
  - Không thể theo dõi chính mình.
  - Tăng followers_count của người được theo dõi và following_count của người theo dõi.

| Thành phần         | Đặc tả                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                               |
| Endpoint           | /api/v1/users/{user_id}/follow                                                                     |
| Authentication     | Bắt buộc                                                                                           |
| Request            | Path parameter: user_id                                                                            |
| Response (Success) | JSON chứa thông báo thành công                                                                     |
| Response (Error)   | 400 Bad Request (user_id không hợp lệ), 401 Unauthorized, 404 Not Found, 500 Internal Server Error |

##### Response (Success)

```json
{
  "message": "Followed user successfully."
}
```

## UC15: Bỏ theo dõi người dùng

##### Thông tin kỹ thuật

- **Mục đích**: Cho phép người dùng bỏ theo dõi một người dùng khác.
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập.
  - Giảm followers_count của người bị bỏ theo dõi và following_count của người bỏ theo dõi.

| Thành phần         | Đặc tả                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                               |
| Endpoint           | /api/v1/users/{user_id}/unfollow                                                                   |
| Authentication     | Bắt buộc                                                                                           |
| Request            | Path parameter: user_id                                                                            |
| Response (Success) | JSON chứa thông báo thành công                                                                     |
| Response (Error)   | 400 Bad Request (user_id không hợp lệ), 401 Unauthorized, 404 Not Found, 500 Internal Server Error |

##### Response (Success)

```json
{
  "message": "Unfollowed user successfully."
}
```

## UC17: Tìm kiếm user

##### Thông tin kỹ thuật

- **Mục đích**: Tìm kiếm người dùng dựa trên tên người dùng hoặc email.
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập.
  - Hỗ trợ tìm kiếm gần đúng (fuzzy search).
  - Giới hạn số lượng kết quả trả về (ví dụ: 50).

| Thành phần         | Đặc tả                                                                            |
| ------------------ | --------------------------------------------------------------------------------- |
| Method             | GET                                                                               |
| Endpoint           | /api/v1/users/search?query={search_term}                                          |
| Authentication     | Bắt buộc                                                                          |
| Request            | Query parameter: query                                                            |
| Response (Success) | JSON chứa danh sách người dùng khớp với tìm kiếm                                  |
| Response (Error)   | 400 Bad Request (query không hợp lệ), 401 Unauthorized, 500 Internal Server Error |

##### Response (Success)

```json
{
  "users": [
    {
      "user_id": "987654321",
      "username": "otheruser",
      "full_name": "Nguyễn Văn B"
    }
  ]
}
```

## UC18: Tạo bài viết

##### Thông tin kỹ thuật

- **Mục đích**: Tạo một bài viết mới.
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập.
  - Hỗ trợ nội dung văn bản và hình ảnh.
  - Tăng posts_count của người dùng sau khi tạo bài viết.

| Thành phần         | Đặc tả                                                                               |
| ------------------ | ------------------------------------------------------------------------------------ |
| Method             | POST                                                                                 |
| Endpoint           | /api/v1/posts                                                                        |
| Authentication     | Bắt buộc                                                                             |
| Request            | Form-data chứa content (văn bản) và images (ảnh)                                     |
| Response (Success) | JSON chứa thông tin bài viết vừa tạo                                                 |
| Response (Error)   | 400 Bad Request (nội dung không hợp lệ), 401 Unauthorized, 500 Internal Server Error |

##### Response (Success)

```json
{
  "post_id": "post123",
  "user_id": "123456789",
  "content": "My first post!",
  "images": ["https://poops.com/image1.jpg"],
  "created_at": "2025-05-26T14:24:00Z"
}
```

## UC19: Xem chi tiết bài viết

##### Thông tin kỹ thuật

- **Mục đích**: Lấy thông tin chi tiết của một bài viết.
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập.
  - Trả về nội dung bài viết, thông tin người đăng, và số lượng lượt thích/bình luận.

| Thành phần         | Đặc tả                                                     |
| ------------------ | ---------------------------------------------------------- |
| Method             | GET                                                        |
| Endpoint           | /api/v1/posts/{post_id}                                    |
| Authentication     | Bắt buộc                                                   |
| Request            | Path parameter: post_id                                    |
| Response (Success) | JSON chứa thông tin bài viết                               |
| Response (Error)   | 401 Unauthorized, 404 Not Found, 500 Internal Server Error |

##### Response (Success)

```json
{
  "post_id": "post123",
  "user_id": "123456789",
  "username": "datbavip10",
  "content": "My first post!",
  "images": ["https://poops.com/image1.jpg"],
  "likes_count": 100,
  "comments_count": 20,
  "created_at": "2025-05-26T14:24:00Z"
}
```

## UC20: Xem tất cả bài viết của người dùng

##### Thông tin kỹ thuật

- **Mục đích**: Lấy danh sách bài viết của một người dùng.
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập.
  - Hỗ trợ phân trang (limit, offset).

| Thành phần         | Đặc tả                                                      |
| ------------------ | ----------------------------------------------------------- |
| Method             | GET                                                         |
| Endpoint           | /api/v1/users/{user_id}/posts?limit={limit}&offset={offset} |
| Authentication     | Bắt buộc                                                    |
| Request            | Path parameter: user_id; Query parameters: limit, offset    |
| Response (Success) | JSON chứa danh sách bài viết                                |
| Response (Error)   | 401 Unauthorized, 404 Not Found, 500 Internal Server Error  |

##### Response (Success)

```json
{
  "posts": [
    {
      "post_id": "post123",
      "content": "My first post!",
      "created_at": "2025-05-26T14:24:00Z"
    }
  ],
  "total": 120
}
```

## UC21: Xóa bài viết

##### Thông tin kỹ thuật

- **Mục đích**: Xóa bài viết của người dùng hiện tại.
- **Phân tích yêu cầu**:
  - Người dùng chỉ có thể xóa bài viết của chính mình.
  - Giảm posts_count sau khi xóa.

| Thành phần         | Đặc tả                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| Method             | DELETE                                                                                                         |
| Endpoint           | /api/v1/posts/{post_id}                                                                                        |
| Authentication     | Bắt buộc                                                                                                       |
| Request            | Path parameter: post_id                                                                                        |
| Response (Success) | JSON chứa thông báo thành công                                                                                 |
| Response (Error)   | 401 Unauthorized, 403 Forbidden (không phải bài viết của người dùng), 404 Not Found, 500 Internal Server Error |

##### Response (Success)

```json
{
  "message": "Post deleted successfully."
}
```

## UC22: Sửa bài viết

##### Thông tin kỹ thuật

- **Mục đích**: Chỉnh sửa nội dung bài viết của người dùng hiện tại.
- **Phân tích yêu cầu**:
  - Người dùng chỉ có thể sửa bài viết của chính mình.
  - Hỗ trợ cập nhật văn bản và hình ảnh.

| Thành phần         | Đặc tả                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Method             | PUT                                                                                        |
| Endpoint           | /api/v1/posts/{post_id}                                                                    |
| Authentication     | Bắt buộc                                                                                   |
| Request            | Form-data chứa content (văn bản) và thêm images                                            |
| Response (Success) | JSON chứa thông tin bài viết đã cập nhật                                                   |
| Response (Error)   | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error |

##### Response (Success)

```json
{
  "post_id": "post123",
  "content": "Updated post content!",
  "images": ["https://poops.com/image2.jpg"],
  "updated_at": "2025-05-26T15:00:00Z"
}
```

## UC23: Ẩn bài viết

##### Thông tin kỹ thuật

- **Mục đích**: Ẩn bài viết khỏi chế độ công khai.
- **Phân tích yêu cầu**:
  - Người dùng chỉ có thể ẩn bài viết của chính mình.
  - Bài viết vẫn có thể xem bởi người đăng.

| Thành phần         | Đặc tả                                                                    |
| ------------------ | ------------------------------------------------------------------------- |
| Method             | POST                                                                      |
| Endpoint           | /api/v1/posts/{post_id}/hide                                              |
| Authentication     | Bắt buộc                                                                  |
| Request            | Path parameter: post_id                                                   |
| Response (Success) | JSON chứa thông báo thành công                                            |
| Response (Error)   | 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error |

##### Response (Success)

```json
{
  "message": "Post hidden successfully."
}
```

## UC24: New feed (global | network)

##### Thông tin kỹ thuật

- **Mục đích**: Hiển thị danh sách bài viết từ tất cả người dùng (global) hoặc từ những người người dùng theo dõi (network).
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập.
  - Hỗ trợ phân trang và lọc theo loại (global/network).

| Thành phần         | Đặc tả                                                       |
| ------------------ | ------------------------------------------------------------ | -------------------------------------- |
| Method             | GET                                                          |
| Endpoint           | /api/v1/feed?type={global                                    | network}&limit={limit}&offset={offset} |
| Authentication     | Bắt buộc                                                     |
| Request            | Query parameters: type, limit, offset                        |
| Response (Success) | JSON chứa danh sách bài viết                                 |
| Response (Error)   | 400 Bad Request, 401 Unauthorized, 500 Internal Server Error |

##### Response (Success)

```json
{
  "posts": [
    {
      "post_id": "post123",
      "user_id": "123456789",
      "username": "datbavip10",
      "content": "My first post!",
      "created_at": "2025-05-26T14:24:00Z"
    }
  ],
  "total": 100
}
```

## UC25: Bình luận bài viết

##### Thông tin kỹ thuật

- **Mục đích**: Thêm bình luận vào bài viết.
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập.
  - Tăng comments_count của bài viết.

| Thành phần         | Đặc tả                                                                      |
| ------------------ | --------------------------------------------------------------------------- |
| Method             | POST                                                                        |
| Endpoint           | /api/v1/posts/{post_id}/comments                                            |
| Authentication     | Bắt buộc                                                                    |
| Request            | JSON chứa content (nội dung bình luận)                                      |
| Response (Success) | JSON chứa thông tin bình luận vừa tạo                                       |
| Response (Error)   | 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error |

##### Request

```json
{
  "content": "Great post!"
}
```

##### Response (Success)

```json
{
  "comment_id": "comment123",
  "post_id": "post123",
  "user_id": "123456789",
  "content": "Great post!",
  "created_at": "2025-05-26T15:10:00Z"
}
```

## UC27: Xóa bình luận

##### Thông tin kỹ thuật

- **Mục đích**: Xóa bình luận của người dùng hiện tại.
- **Phân tích yêu cầu**:
  - Người dùng chỉ có thể xóa bình luận của chính mình.
  - Giảm comments_count của bài viết.

| Thành phần         | Đặc tả                                                                    |
| ------------------ | ------------------------------------------------------------------------- |
| Method             | DELETE                                                                    |
| Endpoint           | /api/v1/comments/{comment_id}                                             |
| Authentication     | Bắt buộc                                                                  |
| Request            | Path parameter: comment_id                                                |
| Response (Success) | JSON chứa thông báo thành công                                            |
| Response (Error)   | 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error |

##### Response (Success)

```json
{
  "message": "Comment deleted successfully."
}
```

## UC28: Trả lời bình luận

##### Thông tin kỹ thuật

- **Mục đích**: Thêm phản hồi cho một bình luận.
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập.
  - Phản hồi được gắn với bình luận cha.

| Thành phần         | Đặc tả                                                                      |
| ------------------ | --------------------------------------------------------------------------- |
| Method             | POST                                                                        |
| Endpoint           | /api/v1/comments/{comment_id}/replies                                       |
| Authentication     | Bắt buộc                                                                    |
| Request            | JSON chứa content (nội dung trả lời)                                        |
| Response (Success) | JSON chứa thông tin phản hồi vừa tạo                                        |
| Response (Error)   | 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error |

##### Request

```json
{
  "content": "Thanks for your comment!"
}
```

##### Response (Success)

```json
{
  "reply_id": "reply123",
  "comment_id": "comment123",
  "user_id": "123456789",
  "content": "Thanks for your comment!",
  "created_at": "2025-05-26T15:20:00Z"
}
```

## UC30: Xóa trả lời bình luận

##### Thông tin kỹ thuật

- **Mục đích**: Xóa phản hồi của người dùng hiện tại.
- **Phân tích yêu cầu**:
  - Người dùng chỉ có thể xóa phản hồi của chính mình.

| Thành phần         | Đặc tả                                                                    |
| ------------------ | ------------------------------------------------------------------------- |
| Method             | DELETE                                                                    |
| Endpoint           | /api/v1/replies/{reply_id}                                                |
| Authentication     | Bắt buộc                                                                  |
| Request            | Path parameter: reply_id                                                  |
| Response (Success) | JSON chứa thông báo thành công                                            |
| Response (Error)   | 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error |

##### Response (Success)

```json
{
  "message": "Reply deleted successfully."
}
```

## UC31: Gửi tin nhắn

##### Thông tin kỹ thuật

- **Mục đích**: Gửi tin nhắn trực tiếp đến một người dùng khác.
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập.
  - Người nhận phải tồn tại và không chặn người gửi.

| Thành phần         | Đặc tả                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                                 |
| Endpoint           | /api/v1/messages                                                                                     |
| Authentication     | Bắt buộc                                                                                             |
| Request            | JSON chứa recipient_id và content                                                                    |
| Response (Success) | JSON chứa thông tin tin nhắn vừa gửi                                                                 |
| Response (Error)   | 400 Bad Request, 401 Unauthorized, 403 Forbidden (bị chặn), 404 Not Found, 500 Internal Server Error |

##### Request

```json
{
  "recipient_id": "987654321",
  "content": "Hello!"
}
```

##### Response (Success)

```json
{
  "message_id": "msg123",
  "sender_id": "123456789",
  "recipient_id": "987654321",
  "content": "Hello!",
  "created_at": "2025-05-26T15:30:00Z"
}
```

## UC33: Xóa tin nhắn

##### Thông tin kỹ thuật

- **Mục đích**: Xóa tin nhắn của người dùng hiện tại.
- **Phân tích yêu cầu**:
  - Người dùng chỉ có thể xóa tin nhắn mà họ là người gửi hoặc người nhận.

| Thành phần         | Đặc tả                                                                    |
| ------------------ | ------------------------------------------------------------------------- |
| Method             | DELETE                                                                    |
| Endpoint           | /api/v1/messages/{message_id}                                             |
| Authentication     | Bắt buộc                                                                  |
| Request            | Path parameter: message_id                                                |
| Response (Success) | JSON chứa thông báo thành công                                            |
| Response (Error)   | 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error |

##### Response (Success)

```json
{
  "message": "Message deleted successfully."
}
```

## UC34: Xem lịch sử tin nhắn

##### Thông tin kỹ thuật

- **Mục đích**: Lấy danh sách tin nhắn giữa người dùng hiện tại và một người dùng khác.
- **Phân tích yêu cầu**:
  - Người dùng phải đăng nhập.
  - Hỗ trợ phân trang.

| Thành phần         | Đặc tả                                                           |
| ------------------ | ---------------------------------------------------------------- |
| Method             | GET                                                              |
| Endpoint           | /api/v1/messages/history/{user_id}?limit={limit}&offset={offset} |
| Authentication     | Bắt buộc                                                         |
| Request            | Path parameter: user_id; Query parameters: limit, offset         |
| Response (Success) | JSON chứa danh sách tin nhắn                                     |
| Response (Error)   | 401 Unauthorized, 404 Not Found, 500 Internal Server Error       |

##### Response (Success)

```json
{
  "messages": [
    {
      "message_id": "msg123",
      "sender_id": "123456789",
      "recipient_id": "987654321",
      "content": "Hello!",
      "created_at": "2025-05-26T15:30:00Z"
    }
  ],
  "total": 10
}
```

## UC35: Push thông báo (new_post | comment_post | like_post | follow | reply_comment)

##### Thông tin kỹ thuật

- **Mục đích**: Gửi thông báo đến người dùng khi có bài viết mới, bình luận, hoặc lượt thích.
- **Phân tích yêu cầu**:
  - Hệ thống tự động gửi thông báo.
  - Người dùng có thể tắt thông báo trong cài đặt.

| Thành phần         | Đặc tả                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| Method             | POST                                                                   |
| Endpoint           | /api/v1/notifications                                                  |
| Authentication     | Bắt buộc (hệ thống thực hiện)                                          |
| Request            | JSON chứa type (new_post, comment_post, like_post), target_id, user_id |
| Response (Success) | JSON chứa thông báo thành công                                         |
| Response (Error)   | 400 Bad Request, 500 Internal Server Error                             |

##### Request

```json
{
  "type": "new_post",
  "target_id": "post123",
  "user_id": "987654321"
}
```

##### Response (Success)

```json
{
  "message": "Notification sent successfully."
}
```

## UC36: Đọc tin nhắn

##### Thông tin kỹ thuật

- **Mục đích**: Đánh dấu tin nhắn là đã đọc.
- **Phân tích yêu cầu**:
  - Người dùng chỉ có thể đánh dấu tin nhắn mà họ là người nhận.

| Thành phần         | Đặc tả                                                                    |
| ------------------ | ------------------------------------------------------------------------- |
| Method             | POST                                                                      |
| Endpoint           | /api/v1/messages/{message_id}/read                                        |
| Authentication     | Bắt buộc                                                                  |
| Request            | Path parameter: message_id                                                |
| Response (Success) | JSON chứa thông báo thành công                                            |
| Response (Error)   | 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error |

##### Response (Success)

```json
{
  "message": "Message marked as read."
}
```
