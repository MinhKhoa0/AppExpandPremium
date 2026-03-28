import React, {ReactNode, useState} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamilies';
import {colors} from '../constants/colors';

interface Props {
  containerStyle?: object;
  selectedTextColor?: string;
  unselectedTextColor?: string;
  modalBackgroundColor?: string;
  onMonthYearChange?: (month: number, year: number) => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    color: colors.text,
    fontFamily: fontFamilies.regular,
  },
  dropdownIcon: {
    marginLeft: 4,
    fontSize: 16,
    color: colors.text,
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 16,
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 16, // Thêm khoảng cách giữa các phần tử
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  monthButton: {
    width: '30%',
    marginVertical: 8,
    padding: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedMonthButton: {
    backgroundColor: '#FFD842',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 16,
  },
  actionButton: {
    marginHorizontal: 8,
  },
});

const DateHeaderComponent: React.FC<Props> = ({
  containerStyle,
  selectedTextColor = '#000',
  unselectedTextColor = '#fff',
  modalBackgroundColor = '#1a1a1a',
  onMonthYearChange,
  style,
}) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDate.getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getFullYear(),
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [tempMonth, setTempMonth] = useState<number>(selectedMonth);

  const months = [
    'Thg 1',
    'Thg 2',
    'Thg 3',
    'Thg 4',
    'Thg 5',
    'Thg 6',
    'Thg 7',
    'Thg 8',
    'Thg 9',
    'Thg 10',
    'Thg 11',
    'Thg 12',
  ];

  const handleMonthSelect = (month: number) => {
    setTempMonth(month);
  };

  const handleMonthConfirm = () => {
    setSelectedMonth(tempMonth);
    onMonthYearChange?.(tempMonth, selectedYear);
    setShowModal(false);
  };

  const handleYearChange = (increment: boolean) => {
    const newYear = increment ? selectedYear + 1 : selectedYear - 1;
    setSelectedYear(newYear);
    onMonthYearChange?.(selectedMonth, newYear);
  };

  const cancelSelection = () => {
    setTempMonth(selectedMonth); // Reset lại tháng tạm thời về tháng đã chọn
    setShowModal(false);
  };

  return (
    <View style={[styles.headerContainer, containerStyle, style]}>
      <TouchableOpacity
        style={styles.leftSection}
        onPress={() => setShowModal(true)}>
        <View style={styles.dateContainer}>
          <TextComponent
            text={`${selectedYear} Thg ${selectedMonth}`}
            style={styles.dateText}
          />
          <TextComponent text="▼" style={styles.dropdownIcon} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelSelection}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: modalBackgroundColor},
            ]}>
            <View style={styles.yearRow}>
              <TouchableOpacity
                onPress={() => handleYearChange(false)}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <TextComponent
                  text="<"
                  color={unselectedTextColor}
                  size={24}
                  font={fontFamilies.medium}
                />
              </TouchableOpacity>
              <TextComponent
                text={selectedYear.toString()}
                font={fontFamilies.medium}
                size={20}
                color={unselectedTextColor}
              />
              <TouchableOpacity
                onPress={() => handleYearChange(true)}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <TextComponent
                  text=">"
                  color={unselectedTextColor}
                  size={24}
                  font={fontFamilies.medium}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.monthGrid}>
              {months.map((month, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.monthButton,
                    tempMonth === index + 1 && styles.selectedMonthButton,
                  ]}
                  onPress={() => handleMonthSelect(index + 1)}>
                  <TextComponent
                    text={month}
                    color={
                      tempMonth === index + 1
                        ? selectedTextColor
                        : unselectedTextColor
                    }
                    font={
                      tempMonth === index + 1
                        ? fontFamilies.medium
                        : fontFamilies.regular
                    }
                    size={16}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={cancelSelection}
                style={styles.actionButton}>
                <TextComponent
                  text="Hủy"
                  color={colors.yellowText}
                  font={fontFamilies.medium}
                  size={16}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleMonthConfirm}
                style={styles.actionButton}>
                <TextComponent
                  text="Xác nhận"
                  color={colors.yellowText}
                  font={fontFamilies.medium}
                  size={16}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DateHeaderComponent;
