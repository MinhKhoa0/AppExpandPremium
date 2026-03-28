import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Container from '../components/Container';
import RowComponent from '../components/RowComponent';
import SectionComponent from '../components/SectionComponent';
import TextComponent from '../components/TextComponent';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';
import {NavigationProp} from '@react-navigation/native';
import {firebaseService} from '../services/FirebaseService.ts';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firebase } from '@react-native-firebase/auth';

type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

type AddScreenProps = {
  navigation: NavigationProp<any, any>;
};

const TRANSACTION_TYPES = {
  EXPENSE: 'EXPENSE',
  INCOME: 'INCOME',
} as const;

const CATEGORIES: Record<string, Category[]> = {
  [TRANSACTION_TYPES.EXPENSE]: [
    {id: 'food', name: 'Đồ ăn', icon: 'restaurant-outline', color: colors.red1},
    {id: 'shopping', name: 'Mua sắm', icon: 'cart-outline', color: colors.red1},
    {
      id: 'hospital',
      name: 'Bệnh viện',
      icon: 'medical-outline',
      color: colors.red1,
    },
    {
      id: 'entertainment',
      name: 'Giải trí',
      icon: 'game-controller-outline',
      color: colors.red1,
    },
    {
      id: 'transport',
      name: 'Di chuyển',
      icon: 'car-outline',
      color: colors.red1,
    },
    {
      id: 'utilities',
      name: 'Hóa đơn',
      icon: 'receipt-outline',
      color: colors.red1,
    },
  ],
  [TRANSACTION_TYPES.INCOME]: [
    {id: 'salary', name: 'Lương', icon: 'cash-outline', color: colors.green1},
    {id: 'bonus', name: 'Thưởng', icon: 'gift-outline', color: colors.green1},
    {
      id: 'investment',
      name: 'Đầu tư',
      icon: 'trending-up-outline',
      color: colors.green1,
    },
    {
      id: 'side_job',
      name: 'Thu nhập phụ',
      icon: 'briefcase-outline',
      color: colors.green1,
    },
    {
      id: 'other_income',
      name: 'Khác',
      icon: 'add-circle-outline',
      color: colors.green1,
    },
  ],
};

const AddScreen: React.FC<AddScreenProps> = ({navigation}) => {
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>(
    TRANSACTION_TYPES.EXPENSE,
  );
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddTransaction = async () => {
    const userID = firebase.auth().currentUser?.uid;
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert('Lỗi', 'Số tiền phải là số dương');
      return;
    }

    if (!selectedCategory || !userID) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền và chọn danh mục');
      return;
    }

    if (!amount || !selectedCategory || !userID) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền và chọn danh mục');
      return;
    }

    try {
      const transaction = {
        type,
        amount:
          type === TRANSACTION_TYPES.EXPENSE ? -Number(amount) : Number(amount),
        category: {
          id: selectedCategory.id,
          name: selectedCategory.name,
          icon: selectedCategory.icon,
        },
        note,
        date: date.toISOString(),
      };

      await firebaseService.addTransaction( userID, transaction);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm giao dịch. Vui lòng thử lại.');
    }
  };

  const renderCategories = () => {
    const categories = CATEGORIES[type];
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              selectedCategory?.id === category.id && styles.selectedCategory,
              {borderColor: category.color},
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Icon
              name={category.icon}
              size={20}
              color={
                selectedCategory?.id === category.id
                  ? category.color
                  : colors.yellowText
              }
            />
            <TextComponent
              text=""
              style={[
                styles.categoryName,
                selectedCategory?.id === category.id && {color: category.color},
              ]}>
              {category.name}
            </TextComponent>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderNumberPad = () => {
    const numbers = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      ' ',
      '0',
      '⌫',
    ];
    return (
      <View style={styles.numberPad}>
        {numbers.map(num => (
          <TouchableOpacity
            key={num}
            style={styles.numberKey}
            onPress={() => {
              if (num === '⌫') {
                setAmount(prev => prev.slice(0, -1));
              } else if (num === '.' && amount.includes('.')) {
                return;
              } else if (num !== ' ') {
                setAmount(prev => prev + num);
              }
            }}>
            <TextComponent
              text=""
              style={[
                styles.numberKeyText,
                num === '⌫' && styles.deleteButton,
              ]}>
              {num}
            </TextComponent>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Container>
      <SectionComponent>
        <RowComponent style={styles.typeSelector} style={{marginTop:20}} >
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === TRANSACTION_TYPES.EXPENSE &&
                styles.selectedExpenseButton,
            ]}
            onPress={() => setType(TRANSACTION_TYPES.EXPENSE)}>
            <TextComponent
              text="Chi phí"
              style={[
                styles.typeButtonText,
                type === TRANSACTION_TYPES.EXPENSE && styles.selectedTypeText,
              ]}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === TRANSACTION_TYPES.INCOME && styles.selectedIncomeButton,
            ]}
            onPress={() => setType(TRANSACTION_TYPES.INCOME)}>
            <TextComponent
              text="Thu nhập"
              style={[
                styles.typeButtonText,
                type === TRANSACTION_TYPES.INCOME && styles.selectedTypeText,
              ]}/>
          </TouchableOpacity>
        </RowComponent>

        {renderCategories()}

        <View style={styles.amountContainer}>
          <TextComponent
            text=""
            style={[
              styles.amountText,
              {
                color:
                  type === TRANSACTION_TYPES.INCOME
                    ? colors.text
                    : colors.text,
              },
            ]}>
            {amount ? Number(amount).toLocaleString() : '0'} đ
          </TextComponent>
        </View>

        <TextInput
          style={styles.noteInput}
          placeholder="Ghi chú"
          value={note}
          onChangeText={setNote}
          placeholderTextColor={colors.bgColor}
        />

        {renderNumberPad()}

        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor:
                type === TRANSACTION_TYPES.INCOME ? colors.green1 : colors.red1,
            },
          ]}
          onPress={handleAddTransaction}>
          <TextComponent text="Thêm" style={styles.addButtonText}>
            {type === TRANSACTION_TYPES.INCOME ? 'thu nhập' : 'chi phí'}
          </TextComponent>
        </TouchableOpacity>
      </SectionComponent>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  categoriesContainer: {
    marginVertical: 20,
  },
  typeSelector: {
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 3,
    backgroundColor: colors.bgColor,
    marginHorizontal: 10,
  },
  selectedExpenseButton: {
    backgroundColor: colors.red1 + '50',
  },
  selectedIncomeButton: {
    backgroundColor: colors.red1 + '50',
  },

  typeButtonText: {
    fontFamily: fontFamilies.medium,
    color: colors.yellowText,
  },

  selectedTypeText: {
    color: colors.bgColor,
  },
// ways danh mục chi phí/thunhap
  categoryItem: {
    // ô button chi phi thu nha vd lương
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.btnBlack,
    minWidth: 77,
  },
  selectedCategory: {
    backgroundColor: colors.text + '70',
  },
  categoryName: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    color: colors.yellowText,
  },

  //cho hien thi so tien
  amountContainer: {
    alignItems: 'center',
    marginVertical: 30,
    color: colors.text,
  },
  amountText: {
    fontSize: 30,
    fontFamily: fontFamilies.bold,
  },
  noteInput: {
    backgroundColor: colors.btnGray1,
    padding: 20,
    paddingBottom: 20,
    borderRadius: 10,
    color: colors.bgColor,
    fontFamily: fontFamilies.regular,
    marginBottom: 10,
  },
  //ways bàn phím số
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },
  //ways bàn phím số
  numberKey: {
    width: '33.33%',
    padding: 20,
    alignItems: 'center',
  },
  numberKeyText: {
    fontSize: 20,
    fontFamily: fontFamilies.semiBold,
    color: colors.text,
  },
  //ways nút xóa
  deleteButton: {
    color: colors.yellowText,
  },
  addButton: {
    padding: 10,
    // paddingBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 50,
  },
  addButtonText: {
    color: colors.text,
    fontSize: 30,
    fontFamily: fontFamilies.medium,
  },
});

export default AddScreen;
