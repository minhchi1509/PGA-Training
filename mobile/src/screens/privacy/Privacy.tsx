import React from 'react';
import { View } from 'react-native';
import styles from './styles';
import AppText from '@src/components/AppText';

function Privacy() {
  return (
    <View style={styles.container}>
      <View style={styles.containerText}>
        <AppText type='subheading'>Accepting Privacy</AppText>
        <AppText type='body2'>
          Lorem ipsum dolor sit amet, consectetur tortor adipiscing elit. Eget ornare quam vel
          facilisis vel feugiat amet sagittis arcu, tortor. Sapien consequat ultrices morbi.
        </AppText>

        <AppText type='body2'>
          Lorem ipsum dolor sit amet, consectetur tortor adipiscing elit. Eget ornare quam vel
          facilisis vel feugiat amet sagittis arcu, tortor. Sapien consequat ultrices morbi.
        </AppText>

        <AppText type='body2'>
          Lorem ipsum dolor sit amet, consectetur tortor adipiscing elit. Eget ornare quam vel
          facilisis vel feugiat amet sagittis arcu, tortor. Sapien consequat ultrices morbi.
        </AppText>

        <AppText type='body2'>
          Lorem ipsum dolor sit amet, consectetur tortor adipiscing elit. Eget ornare quam vel
          facilisis vel feugiat amet sagittis arcu, tortor. Sapien consequat ultrices morbi.
        </AppText>
      </View>

      <View style={styles.containerText}>
        <AppText type='subheading'>Privacy</AppText>
        <AppText type='body2'>
          Lorem ipsum dolor sit amet, consectetur tortor adipiscing elit. Eget ornare quam vel
          facilisis vel feugiat amet sagittis arcu, tortor. Sapien consequat ultrices morbi.
        </AppText>

        <AppText type='body2'>
          Lorem ipsum dolor sit amet, consectetur tortor adipiscing elit. Eget ornare quam vel
          facilisis vel feugiat amet sagittis arcu, tortor. Sapien consequat ultrices morbi.
        </AppText>
      </View>
    </View>
  );
}

export default Privacy;
