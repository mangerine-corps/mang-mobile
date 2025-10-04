import { createTheme } from '@shopify/restyle';
import { addAlpha } from '../utils/helpers';

const palette = {
  //default colors
  // blue: '#101029',
  blue: '#111D4A',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  border: '#1C1B1B',
  placeholder: addAlpha('#1C1B1B', 0.5),
  //light theme colors
  bg_dark: '#141313',
  forground_dark: '#FFFFFF',
  label_light: '#D4D7E1',
  // dark theme colors
  bg_light: '#F9F9FB',
  foreground_light: '#1C1B1B',
  danger: '#A20606',
  success: '#30BC0D',
  pending: '#FFAE00',
  info: '#5797FF',
  label: '#999999',
  label_dark: '#8C8B90',
};

export const theme = createTheme({
  colors: {
    background: palette.bg_light,
    primary_background: palette.white,
    foreground: palette.black,
    primary: palette.blue,
    button_primary: palette.blue,
    white: palette.white,
    black: palette.black,
    transparent: palette.transparent,
    border: palette.border,
    danger: palette.danger,
    success: palette.success,
    pending: palette.pending,
    placeholder: palette.placeholder,
    label: palette.label,
    searchbg: '#F2F2F2',
    minute_black: addAlpha(palette.black, 0.1),
    faded_border: '#E8E8E9',
    faded: '#B5B9C7',
    faded_danger: '#FFF5F5',
    foreground_primary: palette.blue,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    '30': 30,
    xl: 40,
    mxl: 60,
    xxl: 80,
    pad: 20,
    mid: 12,
  },
  textVariants: {
    extrabold: {
      fontSize: 14,
      color: 'foreground',
      fontFamily: 'Outfit-ExtraBold',
    },
    bold: {
      fontSize: 14,
      color: 'foreground',
      fontFamily: 'Outfit-Bold',
    },
    semibold: {
      fontSize: 14,
      color: 'foreground',
      fontFamily: 'Outfit-SemiBold',
    },
    medium: {
      fontSize: 14,
      color: 'foreground',
      fontFamily: 'Outfit-Medium',
    },
    regular: {
      fontSize: 14,
      color: 'foreground',
      fontFamily: 'Outfit-Regular',
    },
    light: {
      fontSize: 14,
      color: 'foreground',
      fontFamily: 'Outfit-Light',
    },
    defaults: {
      fontSize: 14,
      color: 'foreground',
      fontFamily: 'Outfit-Regular',
    },
  },
  breakpoints: {},
});

export type Theme = typeof theme;

export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: '#121212',
    primary_background: palette.black,
    foreground: palette.white,
    border: '#A4A3A7',
    danger: '#FF4E4E',
    placeholder: '#E4E3E3',
    label: palette.label_dark,
    foreground_primary: palette.white,
    button_primary: '#B5C1EE',
    searchbg: '#1A1A1A',
  },
};
export default theme;
