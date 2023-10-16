import theme from '@src/themes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollView: { backgroundColor: 'white' },
  container: { gap: 24, padding: 16 },
  mediumGap: { gap: 16 },
  smallGap: { gap: 8 },
  welcomeText: { color: theme.colors.darkTwoColor, fontSize: 24, lineHeight: 36 },
  blueText: { color: theme.colors.primaryColor },
  welcomeTitle: {
    fontSize: 34,
    fontWeight: '400',
    lineHeight: 50,
    color: theme.colors.darkOneColor,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.darkTwoColor,
  },
  statusInput: {
    backgroundColor: theme.colors.lightThreeColor,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 14,
    textAlignVertical: 'top',
    color: theme.colors.darkTwoColor,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 12,
    color: theme.colors.success,
  },
  filterBtn: {
    backgroundColor: theme.colors.lightThreeColor,
    padding: 10,
    width: 160,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  filterBtnText: {
    color: theme.colors.darkOneColor,
    fontSize: 12,
  },
  iconContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  iconContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconText: { fontSize: 12, color: theme.colors.darkOneColor },
  smallIcon: { width: 16, height: 16 },
});
