import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../../home/HomeScreen';
import AddScreen from '../screens/AddScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../constants/colors';

interface TabBarIconProps {
  name: string;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({name, color, size}) => {
  return <Icon name={name} color={color} size={size} />;
};

const Tab = createBottomTabNavigator();

// Định nghĩa các cấu hình icon bên ngoài component
const getTabBarIcon =
  (name: string) =>
  ({color, size}: {color: string; size: number}) =>
    <TabBarIcon name={name} color={color} size={size} />;

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: colors.yellowText,
        tabBarInactiveTintColor: colors.btnGray2,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'black',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: getTabBarIcon('home-outline'),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          tabBarIcon: getTabBarIcon('add-circle-outline'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: getTabBarIcon('person-circle-outline'),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
