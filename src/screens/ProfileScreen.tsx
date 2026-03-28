import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import TextComponent from '../components/TextComponent';
import { colors } from '../constants/colors';

const ProfileScreen = ({ navigation }: any) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      getUserName(currentUser.uid).then(setUserName);
    }
  }, []);

  const getUserName = async (userId: string) => {
    try {
      const userDoc = await firestore().collection('Users').doc(userId).get();
      if (userDoc.exists) {
        return userDoc.data()?.name || 'Chưa đặt tên';
      }
      return 'Chưa đặt tên';
    } catch (error) {
      console.error('Error getting user name:', error);
      return 'Chưa đặt tên';
    }
  };

  const updateUserName = async (userId: string) => {
    try {
      await firestore().collection('Users').doc(userId).update({ name: newName });
    } catch (error) {
      console.error('Error updating user name:', error);
      throw error;
    }
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
    setNewName(userName || '');
  };

  const handleNameSave = async () => {
    if (newName.trim() !== '') {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          await updateUserName(currentUser.uid);
          setUserName(newName.trim());
          setIsEditingName(false);
          Alert.alert('Thành Công', 'Tên của bạn đã được cập nhật');
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể cập nhật tên');
      }
    }
  };

  const handleNameCancel = () => {
    setIsEditingName(false);
    setNewName(userName || '');
  };

  const handleLogout = () => {
    Alert.alert('Đăng Xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Đăng Xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            await auth().signOut();
            navigation.reset({
              index: 0,
              routes: [{ name: 'AuthScreen' }],
            });
          } catch (error) {
            Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi đăng xuất');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TextComponent style={styles.title} text="Tài Khoản" />
      <View style={styles.nameContainer}>
        {isEditingName ? (
          <TextInput
            style={styles.nameInput}
            value={newName}
            onChangeText={setNewName}
            placeholder="Nhập tên mới"
          />
        ) : (
          <TextComponent text={`Xin Chào ${userName}`} style={styles.nameText} />
        )}
        {isEditingName ? (
          <View style={styles.editControls}>
            <TouchableOpacity onPress={handleNameSave}>
              <TextComponent text="Lưu" style={styles.editbutton1} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNameCancel}>
              <TextComponent text="Hủy" style={styles.editbutton1} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleNameEdit}>
            <TextComponent text="Chỉnh Sửa" style={styles.editButton} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.emailContainer}>
        <TextComponent
          style={styles.emailText}
          text={`Email: ${auth().currentUser?.email || ''}`}
        />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <TextComponent style={styles.logoutButtonText} text="Đăng Xuất" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.bgColor,
    marginTop: 40,
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 20,
    color: colors.text,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nameText: {
    fontSize: 18,
    color: colors.text,
  },
  nameInput: {
    fontSize: 18,
    padding: 10,
    borderWidth: 5,
    borderColor: colors.btnBlack,
    borderRadius: 5,
    width:'80%',
    marginBottom: 10,
    color: colors.text,
  },
  editControls: {
    flexDirection: 'column',
    marginTop: 5,
  },
  editButton: {
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.red1,
    borderRadius:7,
    padding:10,
    paddingHorizontal:115,
    margin:10,
  },
  editbutton1:{
    justifyContent:'space-between',
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.red1,
    borderRadius:7,
    padding:10,
    paddingHorizontal: 50,
    margin:10,
  },
  emailContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  emailText: {
    color: colors.text,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: colors.btnBlack,
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
