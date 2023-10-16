enum EColors {
  primaryColor = '#48ABE2',
  darkOneColor = '#292D32', // text2
  darkTwoColor = '#1A1A1A',
  lightOneColor = '#FFFFFF',
  lightTwoColor = '#E0E0E0',
  lightThreeColor = '#F4F4F4',
  backgroundColor = '#FFFFFF',
  modalBackdropColor = '#000000aa',
  errorColor = '#EF2828',
  orangeColor = '#FFEFDC',
  white = '#FFFFFF',
  black = '#000000',
  red = '#EF2828',
  lightGreen = '#09CE82', // online
  darkGrey = '#8A8A8A', // text 3
  lightGrey = '#E1E6EF', // offline color
  green = '#3AB56E',
  success = '#35D6AF',
  normalGrey = '#F6F7F9', // frame
  warning = '#FFAC30',
  purple = '#A25AFF',
  error = '#FF7777',
  bgBase = '#EFF2FC',
  transparent = 'transparent',
  primaryTwoColor = '#19BCFE',
  disabledColor = '#C9C9C9',
  bgSuccess = '#E6FBF3',
  bgError = '#FEEEE9',
}

enum EFonts {
  poppinsBold = 'Poppins-Bold',
  poppinsItalic = 'Poppins-Italic',
  poppinsLight = 'Poppins-Light',
  poppinsMedium = 'Poppins-Medium',
  poppinsRegular = 'Poppins-Regular',
  poppinsSemiBold = 'Poppins-SemiBold',
}

enum ESpacing {
  horizontalDefault = 16,
  verticalDefault = 25,
  blockButtonBottom = 8,
  blockButtonTop = 8,
}

type TTheme = {
  colors: typeof EColors;
  fonts: typeof EFonts;
  spacing: typeof ESpacing;
};

const theme: TTheme = {
  colors: EColors,
  fonts: EFonts,
  spacing: ESpacing,
};

export default theme;
