import mongoose, { Schema } from "mongoose";

const Communication = mongoose.model("Communication",
    new Schema({
        participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ],
        },
        { 
            timestamps: true,
            autoIndex: true,
            autoCreate: true
        }
    )
);

export default Communication;