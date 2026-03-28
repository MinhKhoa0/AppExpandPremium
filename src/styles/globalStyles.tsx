import {StyleSheet} from 'react-native';
import { colors } from '../constants/colors';
import { fontFamilies } from '../constants/fontFamilies';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    padding: 14,
    paddingTop: 28,
  },

  text: {
    fontSize: 14,
    color: colors.text,
    fontFamily: fontFamilies.bold,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  section: {
    marginBottom: 16,
  },
});
