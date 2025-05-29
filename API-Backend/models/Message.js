import mongoose, { Schema } from "mongoose";

const Message = mongoose.model("Message", 
    new Schema({
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Communication",
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        imageUrl: {
            type: [String],
            default: [],
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        },
        { 
            timestamps: true,
            autoIndex: true,
            autoCreate: true 
        }
    )
);

export default Message;
