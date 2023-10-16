import theme from '@src/themes';
import { StyleSheet } from 'react-native';

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

export const rateSliderStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: theme.colors.normalGrey,
    gap: 24,
  },
  title: {
    textAlign: 'center',
    color: theme.colors.darkTwoColor,
    fontSize: 14,
    fontWeight: '400',
  },
  track: { height: 10, backgroundColor: 'white', borderRadius: 4 },
  thumbStyle: { backgroundColor: 'transparent', width: 46, height: 46 },
  thumbContainer: {
    width: 46,
    height: 46,
    borderWidth: 5,
    borderColor: theme.colors.primaryColor,
    borderRadius: 100,
  },
  thumbContent: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  thumbText: { fontSize: 14, fontWeight: '400', color: theme.colors.primaryColor },
});

export const filterModalStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: theme.colors.modalBackdropColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 8,
    backgroundColor: 'white',
    gap: 16,
    width: '90%',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: theme.colors.darkTwoColor,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  closeButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.lightGrey,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    backgroundColor: theme.colors.primaryColor,
    borderRadius: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.primaryColor,
  },
  whiteColor: {
    color: 'white',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'space-between',
  },
  datePickerButton: {
    paddingHorizontal: 6,
    paddingVertical: 10,
    backgroundColor: theme.colors.lightGrey,
    borderRadius: 10,
  },

  datePickerButtonContainer: { flexDirection: 'row', alignContent: 'center', gap: 6 },
});

export const datePickerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 35,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 22,
  },
});

export const badMoodModalStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: theme.colors.modalBackdropColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'white',
    borderRadius: 8,
    textAlign: 'center',
    gap: 16,
  },
  text: {
    color: theme.colors.darkTwoColor,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  blueText: {
    color: theme.colors.primaryTwoColor,
  },
});

export const recentScoreStyles = StyleSheet.create({
  container: {
    gap: 8,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.darkTwoColor,
  },
  emotionContainer: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.normalGrey,
    borderRadius: 8,
  },
});

export const moodItemStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  image: {
    width: 32,
    height: 32,
  },
  text: {
    color: theme.colors.darkTwoColor,
  },
});

export const statusChartStyles = StyleSheet.create({
  image: { width: 16, height: 16 },
});
