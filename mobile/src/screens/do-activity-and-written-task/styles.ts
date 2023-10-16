import { StyleSheet } from 'react-native';

import theme from '@src/themes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  uploadContainer: {
    marginTop: 16,
    marginBottom: 24,
    gap: 8,
  },
  uploadButton: {
    alignSelf: 'center',
    height: 48,
    width: 142,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.primaryTwoColor,
    backgroundColor: 'transparent',
  },
  previewFileConatiner: {
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.darkGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  filePreview: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: theme.colors.bgBase,
  },
  closeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  uploadBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primaryTwoColor,
  },
  actionBtnContainer: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 16,
  },
  actionBtn: {
    flex: 1,
  },
});

export default styles;
