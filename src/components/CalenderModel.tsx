import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';
import Container from './Container';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import { Picker } from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '@react-navigation/native';

// Thêm định nghĩa kiểu ở đây
type RootStackParamList = {
  HomeScreen: undefined;
  // Thêm các screen khác nếu cần
};

type NavigationProps = NavigationProp<RootStackParamList>;

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void; // Thêm ? để làm prop này optional
  onHome?: () => void; // Thêm ? để làm prop này optional
}

interface DayData {
  day: number;
  isCurrentMonth: boolean;
}

const CalendarModal: React.FC<CalendarModalProps> = ({visible, onClose}) => {
  const navigation = useNavigation<NavigationProps>();
  const weekDays = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];

  const [currentDate] = useState(new Date());
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const getDaysInMonth = (month: number, year: number) => {
    const monthsWith31Days = [0, 2, 4, 6, 7, 9, 11];
    if (monthsWith31Days.includes(month)) {
      return 31;
    }
    if (month === 1) {
      return isLeapYear(year) ? 29 : 28;
    }
    return 30;
  };

  const generateCalendarData = (): DayData[] => {
    const days: DayData[] = [];
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInPreviousMonth = getDaysInMonth(
      selectedMonth === 0 ? 11 : selectedMonth - 1,
      selectedYear,
    );

    // Add previous month's days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: daysInPreviousMonth - i,
        isCurrentMonth: false,
      });
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
      });
    }

    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({day: i, isCurrentMonth: false});
    }

    return days;
  };

  const calendarData = generateCalendarData();

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const handleYearChange = (newYear: number) => {
    setSelectedYear(newYear);
  };

  const handleMonthYearSelect = () => {
    setPickerVisible(true);
  };

  // Handler cho nút Home
  const handleHomePress = () => {
    // @ts-ignore
    navigation.navigate('HomeScreen'); // Điều hướng về màn hình Home
    onClose(); // Đóng modal sau khi về trang chủ
  };

  // Handler cho nút Back
  const handleBackPress = () => {
    handleMonthChange('prev'); // Lùi về tháng trước
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Container>
          {/* Header with Back, Home, and Next buttons */}
          <RowComponent justify="space-between" style={styles.header}>
            {/* Button to go home - Đã thêm handler */}
            <TouchableOpacity
              onPress={handleHomePress}
              style={styles.homeButton}>
              <Icon name="home-outline" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              {/* Button to go back - Đã thêm handler */}
              <TouchableOpacity onPress={handleBackPress}>
                <Icon name="arrow-back-outline" size={24} color={colors.text} />
              </TouchableOpacity>
              {/* Month and Year */}
              <TouchableOpacity
                onPress={handleMonthYearSelect}
                style={styles.monthYearButton}>
                <TextComponent
                  text={`${selectedMonth + 1} / ${selectedYear}`}
                  font={fontFamilies.semiBold}
                  size={20}
                  color={colors.text}
                />
              </TouchableOpacity>
              {/* Button to go to next month */}
              <TouchableOpacity onPress={() => handleMonthChange('next')}>
                <Icon
                  name="arrow-forward-outline"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
          </RowComponent>

          {/* Calendar Days Header */}
          <RowComponent style={styles.weekDaysContainer}>
            {weekDays.map(day => (
              <View key={day} style={styles.weekDay}>
                <TextComponent text={day} color={colors.btnGray2} size={14} />
              </View>
            ))}
          </RowComponent>

          {/* Calendar Days Grid */}
          <View style={styles.calendarGrid}>
            {calendarData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.dayCell,
                  item.isCurrentMonth ? styles.currentMonthDay : {},
                ]}>
                <TextComponent
                  text={item.day !== 0 ? item.day.toString() : ''}
                  color={item.isCurrentMonth ? colors.text : colors.btnGray2}
                  size={16}
                />
              </View>
            ))}
          </View>

          {/* Floating action button to add event */}
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add-outline" size={24} color={colors.bgColor} />
          </TouchableOpacity>
        </Container>
      </View>

      {/* Month and Year Picker Modal */}
      {isPickerVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isPickerVisible}>
          <View style={styles.pickerModal}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedYear}
                onValueChange={handleYearChange}
                style={styles.picker}>
                {Array.from({length: 101}, (_, i) => 2000 + i).map(year => (
                  <Picker.Item
                    key={year}
                    label={year.toString()}
                    value={year}
                  />
                ))}
              </Picker>
              <TouchableOpacity
                onPress={() => setPickerVisible(false)}
                style={styles.closePickerButton}>
                <TextComponent text="Đóng" color={colors.bgColor} size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 0,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.btnGray2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeButton: {
    marginRight: 'auto',
    padding: 10,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  monthYearButton: {
    paddingHorizontal: 10,
  },
  weekDaysContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  dayCell: {
    width: '13%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  currentMonthDay: {
    backgroundColor: colors.bgColor,
    borderRadius: 50,
  },
  addButton: {
    position: 'absolute',
    bottom: -30,
    right: 20,
    backgroundColor: colors.yellowText,
    borderRadius: 50,
    padding: 10,
  },
  pickerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  picker: {
    height: 200,
  },
  closePickerButton: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default CalendarModal;
