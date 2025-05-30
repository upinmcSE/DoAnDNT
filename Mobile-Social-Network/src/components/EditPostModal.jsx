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
  const [hasChanges, setHasChanges] = useState(false);

  // Đồng bộ dữ liệu ban đầu khi modal mở
  useEffect(() => {
    if (visible) {
      setContent(initialContent || '');
      setImages(initialImages || []);
      setHasChanges(false);
    }
  }, [visible, initialContent, initialImages]);

  // Kiểm tra thay đổi
  useEffect(() => {
    const contentChanged = content !== (initialContent || '');
    const imagesChanged = images.length > (initialImages?.length || 0); // Chỉ kiểm tra nếu thêm ảnh mới
    setHasChanges(contentChanged || imagesChanged);
  }, [content, images, initialContent, initialImages]);

  // Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    try{
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => asset.uri);
        const totalImages = images.length + newImages.length;
        if (totalImages <= 10) {
          setImages([...images, ...newImages]);
        } else {
          alert(`Bạn chỉ có thể chọn tối đa 10 ảnh. Hiện tại đã có ${images.length} ảnh.`);
        }
      }
    } catch (error) {
      console.error('Lỗi khi chọn ảnh:', error);
      alert('Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  // Hàm lưu chỉnh sửa
  const handleSave = async () => {
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung bài viết.');
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = { postId, content, images };
      console.log('Data sent to onSave:', updatedData); // Log để debug
      await onSave(updatedData);
      onClose();
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
              numberOfLines={3}
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
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <FontAwesome5 name="plus" size={30} color="#ccc" />
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
                (isLoading || !hasChanges) && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={isLoading || !hasChanges}
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
    color: '#1E88E5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  input: {
    height: 60,
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
    borderColor: '#1E88E5',
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#1E88E5',
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
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditPostModal;