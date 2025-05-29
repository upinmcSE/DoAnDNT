import express from 'express';
import { body } from 'express-validator';
import { postController } from '../controllers/index.js';
import { upload } from '../config/cloudinary/cloudinary.js';

const router = express.Router();


// create post
router.post(
    "/",
    upload.array("images", 10), // Giới hạn tối đa 10 ảnh
    body('content'),
    postController.createPost
);


// get all posts
router.get('/',
    postController.getAllPosts
);

// get all post network
router.get('/network',
    postController.getAllPostsNetwork
);

// get post by user_id 
router.get('/postId/:userId',
    postController.getPostsByUserId
);

// get post by postId
router.get('/get-post/:postId',
    postController.getPostByPostId
);

// like post
router.post('/like',
    body('postId').notEmpty().withMessage('Post ID is required'),
    postController.likePost
);

// unlike post
router.post('/unlike',
    body('postId').notEmpty().withMessage('Post ID is required'),
    postController.unlikePost
);


// list likes post 
router.get('/like/:postId',
    postController.listLikesPost
);

// update post
router.put('/:id', (req, res) => {
    res.send('Update post route');
});

// delete post
router.delete('/:postId', 
    postController.deletePost
);

export default router;