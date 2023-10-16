import theme from '@src/themes';
import { StyleSheet } from 'react-native';

export const notifiBlockStyles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
    backgroundColor: theme.colors.normalGrey,
    borderRadius: 8,
    flex: 1,
  },
  topContainer: { alignItems: 'center' },
  blockNumber: { color: theme.colors.success, fontSize: 34, lineHeight: 50 },
  blockTitle: { color: theme.colors.darkOneColor, fontSize: 14, fontWeight: '500' },
  button: {
    paddingRight: 24,
    paddingLeft: 24,
    paddingTop: 8,
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.lightGrey,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export const emotionBoxStyles = StyleSheet.create({
  container: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.normalGrey,
    borderRadius: 8,
  },
  emotionImage: { width: 40 },
});

export const headerStyles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    height: 44,
    borderBottomWidth: 1,
    borderColor: theme.colors.lightGrey,
    position: 'relative',
    justifyContent: 'center',
  },
  goBackButton: { position: 'absolute', left: 16 },
  title: { fontSize: 16, color: theme.colors.darkOneColor, fontWeight: '500' },
});

export const wellcomeText = StyleSheet.create({
  welcomeText: { color: theme.colors.darkTwoColor, fontSize: 24, lineHeight: 36 },
  blueText: { color: theme.colors.primaryColor },
  welcomeTitle: {
    fontSize: 34,
    fontWeight: '400',
    lineHeight: 50,
    color: theme.colors.darkOneColor,
  },
});
