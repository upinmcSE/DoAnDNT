import express from 'express';
import { body } from 'express-validator';
import { userController } from '../controllers/index.js';
import { upload } from '../config/cloudinary/cloudinary.js';
const router = express.Router();


// get profile
/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Lấy thông tin hồ sơ cá nhân
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
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
 *                   example: "Lấy thông tin người dùng thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "thanhdt3019@gmail.com"
 *                     _id:
 *                       type: string
 *                       example: "60f1b0c5d8a7c80015e1f7c6"
 *                     role:
 *                       type: string
 *                       example: "USER"
 *                     followers:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     following:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     age:
 *                       type: integer
 *                       example: 0
 *                     gender:
 *                       type: string
 *                       example: "OTHER"
 *                     name:
 *                       type: string
 *                       example: "Upinnn"
 *                     bio:
 *                       type: string
 *                       example: "Tôi thề với các bạn là tôi đẹp trai vô đối ..."
 *                     profileImage:
 *                       type: string
 *                       example: ""
 *       401:
 *         description: Chưa xác thực hoặc token không hợp lệ
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
 *                   example: "Không có quyền truy cập"
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

router.get('/', (req, res) => {
    userController.getProfile(req, res);
});

// get user by id
/**
 * @swagger
 * /api/v1/user/userId:
 *   get:
 *     summary: Lấy thông tin hồ người dùng theo ID
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
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
 *                   example: "Lấy thông tin người dùng thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "thanhdt3019@gmail.com"
 *                     _id:
 *                       type: string
 *                       example: "60f1b0c5d8a7c80015e1f7c6"
 *                     role:
 *                       type: string
 *                       example: "USER"
 *                     followers:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     following:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     age:
 *                       type: integer
 *                       example: 0
 *                     gender:
 *                       type: string
 *                       example: "OTHER"
 *                     name:
 *                       type: string
 *                       example: "Upinnn"
 *                     bio:
 *                       type: string
 *                       example: "Tôi thề với các bạn là tôi đẹp trai vô đối ..."
 *                     profileImage:
 *                       type: string
 *                       example: ""
 *       400:
 *         description: Không tìm thấy người dùng
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
 *                   example: "Người dùng không tồn tại"
 *                 data:
 *                   type: null
 *                   example: null
 *       401:
 *         description: Chưa xác thực hoặc token không hợp lệ
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
 *                   example: "Không có quyền truy cập"
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

router.get('/userId/:id', 
    userController.getUserById
);

// update profile
/**
 * @swagger
 * /api/v1/user:
 *   put:
 *     summary: Cập nhật hồ sơ người dùng
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên người dùng (tối thiểu 3 ký tự)
 *                 example: "Boyyy"
 *               bio:
 *                 type: string
 *                 description: Tiểu sử người dùng (tối thiểu 3 ký tự)
 *                 example: "Tôi là một người yêu thích lập trình."
 *               age:
 *                 type: integer
 *                 description: Tuổi người dùng
 *                 example: 25
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *                 description: Giới tính của người dùng
 *                 example: "MALE"
 *     responses:
 *       200:
 *         description: Cập nhật hồ sơ thành công
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
 *                   example: "Cập nhật hồ sơ thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Boyyy"
 *                     bio:
 *                       type: string
 *                       example: "Tôi là một người yêu thích lập trình."
 *                     age:
 *                       type: integer
 *                       example: 25
 *                     gender:
 *                       type: string
 *                       example: "MALE"
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
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
 *                   example: "Tên phải có ít nhất 3 ký tự | Bio phải có ít nhất 3 ký tự"
 *                 data:
 *                   type: null
 *                   example: null
 *       401:
 *         description: Chưa xác thực hoặc token không hợp lệ
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
 *                   example: "Không có quyền truy cập"
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

router.put('/',
    upload.single("image"), // Chỉ nhận 1 ảnh với key "image"
    body('name').isLength({ min: 3 }).withMessage('Tên phải có ít nhất 3 ký tự'),
    body('bio').isLength({ min: 3 }).withMessage('Bio phải có ít nhất 3 ký tự'),
    userController.updateProfile
);


// follow user
/**
 * @swagger
 * /api/v1/user/follow/{id}:
 *   post:
 *     summary: Theo dõi người dùng
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần theo dõi
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Theo dõi người dùng thành công
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
 *                   example: "Đã theo dõi người dùng thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     followerId:
 *                       type: string
 *                       example: "65f5a89d3b2c7a001c5b4e23"
 *                     followingId:
 *                       type: string
 *                       example: "65f5a89d3b2c7a001c5b4e24"
 *       400:
 *         description: Không thể theo dõi người dùng
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
 *                   example: "Người dùng không tồn tại hoặc đã theo dõi trước đó"
 *       401:
 *         description: Chưa đăng nhập
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
 *                   example: "Chưa đăng nhập"
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
 */

router.post('/follow/:id',
    userController.followUser
);


// unfollow user
/**
 * @swagger
 * /api/v1/user/unfollow/{id}:
 *   post:
 *     summary: Bỏ theo dõi người dùng
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần bỏ theo dõi
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Bỏ theo dõi người dùng thành công
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
 *                   example: "Đã bỏ theo dõi người dùng thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     followerId:
 *                       type: string
 *                       example: "65f5a89d3b2c7a001c5b4e23"
 *                     unfollowedId:
 *                       type: string
 *                       example: "65f5a89d3b2c7a001c5b4e24"
 *       400:
 *         description: Không thể bỏ theo dõi người dùng
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
 *                   example: "Người dùng không tồn tại hoặc chưa theo dõi"
 *       401:
 *         description: Chưa đăng nhập
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
 *                   example: "Unauthorized"
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
 */

router.post('/unfollow/:id',
    userController.unfollowUser
);


// search text
router.get(
    '/search/:text', 
    userController.searchByText
);



export default router;
