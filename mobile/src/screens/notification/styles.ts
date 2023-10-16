import theme from '@src/themes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollView: { backgroundColor: 'white' },
  notificationContainer: {
    padding: 16,
    gap: 16,
  },
  goBackButton: { position: 'absolute', left: 16 },
  title: { fontSize: 16, color: theme.colors.darkOneColor, fontWeight: '500' },
  notifitionItem: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  notificationItemContainer: { flex: 1, gap: 4 },
  notificationText: { color: theme.colors.darkOneColor, fontSize: 14 },
  notificationTextBold: { color: theme.colors.darkOneColor, fontSize: 14, fontWeight: '500' },
  notificationTime: { fontSize: 10, color: theme.colors.darkGrey },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 1000,
    backgroundColor: theme.colors.lightGreen,
  },
  mediumPadding: { padding: 16 },
  smallGap: { gap: 8 },
  avatar: { width: 56, height: 56, borderRadius: 10000 },
});
