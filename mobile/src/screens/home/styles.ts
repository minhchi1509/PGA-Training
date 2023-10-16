import theme from '@src/themes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollView: { backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    height: 44,
    borderBottomWidth: 1,
    borderColor: theme.colors.lightGrey,
  },
  logo: { height: 32, objectFit: 'cover' },
  container: { gap: 24, padding: 16 },
  mediumGap: { gap: 16 },
  smallGap: { gap: 8 },

  emotionContainer: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.normalGrey,
    borderRadius: 8,
  },

  primaryButtom: {
    height: 54,
    backgroundColor: theme.colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  primaryButtonText: { color: 'white', fontSize: 14, fontWeight: '500' },
  preface: {
    backgroundColor: 'rgba(58, 181, 110, 0.10)',
    borderRadius: 8,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 28,
    paddingRight: 28,
    gap: 26,
  },
  perfaceContainer: { position: 'relative', marginTop: 40 },
  prefaceText: {
    fontSize: 20,
    fontWeight: '500',
    fontStyle: 'italic',
    color: theme.colors.green,
  },
  perfaceTextBefore: {
    color: theme.colors.green,
    fontSize: 40,
    fontStyle: 'italic',
    fontWeight: '500',
    position: 'absolute',
    top: -25,
    left: -10,
  },
  perfaceTextAfter: {
    position: 'absolute',
    bottom: -25,
    right: -10,
    color: theme.colors.green,
    fontSize: 40,
    fontStyle: 'italic',
    fontWeight: '500',
  },

  perfaceAuth: { color: theme.colors.green },
  banner: {
    paddingLeft: 23,
    backgroundColor: theme.colors.orangeColor,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  bannerText: { flex: 1, color: theme.colors.green, fontSize: 20, fontWeight: '500' },
  bannerImage: { width: '60%' },

  notifiContainer: { flexDirection: 'row', gap: 16, justifyContent: 'space-between' },
});
