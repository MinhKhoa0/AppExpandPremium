import {ScrollView} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  title?: string;
  back?: boolean;
  right?: ReactNode;
  search?: boolean;
  calender?: boolean;
  children: ReactNode;
  flex?: number;
}
const Container = (props: Props) => {
  const {title, back, right, search, calender, children, flex} = props;
  return (
    <ScrollView
      style={[
        globalStyles.container,
        {
          flex: flex ?? 1,
        },
      ]}>
      {children}
    </ScrollView>
  );
};

export default Container;
