import { validationResult } from "express-validator";
import { commentService } from "../services/index.js";
import HttpStatusCode from "../error/HttpStatusCode.js";
import { sendSuccess, sendError } from '../middlewares/responseHandler.js';


const getCommentsByPostId = async (req, res) => {
    const postId = req.params.postId;
    try {
        const comments = await commentService.getCommentsByPostId(postId);
        return sendSuccess(res, comments, 'Lấy bình luận thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
    }
}

const createComment = async (req, res) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      errors.array().map((err) => err.msg).join(", "),
      HttpStatusCode.BAD_REQUEST
    );
  }

  try {
    const { content } = req.body;
    const postId = req.params.postId;
    const userId = req.userId;

    const comment = await commentService.createComment(postId, userId, content);
    return sendSuccess(res, comment, "Comment added successfully", HttpStatusCode.OK);
  } catch (error) {
    return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
  }
}

const updateComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return sendError(
          res,
          errors.array().map((err) => err.msg).join(", "),
          HttpStatusCode.BAD_REQUEST
      );
  }

  try {
      const { content, commentId } = req.body;
      const userId = req.userId;

      const updatedComment = await commentService.updateComment(commentId, userId, content);
      return sendSuccess(res, updatedComment, "Comment updated successfully", HttpStatusCode.OK);
  } catch (error) {
      return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
  }
}

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.userId;
      await commentService.deleteComment(commentId, userId);
      return sendSuccess(res, null, "Comment deleted successfully", HttpStatusCode.OK);
  } catch (error) {
      return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
  }
}


const getRepliesByCommentId = async (req, res) => {
  
  try {
      const commentId = req.params.commentId;
      const replies = await commentService.getRepliesByCommentId(commentId);
      return sendSuccess(res, replies, 'Lấy bình luận thành công', HttpStatusCode.OK);
  } catch (error) {
      return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
  }
}

const createReply = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return sendError(
          res,
          errors.array().map((err) => err.msg).join(", "),
          HttpStatusCode.BAD_REQUEST
      );
  }

  try {
      const { content, commentId } = req.body;
      const userId = req.userId;

      const reply = await commentService.createReply(commentId, userId, content);
      return sendSuccess(res, reply, "Bạn vừa trả lời bình luận", HttpStatusCode.OK);
  } catch (error) {
      return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
  }
}

const updateReplyComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return sendError(
          res,
          errors.array().map((err) => err.msg).join(", "),
          HttpStatusCode.BAD_REQUEST
      );
  }

  try {
      const { content, commentId } = req.body;
      const replyId = req.params.id;
      const userId = req.userId;

      const updatedReply = await commentService.updateReply(commentId, replyId, userId, content);
      return sendSuccess(res, updatedReply, "Reply updated successfully", HttpStatusCode.OK);
  } catch (error) {
      return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
  }
}

const deleteReplyComment = async (req, res) => {
  try {
      const { commentId } = req.body;
      const replyId = req.params.id;
      const userId = req.userId;

      await commentService.deleteReply(commentId, replyId, userId);
      return sendSuccess(res, null, "Reply deleted successfully", HttpStatusCode.OK);
  } catch (error) {
      return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
  }
}

export default {
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment,
    getRepliesByCommentId,
    createReply,
    updateReplyComment,
    deleteReplyComment
}