import {StyleProp, View, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  children: ReactNode;
  justify?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | undefined;
  style?: StyleProp<ViewStyle>;
}

const RowComponent = (props: Props) => {
  const {children, justify, style} = props;
  return (
    <View
      style={[
        globalStyles.row,
        {
          justifyContent: justify ?? 'center',
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export default RowComponent;
