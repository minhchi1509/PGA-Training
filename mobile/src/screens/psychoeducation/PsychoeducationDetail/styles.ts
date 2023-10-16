import theme from '@src/themes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
    backgroundColor: theme.colors.white,
    gap: 10,
  },
  content: {
    width: '100%',
    height: 700,
  },
});

export const tagsStyles = {
  p: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 21,
    color: theme.colors.darkOneColor,
  },
  img: {
    width: '100%',
    height: 213,
    borderRadius: 8,
    objectFit: 'cover' as const,
  },
};

export default styles;
