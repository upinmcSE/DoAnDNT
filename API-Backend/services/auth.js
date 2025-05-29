import { User } from '../models/index.js';
import bcrypt, { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import Exception from '../error/Exception.js';
import HttpStatusCode from '../error/HttpStatusCode.js';
import { sendVerificationEamil } from '../utils/email/Email.js';

const gennerateCode = () => {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}


const register = async ({email, password, name}) => {
    const existUser = await User.findOne({email}).exec();
    if(existUser){
        throw new Exception(HttpStatusCode.BAD_REQUEST, 'Người dùng đã tồn tại');
    }

    try {

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || '10'));
    
    const emailVerificationCode = gennerateCode();
    const hashEmailVerificationCode = await bcrypt.hash(emailVerificationCode, parseInt(process.env.SALT_ROUNDS || '10'));
    const emailVerificationCodeExpiryDate = Date.now() + 60 * 2000; // 2 minutes
    
    const newUser = await User.create({
        email,
        password: hashedPassword,
        name: name,
        emailVerificationCode: hashEmailVerificationCode,
        emailVerificationCodeExpiryDate
    });

    await sendVerificationEamil(newUser.email, emailVerificationCode);
    return {
        expiresAt: emailVerificationCodeExpiryDate
    }
    } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
    }
}

const verifyCode = async ({email, code}) => {
    const existUser = await User.findOne({email}).exec();
    if(!existUser){
        throw new Exception(HttpStatusCode.NOT_FOUND, 'Người dùng không tồn tại');
    }

    const isCodeValid = await compare(code, existUser.emailVerificationCode); // Nếu dùng hash
    const isExpired = !existUser.emailVerificationCodeExpiryDate || existUser.emailVerificationCodeExpiryDate < Date.now();

    if (!isCodeValid || isExpired) {
        throw new Exception(HttpStatusCode.BAD_REQUEST, 'Mã xác nhận không đúng hoặc đã hết hạn');
    }
    try {

        existUser.emailVerified = true;
        existUser.emailVerificationCode = null;
        existUser.emailVerificationCodeExpiryDate = null;
        await existUser.save();
    
    } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
    }
}

const login = async ({email, password}) => {
    const existUser = await User.findOne({ email }).exec();
    if(!existUser){
        throw new Exception(HttpStatusCode.NOT_FOUND, 'Mật khẩu hoặc email không đúng');
    }

    const isMatch = await bcrypt.compare(password, existUser.password);
    if(!isMatch){
        throw new Exception(HttpStatusCode.BAD_REQUEST, 'Mật khẩu hoặc email không đúng');
    }

    try {

        const accessToken = jwt.sign(
            { userId: existUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const refreshToken = jwt.sign(
            { userId: existUser._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        return {
            accessToken,
            refreshToken
        }
        

    } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
    }
}

const forgotPassword = async ({email}) => {
    const existUser = await User.findOne({ email }).exec();
    if(!existUser){
        throw new Exception(HttpStatusCode.BAD_REQUEST, 'Người dùng không tồn tại');
    }
    try {

    const emailVerificationCode = gennerateCode();
    const hashEmailVerificationCode = await bcrypt.hash(emailVerificationCode, parseInt(process.env.SALT_ROUNDS || '10'));
    const emailVerificationCodeExpiryDate = Date.now() + 60 * 2000; // 2 minutes

    existUser.emailVerificationCode = hashEmailVerificationCode;
    existUser.emailVerificationCodeExpiryDate = emailVerificationCodeExpiryDate;
    await existUser.save();

    await sendVerificationEamil(existUser.email, emailVerificationCode);

    return {
        expiresAt: emailVerificationCodeExpiryDate
    }
    
    } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
    }

}

const resetPassword = async ({email, password}) => {
    const existUser = await User.findOne({ email }).exec();
    if(!existUser){
        throw new Exception(HttpStatusCode.BAD_REQUEST, 'Người dùng không tồn tại');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || '10'));
        existUser.password = hashedPassword;
        await existUser.save();
    
    } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
    }
}

const resetCode = async ({email}) => {
    const existUser = await User.findOne({ email }).exec();
    if(!existUser){
        throw new Exception(HttpStatusCode.BAD_REQUEST, 'Người dùng không tồn tại');
    }

    try {
        const emailVerificationCode = gennerateCode();
        const hashEmailVerificationCode = await bcrypt.hash(emailVerificationCode, parseInt(process.env.SALT_ROUNDS || '10'));
        const emailVerificationCodeExpiryDate = Date.now() + 60 * 2000; // 2 minutes

        existUser.emailVerificationCode = hashEmailVerificationCode;
        existUser.emailVerificationCodeExpiryDate = emailVerificationCodeExpiryDate;
        await existUser.save();

        await sendVerificationEamil(existUser.email, emailVerificationCode);

        return {
            expiresAt: emailVerificationCodeExpiryDate
        }
    
    } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
    }

}
export default {
    register,
    verifyCode,
    login,
    forgotPassword,
    resetPassword,
    resetCode
}