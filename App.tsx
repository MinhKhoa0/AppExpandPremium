import 'react-native-gesture-handler';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';
import {colors} from './src/constants/colors';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/BottomTabNavigation';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import {createStackNavigator} from '@react-navigation/stack';
import AuthButtons from './src/screens/AuthButton';


const RootStack = createStackNavigator();

const AuthScreen = ({navigation}:any) => {
  return (
    <View style={styles.container}>
      <AuthButtons navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.bgColor,
  },
});
const App = () => {
  return (
    <>
      <NavigationContainer>
        <SafeAreaView style={{flex: 1}}>
          <StatusBar
            translucent
            barStyle="light-content"
            backgroundColor={colors.bgColor}
          />
          <RootStack.Navigator
            initialRouteName="AuthScreen"
            screenOptions={{headerShown: false}}>
            <RootStack.Screen name="AuthScreen" component={AuthButtons} />
            <RootStack.Screen name="LoginScreen" component={LoginScreen} />
            <RootStack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
            />
            <RootStack.Screen
              name="HomeScreen"
              component={BottomTabNavigator}
            />
          </RootStack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </>
  );
};

export default App;
