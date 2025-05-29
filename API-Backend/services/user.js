import Exception from '../error/Exception.js';
import HttpStatusCode from '../error/HttpStatusCode.js';
import User from '../models/User.js';
import Post from '../models/Post.js';

const getProfile = async (id) => {
    try {
        const user = await User.findById(id).select('-password -emailVerificationCode -emailVerificationCodeExpiryDate -emailVerified -createdAt -updatedAt -__v');
        if (!user) {
            throw new Exception(HttpStatusCode.NOT_FOUND, 'Người dùng không tồn tại');
        }
        return user;
    } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, 'Đã có lỗi xảy ra');
    }
}

const getUserById = async (id) => {
    try {
        const user = await User.findById(id).select('-password -emailVerificationCode -emailVerificationCodeExpiryDate -emailVerified -createdAt -updatedAt -__v');
        if (!user) {
            throw new Exception(HttpStatusCode.NOT_FOUND, 'Người dùng không tồn tại');
        }
        return user;
    } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, 'Đã có lỗi xảy ra');
    }
}

const updateProfile = async (id, data) => {
    try {
        const updateData = {
            name: data.name,
            bio: data.bio,
        };

        // Nếu có avtUrl mới, ghi đè lên avtUrl cũ
        if (data.avtUrl) {
            updateData.avtUrl = data.avtUrl;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select("name bio avtUrl");

        if (!updatedUser) {
            throw new Exception(HttpStatusCode.NOT_FOUND, 'Người dùng không tồn tại');
        }

        return updatedUser;
    } catch (error) {
        throw new Exception(error.code || HttpStatusCode.INTERNAL_SERVER, error.message || 'Đã có lỗi xảy ra');
    }
};

const followUser = async (userId, followUserId) => {
    try {
        const user = await User.findById(userId);
        const followUser = await User.findById(followUserId);

        if (!user || !followUser) {
            throw new Exception(HttpStatusCode.NOT_FOUND, 'Người dùng không tồn tại');
        }

        if (user.following.includes(followUserId)) {
            throw new Exception(HttpStatusCode.BAD_REQUEST, 'Bạn đã theo dõi người dùng này rồi');
        }

        user.following.push(followUserId);
        followUser.followers.push(userId);

        await user.save();
        await followUser.save();

        return { message: 'Theo dõi thành công' };
    } catch (error) {
        throw new Exception(error.code || HttpStatusCode.INTERNAL_SERVER, error.message || 'Đã có lỗi xảy ra');
    }
}

const unfollowUser = async (userId, unfollowUserId) => {
    try {
        const user = await User.findById(userId);
        const unfollowUser = await User.findById(unfollowUserId);

        if (!user || !unfollowUser) {
            throw new Exception(HttpStatusCode.NOT_FOUND, 'Người dùng không tồn tại');
        }

        // Kiểm tra xem user có đang theo dõi unfollowUser không
        if (!user.following.includes(unfollowUserId)) {
            throw new Exception(HttpStatusCode.BAD_REQUEST, 'Bạn chưa theo dõi người dùng này');
        }

        // Loại bỏ unfollowUserId khỏi danh sách following của user
        user.following = user.following.filter(id => id.toString() !== unfollowUserId.toString());

        // Loại bỏ userId khỏi danh sách followers của unfollowUser
        unfollowUser.followers = unfollowUser.followers.filter(id => id.toString() !== userId.toString());

        await user.save();
        await unfollowUser.save();

        return { message: 'Hủy theo dõi thành công' };
    } catch (error) {
        throw new Exception(error.code || HttpStatusCode.INTERNAL_SERVER, error.message || 'Đã có lỗi xảy ra');
    }
};

const searchByText = async (searchText) => {
    try {
        // Kiểm tra nếu searchText không được cung cấp
        if (!searchText || searchText.trim() === "") {
            throw new Exception(HttpStatusCode.BAD_REQUEST, 'Vui lòng cung cấp từ khóa tìm kiếm');
        }
  
        // Chuẩn hóa searchText: loại bỏ khoảng trắng thừa và chuyển thành không phân biệt hoa/thường
        const searchQuery = searchText.trim();
  
        // Tìm kiếm người dùng dựa trên name (sử dụng regex để tìm gần đúng)
        const userQuery = {
            name: { $regex: searchQuery, $options: "i" }, // "i" để không phân biệt hoa/thường
        };
  
        const users = await User.find(userQuery)
            .select("_id name avtUrl ") // Chỉ lấy các trường cần thiết
            .limit(10) // Giới hạn số lượng kết quả để tối ưu
            .lean(); // Chuyển thành plain object để tối ưu hiệu suất
  
        return {
            users,
        }
    } catch (error) {
        throw new Exception(error.code || HttpStatusCode.INTERNAL_SERVER, error.message || 'Đã có lỗi xảy ra');
    }
}


export default {
    getProfile,
    getUserById,
    updateProfile,
    followUser,
    unfollowUser,
    searchByText,
}