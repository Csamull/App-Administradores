/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#191E24',
    background: '#ffffff',
    backgroundElement: '#F4F5F7',
    backgroundSelected: '#E2E6EA',
    textSecondary: '#758494',
    primary: '#0c2340',
    primaryForeground: '#ffffff',
    accent: '#0c2340',
    accentLight: '#E8EDF4',
    border: '#E2E6EA',
    destructive: '#ef4444',
  },
  dark: {
    text: '#ffffff',
    background: '#191E24',
    backgroundElement: '#222932',
    backgroundSelected: '#2F3845',
    textSecondary: '#9AABBD',
    primary: '#0c2340',
    primaryForeground: '#ffffff',
    accent: '#0c2340',
    accentLight: '#1C355E',
    border: '#2F3845',
    destructive: '#ef4444',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
