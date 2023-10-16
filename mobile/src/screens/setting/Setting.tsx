import React from 'react';
import { View } from 'react-native';

import styles from './styles';
import { useAppSelector } from '@src/stores';
import MenuItem from './MenuItem';
import { TClientProfile } from '@src/interfaces/client-interfaces';

const Setting = () => {
  const profile = useAppSelector<TClientProfile | undefined>((state) => state.client.profile);
  return (
    <View style={styles.boxContainer}>
      <MenuItem profile={profile} />
    </View>
  );
};

export default Setting;
