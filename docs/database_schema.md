# MongoDB Database Schema Description

This document describes the MongoDB database schema for a social media application, defined using Mongoose models. The schema includes collections for Users, Posts, Comments, Communications, Messages, and Notifications.

## 1. User Collection

The `User` collection stores information about registered users.

### Schema

```mongodb
- **email**: `String`, required, unique
  - User's email address.
- **password**: `String`, required
  - Hashed password for authentication.
- **emailVerified**: `Boolean`, default: `false`
  - Indicates if the user's email is verified.
- **emailVerificationCode**: `String`, default: `null`
  - Code used for email verification.
- **emailVerificationCodeExpiryDate**: `Date`, default: `null`
  - Expiry date for the email verification code.
- **role**: `String`, enum: [`USER`, `ADMIN`], default: `USER`
  - User's role in the system.
- **followers**: `Array` of `ObjectId`, references `User`, default: `[]`
  - List of user IDs who follow this user.
- **following**: `Array` of `ObjectId`, references `User`, default: `[]`
  - List of user IDs this user follows.
- **name**: `String`, default: `''`, indexed
  - User's display name.
- **bio**: `String`, default: `''`
  - User's biography.
- **avtUrl**: `String`, default: `''`
  - URL to the user's avatar image.
- **createdAt**, **updatedAt**: `Date` (via `timestamps: true`)
  - Timestamps for creation and last update.

### Options
- `autoCreate: true`
- `timestamps: true`
- `autoIndex: true`

```

## 2. Post Collection

The `Post` collection stores user posts.

### Schema

```mongodb
- **userId**: `ObjectId`, references `User`, required
  - ID of the user who created the post.
- **content**: `String`, required, indexed
  - Text content of the post.
- **imageUrls**: `Array` of `String`, default: `[]`
  - List of URLs for images attached to the post.
- **likes**: `Array` of `ObjectId`, references `User`, default: `[]`
  - List of user IDs who liked the post.
- **comments**: `Array` of `ObjectId`, references `Comment`, default: `[]`
  - List of comment IDs associated with the post.

### Options

- `timestamps: true` (assumed, as not explicitly disabled)

```

## 3. Comment Collection

The `Comment` collection stores comments on posts, including replies.

### Schema

```mongodb
- **content**: `String`, required
  - Text content of the comment.
- **user**:
  - `_id`: `ObjectId`, required
    - ID of the user who made the comment.
  - **name**: `String`, required
    - Name of the commenting user.
  - **avtUrl**: `String`
    - URL to the commenting user's avatar.
- **postId**: `ObjectId`, references `Post`, required
  - ID of the post this comment belongs to.
- **replies**: `Array` of subdocuments
  - **content**: `String`, required
    - Text content of the reply.
  - **user**:
    - `_id`: `ObjectId`, required
      - ID of the user who made the reply.
    - **name**: `String`, required
      - Name of the replying user.
    - **avtUrl**: `String`
      - URL to the replying user's avatar.
  - **createdAt**: `Date`, default: `Date.now`
    - Timestamp for when the reply was created.

### Options

- `timestamps: true` (assumed, as not explicitly disabled)
```

## 4. Communication Collection

The `Communication` collection stores conversation metadata.

### Schema

```mongodb
- **participants**: `Array` of `ObjectId`, references `User`, required
  - List of user IDs participating in the conversation.

### Options

- `timestamps: true` (assumed, as not explicitly disabled)
```

## 5. Message Collection

The `Message` collection stores individual messages within conversations.

### Schema

```json
- **conversationId**: `ObjectId`, references `Communication`, required
  - ID of the conversation this message belongs to.
- **senderId**: `ObjectId`, references `User`, required
  - ID of the user who sent the message.
- **receiverId**: `ObjectId`, references `User`, required
  - ID of the user who received the message.
- **text**: `String`
  - Text content of the message.
- **imageUrl**: `Array` of `String`, default: `[]`
  - List of URLs for images attached to the message.
- **isRead**: `Boolean`, default: `false`
  - Indicates if the message has been read.

### Options

- `timestamps: true` (assumed, as not explicitly disabled)
```

## 6. Notification Collection

The `Notification` collection stores user notifications.

### Schema

```mongodb
- **type**: `String`, enum: [`post_notice`, `comment_notice`, `follow_notice`, `like_notice`, `reply_notice`], required
  - Type of notification.
- **content**: `String`, required
  - Content or description of the notification.
- **fromUser**: `ObjectId`, references `User`, required
  - ID of the user who triggered the notification.
- **toUser**: `ObjectId`, references `User`, required
  - ID of the user receiving the notification.
- **postId**: `ObjectId`, references `Post`, default: `null`
  - ID of the post related to the notification (if applicable).
- **read**: `Boolean`, default: `false`
  - Indicates if the notification has been read.
- **createdAt**: `Date`, default: `Date.now`
  - Timestamp for when the notification was created.

### Options

- `timestamps: true` (assumed, as not explicitly disabled)
```

## Notes

- The schema uses Mongoose references (`ref`) to establish relationships between collections (e.g., `User`, `Post`, `Comment`, `Communication`).
- Indexes are created on `User.name` and `Post.content` for efficient querying.
- Timestamps are automatically added to most collections for tracking creation and update times.
- The `Role` enum ensures users can only be assigned `USER` or `ADMIN` roles.
