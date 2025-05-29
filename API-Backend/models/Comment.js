import mongoose, {Schema} from "mongoose";

const Comment = mongoose.model('Comment',
    new Schema({
        content: { type: String, required: true },
        user: { 
            _id: { type: Schema.Types.ObjectId, required: true },
            name: { type: String, required: true },
            avtUrl: { type: String }
        },
        postId: { 
            type: Schema.Types.ObjectId,  
            ref: 'Post',
            required: true
        },
        replies: [
            {
                content: { type: String, required: true },
                user: {
                    _id: { type: Schema.Types.ObjectId, required: true },
                    name: { type: String, required: true },
                    avtUrl: { type: String },
                },
                createdAt: { type: Date, default: Date.now },
            },
        ],

    },
    {
        autoCreate: true,
        timestamps: true,
        autoIndex: true
    }
))

export default Comment;