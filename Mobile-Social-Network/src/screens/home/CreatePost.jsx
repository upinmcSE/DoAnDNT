import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView,
    Pressable,
    Image,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Title, TextGlobal } from '../../components';
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useToast } from '../../context/ToastContext';
import { createPost } from '../../service/postService';

const CreatePost = () => {
    const navigation = useNavigation();
    const [images, setImages] = useState([]);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { showError, showSuccess, showInfo } = useToast();

    const isFormValid = () => {
        return content.trim().length > 0 && images.length > 0;
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                setImages(prevImages => {
                    if (prevImages.length < 10) {
                        return [...prevImages, imageUri];
                    } else {
                        showInfo("Thông báo", "Bạn chỉ có thể chọn tối đa 10 ảnh.");
                        return prevImages;
                    }
                });
            }
        } catch (error) {
            showError("Lỗi", "Không thể chọn ảnh. Vui lòng kiểm tra quyền truy cập.");
        }
    };

    const removeImage = (indexToRemove) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };

    const handleCreatePost = async () => {
        if (!isFormValid()) {
            showError("Lỗi", "Vui lòng nhập nội dung bài viết");
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("content", content);

            images.forEach((imageUri, index) => {
                formData.append("images", {
                    uri: imageUri,
                    type: "image/jpeg",
                    name: `image_${index}.jpg`,
                });
            });

            const response = await createPost(formData);

            const result = response.data;
            if (result.success) {
                showSuccess("Thành công", "Bài viết đã được tạo");
                navigation.navigate("Home", {
                    screen: "HomeScreen",
                    shouldRefresh: true
                });
                setContent("");
                setImages([]);
            } else {
                showError("Lỗi", result.message || "Không thể tạo bài viết");
            }
        } catch (error) {
            console.error("Lỗi khi tạo bài viết:", error.response?.data || error.message);
            showError("Lỗi", "Đã xảy ra lỗi khi tạo bài viết");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Tạo bài viết</Text>
            </View>
            <ScrollView style={styles.content}>
                <View style={styles.subTitle}><Title title='Status' /></View>
                <TextInput
                    placeholder='Nhập nội dung bài viết...'
                    numberOfLines={5}
                    multiline={true}
                    style={styles.input}
                    value={content}
                    onChangeText={setContent}
                />

                {images.length > 0 && (
                    <View style={styles.imagesContainer}>
                        {images.map((image, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image
                                    resizeMode='contain'
                                    source={{ uri: image }}
                                    style={styles.image}
                                />
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeImage(index)}
                                >
                                    <Text style={styles.removeText}>X</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.imgContainer, images.length === 0 ? styles.imgContainerSmall : null]}
                    onPress={pickImage}
                >
                    <FontAwesome5 name='plus' size={images.length === 0 ? 40 : 80} color="#ccc" />
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                    <Pressable
                        style={[styles.cancelBtn, styles.btn]}
                        onPress={() => navigation.goBack()}
                    >
                        <TextGlobal size={18} color='gray' content='Hủy' />
                    </Pressable>
                    <Pressable
                        style={[
                            styles.createBtn,
                            styles.btn,
                            !isFormValid() && styles.disabledBtn
                        ]}
                        onPress={handleCreatePost}
                        disabled={!isFormValid() || isLoading}
                    >
                        <TextGlobal
                            size={18}
                            color={isFormValid() ? 'white' : 'gray'}
                            content='Đăng bài'
                        />
                    </Pressable>
                </View>
            </ScrollView>

            {/* Modal Loading */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={isLoading}
                onRequestClose={() => {}}
            >
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#1E88E5" />
                    <Text style={styles.loadingText}>Đang tạo bài viết...</Text>
                </View>
            </Modal>
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
        backgroundColor: "#1E88E5",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        marginTop: 20
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    subTitle: {
        color: "#1E88E5",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 30,
    },
    input: {
        height: 100,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#f2f2f2",
        textAlignVertical: "top",
        fontSize: 16,
    },
    imgContainer: {
        backgroundColor: "#f2f2f2",
        marginTop: 20,
        height: 200,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    imgContainerSmall: {
        height: 100,
        width: "40%"
    },
    imagesContainer: {
        marginTop: 20,
    },
    imageWrapper: {
        position: 'relative',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        backgroundColor: '#f2f2f2',
    },
    removeButton: {
        position: 'absolute',
        top: 4,
        right: 32,
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
        width: '46%',
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center"
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#fff',
    },
});

export default CreatePost;