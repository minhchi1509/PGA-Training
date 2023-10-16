import { LoaderImageImage } from '@src/assets/images';
import React, { useEffect } from 'react';
import { Animated, Easing, Image, View } from 'react-native';
import { styles } from './styles';
import AppText from '@src/components/AppText';
import theme from '@src/themes';

function LoginSucess() {
  const rotation = new Animated.Value(0);

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    rotateAnimation.start();
    return () => rotateAnimation.stop();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.loading, { transform: [{ rotate }] }]}>
        <Image source={LoaderImageImage} />
      </Animated.View>
      <View style={styles.annouceContainer}>
        <AppText type='display1'>Login Successfully</AppText>
        <AppText type='body1' color={theme.colors.darkGrey}>
          You will be directed to ANTSA system in some seconds
        </AppText>
      </View>
    </View>
  );
}

export default LoginSucess;
