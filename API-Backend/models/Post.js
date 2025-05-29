import mongoose, { Schema } from "mongoose";

const Post = mongoose.model('Post', 
    new Schema({
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        },
        content: { type: String, required: true, index: true },
        imageUrls: { type: [String], default: [] },
        likes: { 
            type: [Schema.Types.ObjectId],
            ref: 'User',
            default: [] 
        },
        comments: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'Comment', 
            default: [] 
        }],
    },
    {
        autoCreate: true,
        timestamps: true,
        autoIndex: true
    }
))

export default Post;