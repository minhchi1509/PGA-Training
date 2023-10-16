import { Dimensions, StyleSheet } from 'react-native';
import theme from '@src/themes';

const widthScreen = Dimensions.get('window').width;
const size = 114;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.white,
  },
  topic: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.normalGrey,
    width: size,
    height: size,
    borderRadius: 8,
    marginBottom: (widthScreen - size * 3 - 16 * 2) / 2,
  },
});

export default styles;
