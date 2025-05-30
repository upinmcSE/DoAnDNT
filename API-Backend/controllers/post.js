import { validationResult } from "express-validator";
import { postService } from "../services/index.js";
import HttpStatusCode from "../error/HttpStatusCode.js";
import { sendSuccess, sendError } from '../middlewares/responseHandler.js';
import { cloudinary } from "../config/cloudinary/cloudinary.js";


const createPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(
        res,
        errors.array().map((err) => err.msg).toString(),
        HttpStatusCode.BAD_REQUEST
      );
    }
  
    try {
      const user_id = req.userId;
      const { content } = req.body;
      const files = req.files; 
  
      // Upload ảnh lên Cloudinary
      const uploadedImages = [];
      if (files && files.length > 0) {
        const uploadPromises = files.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: "posts", // Thư mục trên Cloudinary
          })
        );
        const results = await Promise.all(uploadPromises);
        uploadedImages.push(...results.map((result) => ({
          url: result.secure_url,
          public_id: result.public_id,
        })));
      }
  
      const result = await postService.createPost({
        userId: user_id,
        content,
        imageUrls: uploadedImages.map((img) => img.url),
      });
  
      return sendSuccess(res, result, "Post created successfully", HttpStatusCode.OK);
    } catch (error) {
      return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
    }
};

const updatePost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      errors.array().map((err) => err.msg).toString(),
      HttpStatusCode.BAD_REQUEST
    );
  }

  try {
    const { postId } = req.params;
    const userId = req.userId;
    const { content } = req.body;
    const files = req.files

    // Upload ảnh mới lên Cloudinary
    const uploadedImages = [];
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: 'posts',
        })
      );
      const results = await Promise.all(uploadPromises);
      uploadedImages.push(...results.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
      })));
    }    

    const imageUrls = uploadedImages.map((img) => img.url);

    const post = await postService.updatePost(postId, content, imageUrls);
    return sendSuccess(res, post, 'Cập nhật bài viết thành công', HttpStatusCode.OK);
  } catch (error) {
    return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
  }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        return sendSuccess(res, posts, 'Lấy tất cả bài viết thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
    }
}

const getAllPostsNetwork = async (req, res) => {
    try {
      const userId = req.userId;
        const posts = await postService.getAllPostsNetwork(userId);
        return sendSuccess(res, posts, 'Lấy tất cả bài viết mạng xã hội thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
    }
}

const getPostsByUserId= async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await postService.getPostsByUserId(userId);
        return sendSuccess(res, posts, 'Lấy bài viết thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
    }
}

const likePost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(
        res,
        errors.array().map((err) => err.msg).toString(),
        HttpStatusCode.BAD_REQUEST
      );
    }
    try {
        const { postId } = req.body;
        const userId = req.userId;
        const post = await postService.likePost(postId, userId);
        return sendSuccess(res, post, 'Like bài viết thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
    }
}

const unlikePost = async (req, res) => {
const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(
        res,
        errors.array().map((err) => err.msg).toString(),
        HttpStatusCode.BAD_REQUEST
      );
    }
    try {
        const { postId } = req.body;
        const userId = req.userId;
        const post = await postService.unlikePost(postId, userId);
        return sendSuccess(res, post, 'Unlike bài viết thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
    }
}

const listLikesPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postService.listLikesPost(postId);
        return sendSuccess(res, post, 'Lấy danh sách người thích bài viết thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
    }
}

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;
        const post = await postService.deletePost(postId, userId);
        return sendSuccess(res, post, 'Xóa bài viết thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
    }
}

const getPostByPostId = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postService.getPostByPostId(postId);
        return sendSuccess(res, post, 'Lấy bài viết thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
    }
}

export default {
    createPost,
    updatePost,
    getPostsByUserId,
    likePost,
    getAllPosts,
    unlikePost,
    listLikesPost,
    deletePost,
    getAllPostsNetwork,
    getPostByPostId
}
