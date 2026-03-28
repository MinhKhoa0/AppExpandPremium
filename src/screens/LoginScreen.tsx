import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import TextComponent from '../components/TextComponent';
import { colors } from '../constants/colors';
import { Eye, EyeOff } from 'react-native-feather';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Validate input
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      // Đăng nhập bằng Firebase Authentication
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );

      // Đăng nhập thành công
      Alert.alert('Thành công', 'Đăng nhập thành công');
      navigation.replace('HomeScreen');
    } catch (error: any) {
      // Xử lý lỗi đăng nhập
      let errorMessage = 'Đăng nhập thất bại';

      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Địa chỉ email không hợp lệ';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Không tìm thấy tài khoản';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mật khẩu không chính xác';
          break;
      }

      Alert.alert('Lỗi Đăng Nhập', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('RegisterScreen');
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/DangNhap.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.contentContainer}>
          <View style={styles.inputContainer}>
            <TextComponent text="Email" style={styles.inputLabel} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextComponent text="Mật khẩu" style={styles.inputLabel} />
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={togglePasswordVisibility}
              >
                {showPassword ? (
                  <Eye color={colors.text}  />
                ) : (
                  <EyeOff color={colors.text} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <TextComponent
              text={loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              style={styles.buttonText}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToRegister}>
            <TextComponent
              text="Chưa có tài khoản? Đăng ký ngay"
              style={styles.loginText}
            />
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
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 25,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    color: colors.text,
    fontWeight:'bold',
    marginBottom: 5,
    top: -200,
  },
  input: {
    backgroundColor: colors.btnGray1,
    padding: 10,
    borderRadius: 5,
    color: colors.bgColor,
    top: -200,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: -200,
  },
  passwordInput: {
    flex: 1,
    top: 2,
  },
  togglePasswordButton: {
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: colors.red1,
    padding: 15,
    borderRadius: 5,
    paddingHorizontal: 105,
    alignItems: 'center',
    marginTop: 10,
    top:-200,
  },
  buttonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    marginTop: 15,
    color: colors.yellowText,
    top: -200,
  },
});

export default LoginScreen;
