import React from 'react';
import TextComponent from './TextComponent';
import { fontFamilies } from '../constants/fontFamilies';
import { colors } from '../constants/colors';
import {StyleProp, TextStyle} from 'react-native';

interface Props {
  text: string;
  size?: number;
  font?: string;
  color?: string;
  style?: StyleProp<TextStyle>;
}
const TitleComponent = (props: Props) => {
  const {text, size, font, color, style} = props;
  return (
    <TextComponent
      size={size ?? 8}
      font={font ?? fontFamilies.regular}
      color={color ?? colors.btnGray2}
      text={text}
      style={style}
    />
  );
};

export default TitleComponent;
