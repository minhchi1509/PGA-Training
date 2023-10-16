import theme from '@src/themes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: theme.colors.white,
    padding: 16,
    rowGap: 16,
    width: '100%',
  },
  uploadContainer: {
    alignItems: 'center',
    rowGap: 10,
    width: '100%',
  },
  showPickerContainer: {
    borderWidth: 3,
    borderColor: theme.colors.darkGrey,
    borderStyle: 'dashed',
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    rowGap: 10,
  },
  imagePicker: {
    height: 75,
    borderRadius: 8,
    width: 100,
  },
  closeButton: {
    top: 0,
    position: 'absolute',
    right: 0,
  },
  docBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    borderColor: theme.colors.darkGrey,
    flexDirection: 'row',
  },
  uploadButton: {
    paddingHorizontal: 16,
    borderStyle: 'dashed',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: theme.colors.primaryColor,
  },
  imageContainer: {},
  docsContainer: {
    maxHeight: 70,
  },
});

export default styles;
