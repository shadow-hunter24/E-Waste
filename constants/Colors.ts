/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2E7D32';
const tintColorDark = '#4CAF50';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#757575',
    tabIconSelected: tintColorLight,
    primary: '#2E7D32',
    secondary: '#4CAF50',
    accent: '#81C784',
    surface: '#F5F5F5',
    error: '#D32F2F',
    warning: '#FF8F00',
    success: '#388E3C',
    border: '#E0E0E0',
    card: '#FFFFFF',
    placeholder: '#9E9E9E',
  },
  dark: {
    text: '#FFFFFF',
    background: '#121212',
    tint: tintColorDark,
    tabIconDefault: '#9E9E9E',
    tabIconSelected: tintColorDark,
    primary: '#4CAF50',
    secondary: '#81C784',
    accent: '#A5D6A7',
    surface: '#1E1E1E',
    error: '#EF5350',
    warning: '#FFB74D',
    success: '#66BB6A',
    border: '#424242',
    card: '#1E1E1E',
    placeholder: '#757575',
  },
};
