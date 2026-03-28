import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


export type Transaction = {
  id?: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: {
    id: string;
    name: string;
    icon: string;
  };
  note: string;
  date: string;
};

export const firebaseService = {
  // Thêm người dùng vào Firestore
  async addUserToFirestore(user: { name: string; email: string; password: string; }) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        user.email,
        user.password
      );
      const userId = userCredential.user.uid;

      await firestore()
        .collection('Users') // Tên collection trong Firestore
        .doc(userId) // ID của người dùng
        .set({
          name: user.name,
          email: user.email,
          createdAt: firestore.FieldValue.serverTimestamp(), // Thời gian tạo
        });

      // Tạo một sub-collection "transactions" để lưu giao dịch của người dùng
      try {
        await this.addTransaction(userId, {
          type: 'INCOME',
          amount: 100,
          category: { id: '1', name: 'Salary', icon: '💰' },
          note: 'Initial balance',
          date: new Date().toISOString(),
        });
      } catch (transactionError) {
        console.error('Failed to add initial transaction', transactionError);
      }
      return userId;
    } catch (error) {
      console.error('User creation failed', error);
      throw error;
    }
  },
  // Thêm giao dịch mới
  async addTransaction(userId: string, transaction: Transaction) {
    if (!userId || !transaction) {
      console.error('userId or transaction is missing');
      return;
    }
    try {
      const result = await firestore()
        .collection('Users')
        .doc(userId) // Dùng userId để xác định document người dùng
        .collection('transactions') // Chọn sub-collection "transactions"
        .add({
          ...transaction,
          createdAt: firestore.FieldValue.serverTimestamp(), // Thời gian tạo
          date:  transaction.date || new Date().toISOString(), // Lưu ngày giờ dưới dạng chuỗi ISO
        });
      console.log('Transaction added with ID:', result.id);
      return result.id;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },


  // Lấy danh sách giao dịch
  async getTransactions(userId: string) {
    try {
      const snapshot = await firestore()
        .collection('Users')
        .doc(userId) // Dùng userId để truy cập document người dùng
        .collection('transactions') // Lấy dữ liệu từ sub-collection "transactions"
        .orderBy('createdAt', 'desc')
        .get();

      if (!snapshot || snapshot.empty) {
        console.warn('No transactions found.');
        return []; // Trả về mảng rỗng nếu không có giao dịch
      }

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type || 'EXPENSE',
          amount: data.amount || 0,
          category: data.category || { id: '', name: '', icon: '' },
          note: data.note || '',
          date: typeof data.date === 'string' ? data.date : data.date?.toDate(), // Chuyển Timestamp thành Date
          createdAt: data.createdAt ? data.createdAt.toDate() : null, // Chuyển Timestamp thành Date
        } as Transaction;
      });
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  },

  //Xóa giao dich
  async deleteTransaction(userId: string, transactionId: string) {
    try {
      await firestore()
        .collection('Users')
        .doc(userId) // Dùng userId để xác định người dùng
        .collection('transactions') // Lấy sub-collection giao dịch
        .doc(transactionId) // Chọn giao dịch cần xóa
        .delete();
    } catch (error) {
      throw new Error('Could not delete transaction: ' + error);
    }
  },

  // Lắng nghe thay đổi realtime
  subscribeToTransactions(userId: string, onUpdate: (transactions: Transaction[]) => void) {
    return firestore()
    .collection('Users')
    .doc(userId)
    .collection('transactions')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      if (!snapshot || snapshot.empty) {
        console.warn('No transactions found');
        onUpdate([]); // Không có dữ liệu, trả về mảng rỗng
        return;
      }

      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];

      console.log('Transactions found:', transactions);
      onUpdate(transactions);
    });
  },
};

