import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import TextComponent from '../components/TextComponent';
import {colors} from '../constants/colors';
import LoginScreen from './LoginScreen';
import { firebaseService } from '../services/FirebaseService';

const RegisterScreen = ({navigation}: any) => {
  const[user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validate input
    if (!user || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Kiểm tra độ mạnh mật khẩu
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }


    setLoading(true);
    try {
      // Đăng ký tài khoản và lưu vào Firestore
      await firebaseService.addUserToFirestore({ name: user, email, password });
      // Đăng ký thành công
      Alert.alert(
        'Đăng Ký Thành Công',
        'Tài khoản đã được tạo. Vui lòng đăng nhập.',
        [
          {
            text: 'Đồng ý',
            onPress: () => navigation.replace(LoginScreen),
          },
        ],
      );
    } catch (error: any) {
      // Xử lý lỗi đăng ký
      let errorMessage = 'Đăng ký thất bại';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email đã được sử dụng';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Địa chỉ email không hợp lệ';
          break;
          default:
            errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.';
            break;
      }

      Alert.alert('Lỗi Đăng Ký', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const navigateToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/DangKy.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.contentContainer}>
          <View style={styles.inputContainer}>
            <TextComponent text="User" style={styles.inputLabel} />
            <TextInput
              style={styles.input}
              placeholder="Nhập user"
              value={user}
              onChangeText={setUser}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextComponent text="Email" style={styles.inputLabel} />
            <TextInput
              style={styles.input}
              placeholder="Nhập email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextComponent text="Mật khẩu" style={styles.inputLabel} />
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <TextComponent text="Xác nhận mật khẩu" style={styles.inputLabel} />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton/*loading ? styles.disabledButton : null]*/]}
            onPress={handleRegister}
            disabled={loading}
          >
            <TextComponent text={loading ? 'Đang đăng ký...' : 'Đăng Ký'} style={styles.buttonText} />
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToLogin}>
            <TextComponent text="Đã có tài khoản? Đăng nhập" style={styles.registerText} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch', // Đảm bảo hình nền phủ hết màn hình
    justifyContent: 'flex-end', // Đặt nội dung về phía dưới
  },
  contentContainer: {
    padding: 25,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  registerButton: {
    backgroundColor: colors.red1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 105,
    top:-70,
  },
  buttonText: {
    color: colors.bgColor,
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    marginTop: 15,
    color: colors.yellowText,
    top: -70,
  },
  input: {
    backgroundColor: colors.btnGray1,
    marginBottom: 15,
    padding: 10,
    paddingLeft:16,
    paddingHorizontal: 105,
    borderRadius: 5,
    color: colors.bgColor,
    top:-70,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 5,
    marginTop:2,
  },
  inputLabel: {
    marginBottom: 5,
    color: colors.btnGray1,
    fontWeight: 'bold',
    top: -70,
  },
  // disabledButton: {
  //   opacity: 0.5,
  // },
});

export default RegisterScreen;
