## 1. Chức năng

- Đăng bài viết
- Xem các bài viết (xem bài viết của những người follow | xem tất cả)
- follow người dùng
- chat giữa các người dùng (chat giữa các người dùng follow nhau)
- sửa hồ sơ (tên, bio)
- thích bài viết, bình luận
- tìm kiếm thông tin bài viết, người dùng
- notifications (thông báo)
- gửi feedback cho ứng dụng

## 2. Thiết kế cơ sở dữ liệu

### User:
- fullname : text
- bio : text
- email : text
- password : text
- avtUrl : text
- isVerify : bool
- verifyCode: string
- timeVerify : datetime
- followers : [userId]
- following : [userId]
- createAt : datetime
- updateAt : datetime

### Post
- userId
- content : text
- imageUrl | videoUrl : [ text ]
- likes : [userId]
- createAt : datetime
- updateAt : datetime

### Comment
- userId
- postId
- content : text
- createAt : datetime
- updateAt : datetime

### Communication
- "conversationId" ,
- "participants": ["652ab1...", "91fb23..."]

### Message
- "conversationId": "123",
- "senderId": "652ab1...",
- "text": "Hello!",
- "imageUrl": null,
- "timestamp": "2024-03-12T10:00:00Z"




## 3. Các tài liệu hướng dẫn trong dự án
- Button:  https://callstack.github.io/react-native-paper/docs/components/Button/
- TextInput: https://callstack.github.io/react-native-paper/docs/components/TextInput/TextInputIcon#icon-required-renamed-from-name-to-icon-in-v5x














