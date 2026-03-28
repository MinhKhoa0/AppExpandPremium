import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, TextInput, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';
import Container from './Container';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';

interface SearchModalProps {
  visible?: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({visible, onClose}) => {
  const [selectedType, setSelectedType] = useState('Tất cả');

  if (!visible) {
    return null;
  }

  const types = ['Tất cả', 'Chi phí', 'Thu nhập', 'Chuyển khoản'];

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Container>
          <RowComponent justify="space-between" style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="arrow-back-outline" size={24} color={colors.text} />
            </TouchableOpacity>
            <TextComponent
              text="Tìm kiếm"
              font={fontFamilies.semiBold}
              size={20}
              color={colors.text}
            />
            <View style={{width: 24}} />
          </RowComponent>

          <View style={styles.searchContainer}>
            <Icon name="search-outline" size={24} color={colors.btnGray2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm..."
              placeholderTextColor={colors.btnGray2}
            />
          </View>

          <View style={styles.filterSection}>
            <TextComponent text="Kiểu" color={colors.text} size={16} />
            <View style={styles.typeContainer}>
              {types.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, selectedType === type && styles.selectedType]}
                  onPress={() => setSelectedType(type)}>
                  <TextComponent
                    text={type}
                    color={selectedType === type ? colors.bgColor : colors.text}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Container>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.bgColor, // Màu mờ đen cho toàn màn hình
    justifyContent: 'flex-start', // Để phần nội dung modal nằm trên cùng
    alignItems: 'stretch', // Mở rộng phần tử ra toàn màn hình
    paddingTop: 0, // Thêm một chút khoảng cách từ trên cùng của màn hình
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.btnGray2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    margin: 20,
    padding: 10,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: fontFamilies.regular,
  },
  filterSection: {
    padding: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  typeButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedType: {
    backgroundColor: colors.yellowText,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButton: {
    backgroundColor: '#333333',
    padding: 8,
    borderRadius: 20,
  },
});

export default SearchModal;
