import express from 'express';
import { commentController } from '../controllers/index.js';
import { body } from 'express-validator';


const router = express.Router();


// get replies by comment_id
router.get('/reply/:commentId',
    commentController.getRepliesByCommentId
);


// get comments by post_id
router.get('/:postId',
    commentController.getCommentsByPostId
);


// create comment
router.post('/:postId',
    body("content").notEmpty().withMessage('content is required'),
    commentController.createComment
);

router.put('/reply',
    body("content").notEmpty().withMessage('content is required'),
    body("commentId").notEmpty().withMessage('commentId is required'),
    commentController.createReply
);

router.put('/reply/:id',
    body("content").notEmpty().withMessage('content is required'),
    body("commentId").notEmpty().withMessage('commentId is required'),
    commentController.updateReplyComment
);

// update comment
router.put('/:id', 
    body("content").notEmpty().withMessage('content is required'),
    commentController.updateComment
);

router.delete('/reply/:id', 
    body("commentId").notEmpty().withMessage('commentId is required'),
    commentController.deleteReplyComment
);

// delete comment
router.delete('/:id', 
    commentController.deleteComment
);


export default router;