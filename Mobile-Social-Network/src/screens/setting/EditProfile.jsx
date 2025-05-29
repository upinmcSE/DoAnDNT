import React, { useContext, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView,
    Image,
    Pressable,
    Modal,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Title, TextGlobal, BackButton } from "../../components";
import colors from "../../constants/colors";
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext"; // Thêm useToast
import { updateProfile } from "../../service/userService";

const EditProfile = () => {
    const navigation = useNavigation();
    const { user, setUser } = useContext(AuthContext);
    const { showError } = useToast(); // Sử dụng showError từ ToastContext

    const [profileImage, setProfileImage] = useState(
        user.avtUrl ? { uri: user.avtUrl } : require("../../assets/images/anhnen.png")
    );
    const [name, setName] = useState(user.name || "");
    const [bio, setBio] = useState(user.bio || "");
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Hàm kiểm tra tên không chứa ký tự đặc biệt
    const validateName = (name) => {
        // Chỉ cho phép chữ cái (bao gồm dấu tiếng Việt), số, khoảng trắng
        const nameRegex = /^[a-zA-ZÀ-ỹ0-9\s]*$/;
        return nameRegex.test(name);
    };

    // Hàm kiểm tra xem có thay đổi nào không
    const hasChanges = () => {
        const initialImageUri = user.avtUrl || require("../../assets/images/anhnen.png").uri;
        const currentImageUri = profileImage.uri || profileImage;

        return (
            name.trim() !== (user.name || "").trim() ||
            bio.trim() !== (user.bio || "").trim() ||
            (isImageChanged && currentImageUri !== initialImageUri)
        );
    };

    // Hàm chọn ảnh từ thư viện
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setProfileImage({ uri: result.assets[0].uri });
                setIsImageChanged(true);
            }
        } catch (error) {
            console.error("Lỗi khi chọn ảnh:", error);
            showError("Lỗi", "Đã xảy ra lỗi khi chọn ảnh. Vui lòng kiểm tra quyền truy cập thư viện ảnh.");
        }
    };

    // Hàm lưu thông tin profile
    const saveProfile = async () => {
        if (!hasChanges()) {
            navigation.goBack();
            return;
        }

        // Validate tên người dùng
        if (!validateName(name)) {
            showError("Lỗi", "Tên không được chứa ký tự đặc biệt.");
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();

            if (isImageChanged && profileImage.uri) {
                formData.append("image", {
                    uri: profileImage.uri,
                    type: "image/jpeg",
                    name: "profile.jpg",
                });
            }

            formData.append("name", name);
            formData.append("bio", bio);

            const response = await updateProfile(formData);

            const result = response.data;
            if (result.success) {
                console.log("Cập nhật profile thành công:", result.data);
                setUser({
                    ...user,
                    name: result.data.name,
                    bio: result.data.bio,
                    avtUrl: result.data.avtUrl || user.avtUrl,
                });
                setIsImageChanged(false);
                navigation.goBack();
            } else {
                console.error("Cập nhật profile thất bại:", result.message);
                showError("Lỗi", "Không thể cập nhật profile. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi lưu profile:", error.response?.data || error.message);
            showError("Lỗi", "Đã xảy ra lỗi khi lưu profile.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BackButton color="white" />
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={styles.title}>Chỉnh sửa thông tin</Text>
                </View> 
            </View>
            <ScrollView style={styles.content}>
                <View style={styles.subTitle}>
                    <Title title="Ảnh đại diện" />
                    <View style={styles.avatarContainer}>
                        <Image
                            source={profileImage}
                            style={styles.avatar}
                        />
                        <TouchableOpacity
                            style={styles.changeAvatarButton}
                            onPress={pickImage}
                        >
                            <AntDesign color="white" name="edit" size={16} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.subTitle}>
                    <Title title="Họ và tên" />
                    <TextInput
                        placeholder="Nhập họ và tên"
                        placeholderTextColor="#B3B3B3"
                        style={styles.nameText}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.subTitle}>
                    <Title title="Bio" />
                </View>
                <View style={styles.largeInputContainer}>
                    <TextInput
                        placeholder={bio ? bio : "Hãy giới thiệu một chút về bản thân"}
                        placeholderTextColor="#B3B3B3"
                        style={styles.largeInput}
                        multiline
                        value={bio}
                        onChangeText={setBio}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Pressable 
                        style={[styles.cancelBtn, styles.btn]}
                        onPress={() => navigation.goBack()}
                    >
                        <TextGlobal size={18} color="gray" content="Hủy" />
                    </Pressable>
                    <Pressable 
                        style={[
                            styles.createBtn, 
                            styles.btn,
                            (!hasChanges() || isLoading) && styles.disabledBtn
                        ]}
                        onPress={saveProfile}
                        disabled={!hasChanges() || isLoading}
                    >
                        <TextGlobal 
                            size={18} 
                            color={hasChanges() && !isLoading ? "white" : "gray"} 
                            content="Lưu" 
                        />
                    </Pressable>
                </View>
            </ScrollView>

            {/* Loading toàn màn hình */}
            {isLoading && (
                <Modal
                    transparent={true}
                    animationType="none"
                    visible={isLoading}
                    onRequestClose={() => {}}
                >
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#1E88E5" />
                        <Text style={styles.loadingText}>Đang cập nhật thông tin...</Text>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        width: "100%",
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1E88E5",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    subTitle: {
        color: "#1E88E5",
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 30,
    },
    avatarContainer: {
        marginTop: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    changeAvatarButton: {
        position: "absolute",
        backgroundColor: colors.secondary,
        borderRadius: 50,
        bottom: 0,
        left: 74,
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    nameText: {
        fontSize: 16,
        padding: 10,
        color: "#A0A0A0",
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: "#F3F3F5",
    },
    largeInput: {
        fontSize: 16,
        color: "#A0A0A0",
        textAlignVertical: "top",
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        height: 200,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 40,
    },
    btn: {
        height: 48,
        width: "46%",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelBtn: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#1E88E5",
    },
    createBtn: {
        backgroundColor: "#1E88E5",
    },
    disabledBtn: {
        backgroundColor: "#cccccc",
        opacity: 0.7,
    },
    loadingOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#fff",
    },
});

export default EditProfile;