# Comprehensive Test Cases for Social Media Application

## 1. Đăng ký (Signup)

| **ID** | **Mô tả**                          | **Điều kiện tiên quyết**                            | **Bước thực hiện**                                                                         | **Dữ liệu đầu vào**                                                            | **Kết quả mong đợi**                                                          |
| ------ | ---------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| TC_001 | Đăng ký với thông tin hợp lệ       | Không có tài khoản với email đã nhập                | 1. Đi đến trang đăng ký<br>2. Nhập email, mật khẩu, xác nhận mật khẩu<br>3. Nhấn "Đăng ký" | Email: "test@abc.com"<br>Mật khẩu: "Abc12345"<br>Xác nhận mật khẩu: "Abc12345" | Tài khoản được tạo, hiển thị thông báo: "Vui lòng kiểm tra email để xác minh" |
| TC_002 | Đăng ký với email đã tồn tại       | Có tài khoản với email đã nhập                      | 1. Đi đến trang đăng ký<br>2. Nhập email, mật khẩu, xác nhận mật khẩu<br>3. Nhấn "Đăng ký" | Email: "test@abc.com"<br>Mật khẩu: "Abc12345"<br>Xác nhận mật khẩu: "Abc12345" | Hiển thị thông báo lỗi: "Email đã được sử dụng"                               |
| TC_003 | Đăng ký với email sai định dạng    | Không có                                            | 1. Đi đến trang đăng ký<br>2. Nhập email, mật khẩu, xác nhận mật khẩu<br>3. Nhấn "Đăng ký" | Email: "test@abc"<br>Mật khẩu: "Abc12345"<br>Xác nhận mật khẩu: "Abc12345"     | Hiển thị thông báo lỗi: "Email không đúng định dạng"                          |
| TC_004 | Đăng ký với mật khẩu không khớp    | Không có                                            | 1. Đi đến trang đăng ký<br>2. Nhập email, mật khẩu, xác nhận mật khẩu<br>3. Nhấn "Đăng ký" | Email: "test@abc.com"<br>Mật khẩu: "Abc12345"<br>Xác nhận mật khẩu: "Abc12346" | Hiển thị thông báo lỗi: "Mật khẩu xác nhận không khớp"                        |
| TC_005 | Xác minh email với mã hợp lệ       | Tài khoản đã đăng ký, mã xác minh được gửi          | 1. Mở email xác minh<br>2. Nhập mã xác minh<br>3. Nhấn "Xác minh"                          | Mã xác minh: "123456"                                                          | Tài khoản được xác minh, hiển thị thông báo: "Xác minh thành công"            |
| TC_006 | Xác minh email với mã không hợp lệ | Tài khoản đã đăng ký, mã xác minh được gửi          | 1. Mở email xác minh<br>2. Nhập mã xác minh<br>3. Nhấn "Xác minh"                          | Mã xác minh: "654321"                                                          | Hiển thị thông báo lỗi: "Mã xác minh không đúng"                              |
| TC_007 | Xác minh email với mã hết hạn      | Tài khoản đã đăng ký, mã xác minh đã gửi quá 4 phút | 1. Mở email xác minh<br>2. Nhập mã xác minh<br>3. Nhấn "Xác minh"                          | Mã xác minh: "123456"                                                          | Hiển thị thông báo lỗi: "Mã xác minh đã hết hạn", gửi lại mã xác minh                              |

## 2. Đăng nhập (Login)

| **ID** | **Mô tả**                             | **Điều kiện tiên quyết**                 | **Bước thực hiện**                                                                   | **Dữ liệu đầu vào**                               | **Kết quả mong đợi**                                     |
| ------ | ------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------- | -------------------------------------------------------- |
| TC_008 | Đăng nhập với thông tin hợp lệ        | Tài khoản đã đăng ký và xác minh         | 1. Đi đến trang đăng nhập<br>2. Nhập email, mật khẩu<br>3. Nhấn "Đăng nhập"          | Email: "test@abc.com"<br>Mật khẩu: "Abc12345"     | Đăng nhập thành công, chuyển đến trang chủ               |
| TC_009 | Đăng nhập với email không tồn tại     | Không có tài khoản với email đã nhập     | 1. Đi đến trang đăng nhập<br>2. Nhập email, mật khẩu<br>3. Nhấn "Đăng nhập"          | Email: "notexist@abc.com"<br>Mật khẩu: "Abc12345" | Hiển thị thông báo lỗi: "Email hoặc mật khẩu không đúng" |
| TC_010 | Đăng nhập với mật khẩu sai            | Tài khoản đã đăng ký và xác minh         | 1. Đi đến trang đăng nhập<br>2. Nhập email, mật khẩu<br>3. Nhấn "Đăng nhập"          | Email: "test@abc.com"<br>Mật khẩu: "Wrong12345"   | Hiển thị thông báo lỗi: "Email hoặc mật khẩu không đúng" |
| TC_011 | Đăng nhập với tài khoản chưa xác minh | Tài khoản đã đăng ký nhưng chưa xác minh | 1. Đi đến trang đăng nhập<br>2. Nhập email, mật khẩu<br>3. Nhấn "Đăng nhập"          | Email: "test@abc.com"<br>Mật khẩu: "Abc12345"     | Hiển thị thông báo lỗi: "Email hoặc mật khẩu không đúng" |
| TC_012 | Đăng nhập với email trống             | Không có                                 | 1. Đi đến trang đăng nhập<br>2. Để trống email, nhập mật khẩu<br>3. Nhấn "Đăng nhập" | Email: ""<br>Mật khẩu: "Abc12345"                 | Hiển thị thông báo lỗi: "Email không đúng định dạng" |
| TC_013 | Đăng nhập với mật khẩu trống          | Không có                                 | 1. Đi đến trang đăng nhập<br>2. Nhập email, để trống mật khẩu<br>3. Nhấn "Đăng nhập" | Email: "test@abc.com"<br>Mật khẩu: ""             | Hiển thị thông báo lỗi: "Email hoặc mật khẩu không đúng" |
| TC_014 | Đăng nhập khi tài khoản bị khóa       | Tài khoản đã bị khóa bởi quản trị viên   | 1. Đi đến trang đăng nhập<br>2. Nhập email, mật khẩu<br>3. Nhấn "Đăng nhập"          | Email: "test@abc.com"<br>Mật khẩu: "Abc12345"     | Hiển thị thông báo lỗi: "Email hoặc mật khẩu không đúng" |

## 3. Quên mật khẩu (Forgot Password)

| **ID** | **Mô tả**                                   | **Điều kiện tiên quyết**             | **Bước thực hiện**                                                                  | **Dữ liệu đầu vào**                                              | **Kết quả mong đợi**                                                      |
| ------ | ------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------- |
| TC_015 | Yêu cầu khôi phục mật khẩu với email hợp lệ | Tài khoản đã đăng ký và xác minh     | 1. Đi đến trang quên mật khẩu<br>2. Nhập email<br>3. Nhấn "Gửi mã"                  | Email: "test@abc.com"                                            | Hiển thị thông báo: "Mã khôi phục đã được gửi đến email của bạn"          |
| TC_016 | Yêu cầu khôi phục với email không tồn tại   | Không có tài khoản với email đã nhập | 1. Đi đến trang quên mật khẩu<br>2. Nhập email<br>3. Nhấn "Gửi mã"                  | Email: "notexist@abc.com"                                        | Hiển thị thông báo lỗi: "Email không tồn tại"                             |
| TC_017 | Đặt lại mật khẩu với mã xác minh hợp lệ     | Mã khôi phục đã được gửi             | 1. Nhập mã xác minh<br>2. Nhập mật khẩu mới, xác nhận mật khẩu<br>3. Nhấn "Đặt lại" | Mã: "123456"<br>Mật khẩu mới: "New12345"<br>Xác nhận: "New12345" | Mật khẩu được cập nhật, hiển thị thông báo: "Đặt lại mật khẩu thành công" |
| TC_018 | Đặt lại mật khẩu với mã không hợp lệ        | Mã khôi phục đã được gửi             | 1. Nhập mã xác minh<br>2. Nhập mật khẩu mới, xác nhận mật khẩu<br>3. Nhấn "Đặt lại" | Mã: "654321"<br>Mật khẩu mới: "New12345"<br>Xác nhận: "New12345" | Hiển thị thông báo lỗi: "Mã xác minh không đúng"                          |

## 4. Đăng bài viết

| **ID** | **Mô tả**                                    | **Điều kiện tiên quyết** | **Bước thực hiện**                                                                        | **Dữ liệu đầu vào**                                    | **Kết quả mong đợi**                                         |
| ------ | -------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| TC_019 | Đăng bài viết với nội dung hợp lệ            | Người dùng đã đăng nhập  | 1. Đi đến trang tạo bài viết<br>2. Nhập nội dung<br>3. Nhấn "Đăng"                        | Nội dung: "Hello world!"<br>Hình ảnh: Có hình ảnh      | Bài viết được đăng thành công, xuất hiện trên dòng thời gian |
| TC_020 | Đăng bài viết với nội dung trống             | Người dùng đã đăng nhập  | 1. Đi đến trang tạo bài viết<br>2. Để trống nội dung<br>3. Nhấn "Đăng"                    | Nội dung: ""<br>Hình ảnh: Có hình ảnh                  | Vô hiệu hóa nút đăng bài                                     |
| TC_021 | Đăng bài viết với nội dung tối đa ký tự      | Người dùng đã đăng nhập  | 1. Đi đến trang tạo bài viết<br>2. Nhập nội dung 1000 ký tự<br>3. Nhấn "Đăng"             | Nội dung: [Chuỗi 1000 ký tự]<br>Hình ảnh: Có hình ảnh  | Bài viết được đăng thành công, nội dung hiển thị đầy đủ      |
| TC_022 | Đăng bài viết với nội dung vượt quá giới hạn | Người dùng đã đăng nhập  | 1. Đi đến trang tạo bài viết<br>2. Nhập nội dung 1001 ký tự<br>3. Nhấn "Đăng"             | Nội dung: [Chuỗi 1001 ký tự]<br>Hình ảnh: Không có     | Không thể gõ thêm ký tựtự                                    |
| TC_023 | Đăng bài viết với hình ảnh hợp lệ            | Người dùng đã đăng nhập  | 1. Đi đến trang tạo bài viết<br>2. Nhập nội dung<br>3. Tải lên hình ảnh<br>4. Nhấn "Đăng" | Nội dung: "My photo"<br>Hình ảnh: photo.jpg (2MB, JPG) | Bài viết được đăng thành công, hình ảnh hiển thị đúng        |
| TC_024 | Đăng bài viết với file ảnh vượt kích thước   | Người dùng đã đăng nhập  | 1. Đi đến trang tạo bài viết<br>2. Nhập nội dung<br>3. Tải lên hình ảnh<br>4. Nhấn "Đăng" | Nội dung: "My photo"<br>Hình ảnh: photo.jpg (6MB, JPG) | Hiển thị thông báo lỗi: "Kích thước file vượt quá giới hạn"  |

## 5. Xóa bài viết

| **ID** | **Mô tả**                   | **Điều kiện tiên quyết**                             | **Bước thực hiện**                                                  | **Dữ liệu đầu vào** | **Kết quả mong đợi**                                    |
| ------ | --------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------- | ------------------- | ------------------------------------------------------- |
| TC_025 | Xóa bài viết của chính mình | Người dùng đã đăng nhập, có bài viết                 | 1. Đi đến bài viết của mình<br>2. Nhấn nút "Xóa"<br>3. Xác nhận xóa | Không có            | Bài viết bị xóa, không còn hiển thị trên dòng thời gian |
| TC_026 | Xóa bài viết của người khác | Người dùng đã đăng nhập, xem bài viết của người khác | 1. Đi đến bài viết của người khác<br>2. Nhấn nút "Xóa"              | Không có            | Nút "Xóa" không hiển thị                                |

## 6. Báo cáo bài viết

| **ID** | **Mô tả**                         | **Điều kiện tiên quyết**                  | **Bước thực hiện**                                                            | **Dữ liệu đầu vào**             | **Kết quả mong đợi**                                          |
| ------ | --------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------- |
| TC_027 | Báo cáo bài viết với lý do hợp lệ | Người dùng đã đăng nhập, bài viết tồn tại | 1. Đi đến bài viết<br>2. Nhấn nút "Báo cáo"<br>3. Chọn lý do<br>4. Nhấn "Gửi" | Lý do: "Nội dung không phù hợp" | Báo cáo được gửi, hiển thị thông báo: "Cảm ơn bạn đã báo cáo" |

## 7. Xem bài viết

| **ID** | **Mô tả**                                | **Điều kiện tiên quyết**                                                | **Bước thực hiện**                                             | **Dữ liệu đầu vào** | **Kết quả mong đợi**                                                               |
| ------ | ---------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------- |
| TC_028 | Xem bài viết của những người đang follow | Người dùng đã đăng nhập, đã follow ít nhất 1 người có bài viết          | 1. Đi đến trang dòng thời gian<br>2. Xem danh sách bài viết    | Không có            | Hiển thị danh sách bài viết từ những người đang follow, sắp xếp theo thời gian tạo |
| TC_029 | Xem tất cả bài viết                      | Người dùng đã đăng nhập                                                 | 1. Đi đến trang khám phá<br>2. Xem danh sách bài viết          | Không có            | Hiển thị tất cả bài viết công khai, sắp xếp theo thời gian tạo                     |
| TC_030 | Xem bài viết khi không có bài viết nào   | Người dùng đã đăng nhập, không follow ai và không có bài viết công khai | 1. Đi đến trang dòng thời gian                                 | Không có            | Hiển thị thông báo: "Không có bài viết để hiển thị"                                |
| TC_031 | Xem bài viết với số lượng lớn bài viết   | Người dùng đã đăng nhập, có hơn 1000 bài viết từ người follow           | 1. Đi đến trang dòng thời gian<br>2. Cuộn để tải thêm bài viết | Không có            | Bài viết được tải dần, không có lỗi hoặc chậm trễ đáng kể                          |

## 8. Follow người dùng

| **ID** | **Mô tả**                 | **Điều kiện tiên quyết**                             | **Bước thực hiện**                                   | **Dữ liệu đầu vào** | **Kết quả mong đợi**                                                                             |
| ------ | ------------------------- | ---------------------------------------------------- | ---------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------ |
| TC_032 | Follow người dùng         | Người dùng đã đăng nhập, chưa follow người dùng khác | 1. Đi đến hồ sơ người dùng<br>2. Nhấn nút "Follow"   | Không có            | Nút đổi thành "Unfollow", danh sách following của người dùng và followers của người kia cập nhật |
| TC_033 | Unfollow người dùng       | Người dùng đã đăng nhập, đã follow người dùng khác   | 1. Đi đến hồ sơ người dùng<br>2. Nhấn nút "Unfollow" | Không có            | Nút đổi thành "Follow", danh sách following và followers cập nhật                                |
| TC_034 | Follow người dùng bị khóa | Người dùng đã đăng nhập, người kia bị khóa           | 1. Đi đến hồ sơ người dùng<br>2. Nhấn nút "Follow"   | Không có            | Không hiển thị người dùng bị khóakhóa                                                            |

## 9. Chat giữa các người dùng

| **ID** | **Mô tả**                              | **Điều kiện tiên quyết**                      | **Bước thực hiện**                                                                         | **Dữ liệu đầu vào**            | **Kết quả mong đợi**                                                 |
| ------ | -------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------ | -------------------------------------------------------------------- |
| TC_035 | Gửi tin nhắn cho người dùng khác       | Người dùng đã đăng nhập, đã follow người nhận | 1. Đi đến trang chat<br>2. Chọn người nhận<br>3. Nhập tin nhắn<br>4. Nhấn "Gửi"            | Tin nhắn: "Hello!"             | Tin nhắn được gửi, hiển thị trong cuộc trò chuyện của cả hai         |
| TC_037 | Gửi tin nhắn với hình ảnh hợp lệ       | Người dùng đã đăng nhập, đã follow người nhận | 1. Đi đến trang chat<br>2. Chọn người nhận<br>3. Tải lên hình ảnh<br>4. Nhấn "Gửi"         | Hình ảnh: image.jpg (2MB, JPG) | Tin nhắn chứa hình ảnh được gửi, hiển thị đúng trong cuộc trò chuyện |
| TC_038 | Gửi tin nhắn với nội dung tối đa ký tự | Người dùng đã đăng nhập, đã follow người nhận | 1. Đi đến trang chat<br>2. Chọn người nhận<br>3. Nhập tin nhắn 1000 ký tự<br>4. Nhấn "Gửi" | Tin nhắn: [Chuỗi 1000 ký tự]   | Tin nhắn được gửi, hiển thị đầy đủ trong cuộc trò chuyện             |

## 10. Sửa hồ sơ

| **ID** | **Mô tả**                              | **Điều kiện tiên quyết** | **Bước thực hiện**                                                                       | **Dữ liệu đầu vào**                               | **Kết quả mong đợi**                                       |
| ------ | -------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| TC_039 | Sửa tên và bio hợp lệ                  | Người dùng đã đăng nhập  | 1. Đi đến trang hồ sơ<br>2. Nhấn "Sửa hồ sơ"<br>3. Nhập tên và bio<br>4. Nhấn "Lưu"      | Tên: "John Doe"<br>Bio: "Software Engineer"       | Hồ sơ được cập nhật, hiển thị tên và bio mới               |
| TC_040 | Sửa bio vượt quá giới hạn              | Người dùng đã đăng nhập  | 1. Đi đến trang hồ sơ<br>2. Nhấn "Sửa hồ sơ"<br>3. Nhập bio<br>4. Nhấn "Lưu"             | Tên: "John Doe"<br>Bio: [Chuỗi 1000 ký tự]        | Hiển thị thông báo lỗi: "Bio vượt quá giới hạn ký tự"      |
| TC_041 | Sửa ảnh đại diện hợp lệ                | Người dùng đã đăng nhập  | 1. Đi đến trang hồ sơ<br>2. Nhấn "Sửa hồ sơ"<br>3. Tải lên ảnh đại diện<br>4. Nhấn "Lưu" | Ảnh: avatar.jpg (1MB, JPG)                        | Ảnh đại diện được cập nhật, hiển thị đúng trên hồ sơ       |
| TC_042 | Sửa ảnh đại diện với file không hợp lệ | Người dùng đã đăng nhập  | 1. Đi đến trang hồ sơ<br>2. Nhấn "Sửa hồ sơ"<br>3. Tải lên file<br>4. Nhấn "Lưu"         | File: avatar.txt (1MB)                            | Hiển thị thông báo lỗi: "Định dạng file không được hỗ trợ" |
| TC_043 | Sửa hồ sơ với tên tối đa ký tự         | Người dùng đã đăng nhập  | 1. Đi đến trang hồ sơ<br>2. Nhấn "Sửa hồ sơ"<br>3. Nhập tên và bio<br>4. Nhấn "Lưu"      | Tên: [Chuỗi 100 ký tự]<br>Bio: "Software Engineer" | Hồ sơ được cập nhật, hiển thị tên và bio mới               |

## 11. Thích bài viết

| **ID** | **Mô tả**         | **Điều kiện tiên quyết**                  | **Bước thực hiện**                        | **Dữ liệu đầu vào** | **Kết quả mong đợi**                                       |
| ------ | ----------------- | ----------------------------------------- | ----------------------------------------- | ------------------- | ---------------------------------------------------------- |
| TC_044 | Thích bài viết    | Người dùng đã đăng nhập, bài viết tồn tại | 1. Xem bài viết<br>2. Nhấn nút "Thích"    | Không có            | Số lượt thích tăng lên 1, nút "Thích" đổi thành "Bỏ thích" |
| TC_045 | Bỏ thích bài viết | Người dùng đã thích bài viết              | 1. Xem bài viết<br>2. Nhấn nút "Bỏ thích" | Không có            | Số lượt thích giảm đi 1, nút "Bỏ thích" đổi thành "Thích"  |

## 12. Bình luận bài viết

| **ID** | **Mô tả**                           | **Điều kiện tiên quyết**                  | **Bước thực hiện**                                             | **Dữ liệu đầu vào**         | **Kết quả mong đợi**                                          |
| ------ | ----------------------------------- | ----------------------------------------- | -------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------- |
| TC_046 | Bình luận hợp lệ                    | Người dùng đã đăng nhập, bài viết tồn tại | 1. Xem bài viết<br>2. Nhập nội dung bình luận<br>3. Nhấn "Gửi" | Nội dung: "Nice post!"      | Bình luận được thêm, hiển thị đúng nội dung và tên người dùng |
| TC_047 | Bình luận với nội dung tối đa ký tự | Người dùng đã đăng nhập, bài viết tồn tại | 1. Xem bài viết<br>2. Nhập nội dung 500 ký tự<br>3. Nhấn "Gửi" | Nội dung: [Chuỗi 500 ký tự] | Bình luận được thêm, hiển thị đúng nội dung                   |

## 13. Tìm kiếm thông tin

| **ID** | **Mô tả**                          | **Điều kiện tiên quyết**                          | **Bước thực hiện**                                                          | **Dữ liệu đầu vào**        | **Kết quả mong đợi**                                           |
| ------ | ---------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------- | -------------------------------------------------------------- |
| TC_048 | Tìm kiếm người dùng theo tên       | Người dùng đã đăng nhập, có người dùng tồn tại    | 1. Đi đến trang tìm kiếm<br>2. Nhập tên người dùng<br>3. Nhấn "Tìm kiếm"    | Tên: "John Doe"            | Hiển thị danh sách người dùng khớp với tên "John Doe"          |
| TC_049 | Tìm kiếm với từ khóa không tồn tại | Người dùng đã đăng nhập                           | 1. Đi đến trang tìm kiếm<br>2. Nhập từ khóa<br>3. Nhấn "Tìm kiếm"           | Từ khóa: "xyz123"          | Hiển thị thông báo: "Không tìm thấy kết quả"                   |
| TC_050 | Tìm kiếm với từ khóa dài           | Người dùng đã đăng nhập                           | 1. Đi đến trang tìm kiếm<br>2. Nhập từ khóa 100 ký tự<br>3. Nhấn "Tìm kiếm" | Từ khóa: [Chuỗi 100 ký tự] | Hiển thị kết quả khớp hoặc thông báo: "Không tìm thấy kết quả" |

## 14. Thông báo (Notifications)

| **ID** | **Mô tả**                            | **Điều kiện tiên quyết**                            | **Bước thực hiện**                                      | **Dữ liệu đầu vào** | **Kết quả mong đợi**                                                 |
| ------ | ------------------------------------ | --------------------------------------------------- | ------------------------------------------------------- | ------------------- | -------------------------------------------------------------------- |
| TC_051 | Nhận thông báo khi có lượt thích mới | Người dùng đã đăng nhập, có bài viết được thích     | 1. Đi đến trang thông báo<br>2. Xem danh sách thông báo | Không có            | Hiển thị thông báo: "[Tên người dùng] đã thích bài viết của bạn"     |
| TC_052 | Nhận thông báo khi có bình luận mới  | Người dùng đã đăng nhập, có bài viết được bình luận | 1. Đi đến trang thông báo<br>2. Xem danh sách thông báo | Không có            | Hiển thị thông báo: "[Tên người dùng] đã bình luận bài viết của bạn" |
| TC_053 | Nhận thông báo khi có người follow   | Người dùng đã đăng nhập, được người khác follow     | 1. Đi đến trang thông báo<br>2. Xem danh sách thông báo | Không có            | Hiển thị thông báo: "[Tên người dùng] đã follow bạn"                 |

## 15. Gửi feedback cho ứng dụng

| **ID** | **Mô tả**                              | **Điều kiện tiên quyết** | **Bước thực hiện**                                                       | **Dữ liệu đầu vào**          | **Kết quả mong đợi**                                              |
| ------ | -------------------------------------- | ------------------------ | ------------------------------------------------------------------------ | ---------------------------- | ----------------------------------------------------------------- |
| TC_054 | Gửi feedback hợp lệ                    | Người dùng đã đăng nhập  | 1. Đi đến trang feedback<br>2. Nhập nội dung feedback<br>3. Nhấn "Gửi"   | Nội dung: "App works great!" | Feedback được gửi, hiển thị thông báo: "Cảm ơn feedback của bạn!" |
| TC_055 | Gửi feedback với nội dung trống        | Người dùng đã đăng nhập  | 1. Đi đến trang feedback<br>2. Để trống nội dung<br>3. Nhấn "Gửi"        | Nội dung: ""                 | Hiển thị thông báo lỗi: "Nội dung feedback không được để trống"   |
| TC_056 | Gửi feedback với nội dung tối đa ký tự | Người dùng đã đăng nhập  | 1. Đi đến trang feedback<br>2. Nhập nội dung 1000 ký tự<br>3. Nhấn "Gửi" | Nội dung: [Chuỗi 1000 ký tự] | Feedback được gửi, hiển thị thông báo: "Cảm ơn feedback của bạn!" |
