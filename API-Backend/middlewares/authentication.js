import jwt from 'jsonwebtoken';
import HttpStatusCode from '../error/HttpStatusCode.js';

const authenticate = (req, res, next) => {
    if (
        req.path.startsWith('/docs') ||
        req.path === '/api/v1/auth/login' || 
        req.path === '/api/v1/auth/register' || 
        req.path === '/api/v1/auth/verify-code' ||
        req.path === '/api/v1/auth/forgot-password' ||
        req.path === '/api/v1/auth/reset-password' ||
        req.path === '/api/v1/auth/refresh-token' ||
        req.path === '/api/v1/auth/reset-code'
    ) {
        return next();
    }

    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
            success: false,
            message: 'Yêu cầu xác thực người dùng',
        });
    }
    const token = authHeader.split(" ")[1];

    try {
        const jwtObject = jwt.verify(token, process.env.JWT_SECRET);
        const isExpired = Date.now() > jwtObject.exp * 1000;
        
        if (isExpired) {
            return res.status(HttpStatusCode.GONE).json({
                success: false,
                message: 'Yêu cầu xác thực người dùng',
            });
        }
        req.userId = jwtObject.userId;

        next(); // Tiếp tục middleware chain nếu token hợp lệ
    } catch (exception) {
        // console.error('JWT verification failed:', exception);
        res.status(HttpStatusCode.UNAUTHORIZED).json({
            success: false,
            message: 'Yêu cầu xác thực người dùng',
        });
    }
}

export default authenticate;