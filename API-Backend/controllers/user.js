import { userService } from '../services/index.js';
import HttpStatusCode from "../error/HttpStatusCode.js";
import { sendSuccess, sendError } from '../middlewares/responseHandler.js';
import { validationResult } from "express-validator";
import { cloudinary } from "../config/cloudinary/cloudinary.js";

const getProfile = async (req, res) => {
    const id = req.userId;

    console.log("id:",id);

    try {
        const user = await userService.getProfile(id);
        return sendSuccess(res, user, 'Lấy thông tin người dùng thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code);
    }
};

const updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, errors.array().map(err => err.msg).toString(), HttpStatusCode.BAD_REQUEST);
    }

    const id = req.userId; // Lấy từ middleware xác thực
    const { name, bio } = req.body;
    const file = req.file; // Ảnh từ upload.single("image")

    try {
        const updateData = { name, bio };

        // Upload ảnh lên Cloudinary nếu có
        if (file) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "avatars", // Thư mục trên Cloudinary
            });
            updateData.avtUrl = result.secure_url; // Chỉ lưu URL mới
        }

        const user = await userService.updateProfile(id, updateData);
        return sendSuccess(res, user, 'Cập nhật thông tin người dùng thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
    }
};

const getUserById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await userService.getUserById(id);
        return sendSuccess(res, user, 'Lấy thông tin người dùng thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code);
    }
};

const followUser = async (req, res) =>{
    try {
        const id = req.params.id;
        const userId = req.userId;
        const user = await userService.followUser(userId, id);
        return sendSuccess(res, user, 'Lấy thông tin người dùng thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code);
    }
};

const unfollowUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const user = await userService.unfollowUser(userId, id);
        return sendSuccess(res, user, 'Lấy thông tin người dùng thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code);
    }
};

const searchByText = async (req, res) => {
    try {
        const { text } = req.params
        console.log("text:",text);
        const users = await userService.searchByText(text);
        return sendSuccess(res, users, 'Tìm kiếm người dùng thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code);
    }
};


export default {
    getProfile,
    getUserById,
    updateProfile,
    followUser,
    unfollowUser,
    searchByText
}