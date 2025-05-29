import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';


const EditPostModal = ({ visible, postId, initialContent, initialImages, onSave, onClose }) => {
  const [content, setContent] = useState(initialContent || '');
  const [images, setImages] = useState(initialImages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false); // Thêm state để kiểm tra thay đổi

  // Đồng bộ dữ liệu ban đầu khi modal mở
  useEffect(() => {
    if (visible) {
      setContent(initialContent || '');
      setImages(initialImages || []);
      setHasChanges(false); // Reset hasChanges khi modal mở
    }
  }, [visible, initialContent, initialImages]);

  // Kiểm tra thay đổi bất cứ khi nào content hoặc images thay đổi
  useEffect(() => {
    const contentChanged = content !== (initialContent || '');
    const imagesChanged =
      images.length !== (initialImages?.length || 0) ||
      images.some((img, index) => img !== initialImages?.[index]);
    setHasChanges(contentChanged || imagesChanged);
  }, [content, images, initialContent, initialImages]);

  // Hàm chọn ảnh từ thư viện
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
        setImages((prevImages) => {
          if (prevImages.length < 10) {
            return [...prevImages, imageUri];
          } else {
            alert('Bạn chỉ có thể chọn tối đa 10 ảnh.');
            return prevImages;
          }
        });
      }
    } catch (error) {
      console.error('Lỗi khi chọn ảnh:', error);
      alert('Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  // Hàm xóa ảnh
  const removeImage = (indexToRemove) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  // Hàm lưu chỉnh sửa
  const handleSave = async () => {
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung bài viết.');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({ postId, content, images });
      onClose(); // Đóng modal sau khi lưu thành công
    } catch (error) {
      console.error('Lỗi khi lưu bài viết:', error);
      alert('Đã xảy ra lỗi khi lưu bài viết.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Chỉnh sửa bài viết</Text>

          <ScrollView style={styles.scrollContainer}>
            <TextInput
              placeholder="Nhập nội dung bài viết..."
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
                      source={{ uri: image }}
                      style={styles.image}
                      resizeMode="contain"
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

            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <FontAwesome5 name="plus" size={40} color="#ccc" />
              <Text style={styles.addImageText}>Thêm ảnh</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonCancel}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                (isLoading || !hasChanges) && styles.disabledButton, // Disable khi không có thay đổi
              ]}
              onPress={handleSave}
              disabled={isLoading || !hasChanges} // Chỉ bật khi có thay đổi và không loading
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonSave}>Lưu</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: "#1E88E5",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  input: {
    height: 100,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  imagesContainer: {
    marginBottom: 15,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addImageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  addImageText: {
    marginTop: 5,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1E88E5",
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#1E88E5",
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonSave: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonCancel: {
    color: "#1E88E5",
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditPostModal;