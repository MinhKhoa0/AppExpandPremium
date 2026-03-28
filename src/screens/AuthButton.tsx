import * as React from 'react';
import {View, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native';
import TextComponent from '../components/TextComponent';
import {colors} from '../constants/colors';
import SectionComponent from '../components/SectionComponent';

const AuthButtons = ({navigation}: any) => {
  const navigateToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const navigateToRegister = () => {
    navigation.navigate('RegisterScreen');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/Android_Auth.png')}
        style={styles.backgroundImage}
        // resizeMode="cover"
      >
        <View style={styles.contentContainer}>
          <SectionComponent>
                <TouchableOpacity style={styles.buttonLogin} onPress={navigateToLogin}>
                  <TextComponent style={styles.buttonText} text="Đăng Nhập" />
                </TouchableOpacity>
          </SectionComponent>

              <TouchableOpacity style={styles.buttonSign} onPress={navigateToRegister}>
                <TextComponent style={styles.buttonText} text="Đăng Ký" />
              </TouchableOpacity>
        </View>
      </ImageBackground>
     </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.background,
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

  buttonLogin: {
    backgroundColor: colors.red1,
    paddingVertical: 15,
    paddingHorizontal: 105,
    borderRadius: 10,
    fontSize: 10,
    width: '80%',
  },

  buttonSign: {
    backgroundColor: colors.btnGray2,
    paddingVertical: 15,
    paddingHorizontal: 105,
    borderRadius: 15,
    fontSize: 10,
    width: '80%',
    marginTop: 10,
  },

  buttonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
});

export default AuthButtons;
