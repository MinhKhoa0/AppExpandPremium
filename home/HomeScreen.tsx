import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Container from '../src/components/Container';
import RowComponent from '../src/components/RowComponent';
import SectionComponent from '../src/components/SectionComponent';
import TextComponent from '../src/components/TextComponent';
import TitleComponent from '../src/components/TitleComponent';
import {fontFamilies} from '../src/constants/fontFamilies';
import {colors} from '../src/constants/colors';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {firebaseService, Transaction} from '../src/services/FirebaseService.ts';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarModal from '../src/components/CalenderModel.tsx';
import SearchModal from '../src/components/SearchModel';
import DateHeaderComponent from '../src/components/DateHeaderComponent';
import { firebase } from '@react-native-firebase/firestore';

type RootStackParamList = {
  Home: undefined;
  Chart: undefined;
  Add: undefined;
  Profile: undefined;
};

const HomeScreen = () => {
  const currentDate = new Date();
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [isCalendarModalVisible, setCalendarModalVisible] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const user = firebase.auth().currentUser;
  if (user) {
    const unsubscribe = firebaseService.subscribeToTransactions(
      user.uid,
      updatedTransactions => {
        // Lọc transaction theo tháng và năm được chọn
        const filteredTransactions = updatedTransactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return (
            transactionDate.getMonth() + 1 === selectedMonth &&
            transactionDate.getFullYear() === selectedYear
          );
        });
        setTransactions(filteredTransactions);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  } else {
    setIsLoading(false);
  }
}, [selectedMonth, selectedYear]);

  const handleCalendarPress = () => {
    console.log('Calendar icon pressed');
    setCalendarModalVisible(true);
  };
  const handleSearchPress = () => {
    console.log('Search icon pressed');
    setSearchModalVisible(true); // Hiển thị SearchModal
  };
  // Calculate totals
  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  // Group transactions by date
  const groupTransactionsByDate = () => {
    const grouped: Record<
      string,
      {
        date: string;
        totalExpense: number;
        totalIncome: number;
        transactions: Transaction[];
      }
    > = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });

      if (!grouped[date]) {
        grouped[date] = {
          date,
          totalExpense: 0,
          totalIncome: 0,
          transactions: [],
        };
      }

      if (transaction.type === 'EXPENSE') {
        grouped[date].totalExpense += Math.abs(transaction.amount);
      } else {
        grouped[date].totalIncome += transaction.amount;
      }

      grouped[date].transactions.push(transaction);
    });

    return grouped;
  };

  const handleDeleteTransaction = (transactionId: string) => {
    const user = firebase.auth().currentUser;
  if (!user) {
    Alert.alert('Lỗi', 'Vui lòng đăng nhập');
    return;
  }

  Alert.alert('Xóa giao dịch', 'Bạn có chắc chắn muốn xóa giao dịch này?', [
    {
      text: 'Hủy',
      style: 'cancel',
    },
    {
      text: 'Xóa',
      style: 'destructive',
      onPress: async () => {
        try {
          await firebaseService.deleteTransaction(user.uid, transactionId);
        } catch (error) {
          console.error('Delete transaction error:', error);
          Alert.alert('Lỗi', 'Không thể xóa giao dịch. Vui lòng thử lại.');
        }
      },
    },
  ]);
  };


  const currentMonth = currentDate.toLocaleString('vi-VN', {month: 'numeric'});
  const currentYear = currentDate.getFullYear();

  if (isLoading) {
    return (
      <Container>
        <TextComponent text="Đang tải..." />
      </Container>
    );
  }

  return (
    <Container>
      <CalendarModal
        visible={isCalendarModalVisible}
        onClose={() => setCalendarModalVisible(false)} // Hàm đóng modal
      />

      <SearchModal
        visible={isSearchModalVisible}
        onClose={() => setSearchModalVisible(false)}
      />

      <SectionComponent>
        <RowComponent justify="space-between"  style={{marginTop:20}}>
          <TouchableOpacity onPress={handleSearchPress}>
            <TextComponent text= ""/>
          </TouchableOpacity>
          <TextComponent
            size={25}
            font={fontFamilies.semiBold}
            text="Sổ Thu Chi"
          />
          <TouchableOpacity onPress={handleCalendarPress}>
            <Icon name="calendar-outline" size={24} color={colors.btnGray2} />
          </TouchableOpacity>
        </RowComponent>
      </SectionComponent>

      <SectionComponent>
        <DateHeaderComponent
          onMonthYearChange={(month, year) => {
            setSelectedMonth(month);
            setSelectedYear(year);
          }}
          style={styles.header}>
          <TextComponent
            text={currentYear.toString()}
            style={styles.yearText}
          />
          <View style={styles.monthContainer}>
            <TextComponent
              text={` Tháng ${currentMonth.toString()}`}
              style={styles.monthText}
            />
          </View>
        </DateHeaderComponent>

        <RowComponent justify="space-between" style={styles.balanceRow}>
          <View>
            <TitleComponent
              style={styles.balanceLabel}
              size={20}
              text="Chi Phí"
            />
            <TextComponent
              text={`${totalExpense.toLocaleString()}đ`}
              style={[styles.balanceAmount, styles.expenseText]}
            />
          </View>
          <View>
            <TitleComponent
              style={styles.balanceLabel}
              size={20}
              text="Thu nhập"
            />
            <TextComponent
              text={`${totalIncome.toLocaleString()}đ`}
              style={[styles.balanceAmount, styles.incomeText]}
            />
          </View>
          <View>
            <TitleComponent
              style={styles.balanceLabel}
              size={20}
              text="Tổng số dư"
            />
            <TextComponent
              text={`${totalBalance.toLocaleString()}đ`}
              style={[
                styles.balanceAmount,
                totalBalance >= 0 ? styles.incomeText : styles.expenseText,
              ]}
            />
          </View>
        </RowComponent>
      </SectionComponent>

      <ScrollView style={styles.transactionList}>
        {Object.values(groupTransactionsByDate())
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .map(group => (
            <View key={group.date} style={styles.dateGroup}>
              <RowComponent justify="space-between" style={styles.dateHeader}>
                <TextComponent
                  text={`${group.date.toString()}`}
                  style={styles.dateText}
                />
                <RowComponent>
                  {group.totalExpense > 0 && (
                    <TextComponent
                      text={`Chi phí: ${group.totalExpense.toLocaleString()}đ`}
                      style={styles.dateExpense}
                    />
                  )}
                  {group.totalIncome > 0 && (
                    <TextComponent
                      text={`Thu nhập: ${group.totalIncome.toLocaleString()}đ`}
                      style={styles.dateIncome}
                    />
                  )}
                </RowComponent>
              </RowComponent>

              {group.transactions.map(transaction => (
                <TouchableOpacity
                  key={transaction.id}
                  onLongPress={() =>
                    transaction.id && handleDeleteTransaction(transaction.id)
                  }>
                  <RowComponent
                    justify="space-between"
                    style={styles.transaction}>
                    <View style={styles.transactionLeft}>
                      <View
                        style={[
                          styles.categoryIcon,
                          {
                            backgroundColor:
                              transaction.type === 'EXPENSE'
                                ? colors.red1
                                : colors.green1,
                          },
                        ]}>
                        <Icon
                          name={transaction.category.icon}
                          size={20}
                          color={colors.text}
                        />
                      </View>
                      <View>
                        <TextComponent
                          text={`${transaction.category.name}`}
                          style={styles.categoryName}
                        />
                        <TextComponent
                          text={`${transaction.note}`}
                          style={styles.transactionNote}
                        />
                      </View>
                    </View>
                    <TextComponent
                      //text={`${transaction.type === 'EXPENSE' ? '-' : '+'}
                      text={`${Math.abs(transaction.amount).toLocaleString()}đ`}
                      style={[
                        styles.transactionAmount,
                        transaction.type === 'EXPENSE'
                          ? styles.expenseText
                          : styles.incomeText,
                      ]}
                    />
                    <TouchableOpacity
                      onPress={() => transaction.id && handleDeleteTransaction(transaction.id)}
                    >
                      <Icon name="trash-outline" size={20} color={colors.red1} />
                    </TouchableOpacity>
                  </RowComponent>
                </TouchableOpacity>
              ))}
            </View>
          ))}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },
  yearText: {
    color: colors.text,
    fontFamily: fontFamilies.regular,
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    color: colors.text,
    fontFamily: fontFamilies.semiBold,
  },
  balanceRow: { //line
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.btnBlack,
  },
  //muc chiphi/tnhap/tsodu
  balanceLabel: {
    color: colors.btnGray2,
    fontSize: 18,
    fontFamily: fontFamilies.regular,
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
  },
  expenseText: {
    color: colors.text,
  },
  incomeText: {
    color: colors.text,
  },
  transactionList: {
    flex: 1,
  },
  dateGroup: {
    marginBottom: 20,
  },
  //Thang vơi thu nhap tung ngay
  dateHeader: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.btnBlack, //line
  },
  dateText: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fontFamilies.medium,
  },
  dateExpense: {
    color: colors.btnGray1,
    fontSize: 12,
    marginRight: 10,
  },
  dateIncome: {
    color: colors.btnGray1,
    fontSize: 12,
  },
  transaction: { //line
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.btnBlack,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryName: {
    color: colors.text,
    fontSize: 16,
    fontFamily: fontFamilies.medium,
  },
  transactionNote: {
    color: colors.btnGray2,
    fontSize: 14,
    fontFamily: fontFamilies.regular,
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default HomeScreen;
