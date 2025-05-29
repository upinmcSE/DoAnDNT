import { validationResult } from "express-validator";
import { authService } from "../services/index.js";
import HttpStatusCode from "../error/HttpStatusCode.js";
import { sendSuccess, sendError } from '../middlewares/responseHandler.js';


const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, errors.array().map(err => err.msg).toString(), HttpStatusCode.BAD_REQUEST);
    }

    const { email, password, name } = req.body;

    try {
        const result = await authService.register({ email, password, name });
        return sendSuccess(res, result, 'Mã xác nhận đã được gửi đến email', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code);
    }
}

const verifyCode = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, errors.array().map(err => err.msg).toString(), HttpStatusCode.BAD_REQUEST);
    }

    const { email, code } = req.body;

    try {
        const result = await authService.verifyCode({ email, code });
        return sendSuccess(res, result, 'Bạn đã xác nhận thành công', HttpStatusCode.OK);
    } catch (error) {
        sendError(res, error.message, error.code);
    }
}

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, errors.array().map(err => err.msg).toString(), HttpStatusCode.BAD_REQUEST);
    }

    const { email, password } = req.body;

    try {
        const result = await authService.login({ email, password });
        return sendSuccess(res, result, 'Bạn đã đăng nhập thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code);
    }
}

const forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, errors.array().map(err => err.msg).toString(), HttpStatusCode.BAD_REQUEST);
    }

    const { email } = req.body;

    try {
        const result = await authService.forgotPassword({ email });
        return sendSuccess(res, result, 'Mã xác nhận đã được gửi đến email', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code);
    }
}

const resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, errors.array().map(err => err.msg).toString(), HttpStatusCode.BAD_REQUEST);
    }

    const { password, email } = req.body;

    try {
        const result = await authService.resetPassword({ password, email });
        return sendSuccess(res, result, 'Đổi mật khẩu thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code);
    }

}

const resetCode = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, errors.array().map(err => err.msg).toString(), HttpStatusCode.BAD_REQUEST);
    }

    const { email } = req.body;

    try {
        const result = await authService.resetCode({ email });
        return sendSuccess(res, result, 'Đã gửi lại mã xác nhận', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code);
    }
}

export default {
    register,
    login,
    verifyCode,
    forgotPassword,
    resetPassword,
    resetCode
}
