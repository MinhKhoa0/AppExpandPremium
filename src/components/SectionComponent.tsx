import {View} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  children: ReactNode;
  marginB?: number;
  style?: object;
}

const SectionComponent = (props: Props) => {
  const {children, marginB} = props;
  return (
    <View
      style={[
        globalStyles.section,
        {
          marginBottom: marginB ?? 16,
        },
      ]}>
      {children}
    </View>
  );
};

export default SectionComponent;
