import {StyleProp, Text, TextStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from '../styles/globalStyles';
import {fontFamilies} from '../constants/fontFamilies';
import {colors} from '../constants/colors';

interface Props {
  children?: ReactNode;
  text: string;
  size?: number;
  font?: string;
  color?: string;
  style?: StyleProp<TextStyle>;
}

const TextComponent = (props: Props) => {
  const {text, size, font, color, children, style} = props;
  return (
    <Text
      style={[
        globalStyles.text,
        {
          fontSize: size ?? 14,
          fontFamily: font ?? fontFamilies.bold,
          color: color ?? colors.text,
        },
        style,
      ]}>
      {text || children}
    </Text>
  );
};

export default TextComponent;
