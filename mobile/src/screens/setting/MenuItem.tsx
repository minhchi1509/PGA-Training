import React from 'react';
import styles from './styles';
import {
  BellIcon,
  MessageQuestionIcon,
  PasswordIcon,
  PrivacyIcon,
  TermsIcon,
} from '@src/assets/icons';
import Button from '@src/components/Button';
import theme from '@src/themes';
import { Image, Pressable, View } from 'react-native';
import { AvatarImage } from '@src/assets/images';
import AppText from '@src/components/AppText';
import GlobalNavigation from '@src/utils/navigation-utils';
import { ERootScreenList } from '@src/navigators/navigator-constants';
import { TClientProfile } from '@src/interfaces/client-interfaces';

interface PropState {
  profile: TClientProfile | undefined;
}

function MenuItem(props: PropState) {
  const { profile } = props;
  return (
    <>
      <Pressable onPress={() => GlobalNavigation.navigate(ERootScreenList.MY_PROFILE)}>
        <View style={styles.box}>
          <Image
            source={profile?.avatar ? { uri: profile.avatar } : AvatarImage}
            style={styles.icon}
          />
          <View style={{ margin: 0, padding: 0 }}>
            <AppText type='subheading' color={theme.colors.darkOneColor}>
              {(profile?.client.firstName || '') + ' ' + (profile?.client.lastName || +'')}
            </AppText>
            <AppText type='small' color={theme.colors.darkGrey}>
              {profile?.email || ''}
            </AppText>
          </View>
        </View>
      </Pressable>

      <Button
        text='Notification'
        prefixIcon={<BellIcon />}
        customTextStyles={{ color: theme.colors.darkOneColor, fontSize: 16, fontWeight: 'normal' }}
        customStyles={styles.box}
        onPress={() => GlobalNavigation.navigate(ERootScreenList.SETTING_NOTIFICATION)}
      />

      <Button
        text='Change password'
        prefixIcon={<PasswordIcon />}
        customTextStyles={{ color: theme.colors.darkOneColor, fontSize: 16, fontWeight: 'normal' }}
        customStyles={styles.box}
        onPress={() => GlobalNavigation.navigate(ERootScreenList.CHANGE_PASSWORD)}
      />

      <Button
        text='Privacy'
        prefixIcon={<PrivacyIcon />}
        customTextStyles={{ color: theme.colors.darkOneColor, fontSize: 16, fontWeight: 'normal' }}
        customStyles={styles.box}
        onPress={() => GlobalNavigation.navigate(ERootScreenList.PRIVACY)}
      />

      <Button
        text='Terms and Conditions'
        prefixIcon={<TermsIcon />}
        customTextStyles={{ color: theme.colors.darkOneColor, fontSize: 16, fontWeight: 'normal' }}
        customStyles={styles.box}
        onPress={() => GlobalNavigation.navigate(ERootScreenList.TERMS)}
      />

      <Button
        text='Contact/Help'
        prefixIcon={<MessageQuestionIcon />}
        customTextStyles={{ color: theme.colors.darkOneColor, fontSize: 16, fontWeight: 'normal' }}
        customStyles={styles.box}
        onPress={() => GlobalNavigation.navigate(ERootScreenList.CONTACT_HELP)}
      />

      <Button
        text='Deactive account'
        customTextStyles={{ color: theme.colors.error, fontSize: 16 }}
        customStyles={styles.deActive}
        buttonColor='white'
      />

      <Button
        text='Log out'
        customTextStyles={{ color: theme.colors.darkOneColor, fontSize: 16 }}
        customStyles={styles.logout}
        buttonColor='white'
      />
    </>
  );
}

export default MenuItem;
