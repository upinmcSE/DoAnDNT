import mongoose, {Schema} from "mongoose";

const Role = {
    USER: 'USER',
    ADMIN: 'ADMIN',
};
  

const User = mongoose.model('User', 
    new Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        emailVerified: { type: Boolean, default: false },
        emailVerificationCode: { type: String, default: null },
        emailVerificationCodeExpiryDate: { type: Date, default: null },
        role: { type: String, enum: Object.values(Role), default: Role.USER },
        followers: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
        following: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
        name: { type: String, default: '', index: true },
        bio: { type: String, default: '' },
        avtUrl: { type: String, default: '' },
    },
    {
        autoCreate: true,
        timestamps: true,
        autoIndex: true
    }
));

export default User;