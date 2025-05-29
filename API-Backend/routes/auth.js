import express from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/index.js';

const router = express.Router();

// register
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: Mật khẩu của người dùng
 *               name:
 *                 type: string
 *                 description: Tên người dùng
 *                 example: "Upin"
 *             required:
 *               - email
 *               - password
 *               - name
 *     responses:
 *       201:
 *         description: Đã gửi mã xác thực đến email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đã gửi mã xác thực đến email"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       description: Thời gian hết hạn của mã xác thực
 *                       example: "2025-03-05T14:30:00Z"     
 *       400:
 *         description: Lỗi xác thực
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email đã tồn tại | Mật khẩu ít nhất 8 ký tự | Không đúng định dạng email | Tên phải có ít nhất 3 ký tự"
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi server"
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 */
router.post(
    "/register",
    body("email").isEmail().withMessage("Không đúng định dạng email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Mật khẩu phải có ít nhất 8 ký tự"),
    body("name").isLength({ min: 3 }).withMessage("Tên phải có ít nhất 3 ký tự"),
    authController.register
);
  

// login

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: Mật khẩu của người dùng
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đăng nhập thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1..."
 *                     refreshToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI2..."
 *       400:
 *         description: Lỗi xác thực dữ liệu đầu vào
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Mật khẩu ít nhất 8 ký tự | Không đúng định dạng email"
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Email không tồn tại trong hệ thống hoặc mật khẩu không đúng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email không tồn tại | Mật khẩu không đúng"
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi server"
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 */

router.post('/login',
    body('email').isEmail().withMessage('Không đúng định dạng email'),
    body('password').isLength({ min: 8 }).withMessage('Mật khẩu phải có ít nhất 8 ký tự'),
    authController.login
)


// verify code
/**
 * @swagger
 * /api/v1/auth/verify-code:
 *   post:
 *     summary: Xác thực mã xác nhận
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: "user@example.com"
 *               code:
 *                 type: string
 *                 description: Mã xác nhận (4 ký tự)
 *                 example: "1234"
 *             required:
 *               - email
 *               - code
 *     responses:
 *       200:
 *         description: Mã xác nhận hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Mã xác nhận hợp lệ"
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: Lỗi xác thực
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Mã xác nhận không hợp lệ hoặc đã hết hạn"
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi server"
 *                 data:
 *                   type: null
 *                   example: null
 */

router.post('/verify-code',
    body('email').isEmail().withMessage('Không đúng định dạng email'),
    body('code').isLength({ min: 4, max: 4 }).withMessage('Mã xác nhận phải có 4 ký tự'),
    authController.verifyCode
)

// forgot password
/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Quên mật khẩu
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: "user@example.com"
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Đã gửi email đặt lại mật khẩu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đã gửi email đặt lại mật khẩu"
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: Lỗi xác thực dữ liệu đầu vào (Email không đúng định dạng)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không đúng định dạng email"
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Email không tồn tại trong hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email không tồn tại trong hệ thống"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       description: Thời gian hết hạn của mã xác thực
 *                       example: "2025-03-05T14:30:00Z"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi server"
 *                 data:
 *                   type: null
 *                   example: null
 */

router.post('/forgot-password',
    body('email').isEmail().withMessage('Không đúng định dạng email'),
    authController.forgotPassword
)

// reset password
/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: Mật khẩu mới (ít nhất 8 ký tự)
 *                 example: "newStrongPassword"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Mật khẩu đã được đặt lại thành công"
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: Lỗi xác thực dữ liệu đầu vào (Email không đúng định dạng | Mật khẩu quá ngắn)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không đúng định dạng email | Mật khẩu phải có ít nhất 8 ký tự"
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Email không tồn tại trong hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email không tồn tại trong hệ thống"
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi server"
 *                 data:
 *                   type: null
 *                   example: null
 */

router.post('/reset-password',
    body('email').isEmail().withMessage('Không đúng định dạng email'),
    body('password').isLength({ min: 8 }).withMessage('Mật khẩu phải có ít nhất 8 ký tự'),
    authController.resetPassword
)

// reset code 
/**
 * @swagger
 * /reset-code:
 *   post:
 *     summary: Gửi mã đặt lại mật khẩu
 *     description: Gửi mã xác nhận đặt lại mật khẩu đến email người dùng.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Mã xác nhận đã được gửi thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Mã xác nhận đã được gửi đến email."
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       description: Thời gian hết hạn của mã xác thực
 *                       example: "2025-03-05T14:30:00Z"
 *       400:
 *         description: Email không hợp lệ hoặc không tồn tại.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không đúng định dạng email."
 *       500:
 *         description: Lỗi máy chủ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ, vui lòng thử lại sau."
 */
router.post('/reset-code',
    body('email').isEmail().withMessage('Không đúng định dạng email'),
    authController.resetCode
)

export default router;