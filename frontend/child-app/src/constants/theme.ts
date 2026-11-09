
/**
 * ChildSafe - Global Design System
 * Supports Android, iOS and Web.
 * Language support: English + Bangla.
 */

import "@/global.css";
import { Platform } from "react-native";

// ============================================
// 1. BRAND COLORS
// ============================================

export const Brand = {
  primary: "#2563EB",
  primaryLight: "#60A5FA",
  primaryDark: "#1E40AF",

  secondary: "#F59E0B",
  secondaryLight: "#FBBF24",
  secondaryDark: "#D97706",

  gradientStart: "#3B82F6",
  gradientEnd: "#1D4ED8",
} as const;


// ============================================
// 2. THEME COLORS
// ============================================

export const Colors = {
  light: {
    // Main
    text: "#111827",
    background: "#F8FAFC",
    surface: "#FFFFFF",

    // Brand
    primary: "#2563EB",
    primaryLight: "#60A5FA",
    primaryDark: "#1E40AF",

    secondary: "#F59E0B",

    // Background Elements
    backgroundElement: "#F0F4FF",
    backgroundSelected: "#DBEAFE",

    // Text
    textSecondary: "#64748B",
    textTertiary: "#94A3B8",

    // Border
    border: "#E2E8F0",
    borderFocused: "#2563EB",

    // Status
    success: "#10B981",
    successBackground: "#D1FAE5",

    warning: "#F59E0B",
    warningBackground: "#FEF3C7",

    error: "#EF4444",
    errorBackground: "#FEE2E2",

    info: "#0EA5E9",
    infoBackground: "#E0F2FE",

    // Common
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",

    // Components
    inputBackground: "#FFFFFF",
    cardBackground: "#FFFFFF",
    buttonText: "#FFFFFF",
    disabled: "#CBD5E1",
    overlay: "rgba(15, 23, 42, 0.45)",
  },

  dark: {
    // Main
    text: "#F8FAFC",
    background: "#0F172A",
    surface: "#1E293B",

    // Brand
    primary: "#60A5FA",
    primaryLight: "#93C5FD",
    primaryDark: "#2563EB",

    secondary: "#FBBF24",

    // Background Elements
    backgroundElement: "#212D40",
    backgroundSelected: "#263B59",

    // Text
    textSecondary: "#B0B4BA",
    textTertiary: "#94A3B8",

    // Border
    border: "#334155",
    borderFocused: "#60A5FA",

    // Status
    success: "#34D399",
    successBackground: "#064E3B",

    warning: "#FBBF24",
    warningBackground: "#78350F",

    error: "#F87171",
    errorBackground: "#7F1D1D",

    info: "#38BDF8",
    infoBackground: "#164E63",

    // Common
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",

    // Components
    inputBackground: "#1E293B",
    cardBackground: "#1E293B",
    buttonText: "#FFFFFF",
    disabled: "#475569",
    overlay: "rgba(0, 0, 0, 0.65)",
  },
} as const;


// ============================================
// 3. THEME COLOR TYPES
// ============================================

export type ThemeColor =
  keyof typeof Colors.light &
  keyof typeof Colors.dark;

export type ColorScheme = keyof typeof Colors;


// ============================================
// 4. FONT CONFIGURATION
// ============================================

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",

    // Custom Bengali font (install before use)
    bangla: "NotoSansBengali",
  },

  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",

    // Custom Bengali font (install before use)
    bangla: "NotoSansBengali",
  },

  web: {
    sans: "Arial, sans-serif",
    serif: "Georgia, serif",
    rounded: "Arial Rounded MT Bold, sans-serif",
    mono: "monospace",

    bangla: "'Noto Sans Bengali', sans-serif",
  },
})!;


// ============================================
// 5. FONT WEIGHTS
// ============================================

export const FontWeights = {
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
  extraBold: "800",
} as const;


// ============================================
// 6. FONT SIZES
// ============================================

export const FontSizes = {
  tiny: 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 32,
  heading: 36,
} as const;


// ============================================
// 7. SPACING
// ============================================

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,

  // Additional spacing
  seven: 80,
  eight: 96,
} as const;


// ============================================
// 8. BORDER RADIUS
// ============================================

export const Radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 999,
} as const;


// ============================================
// 9. SHADOWS
// ============================================

export const Shadows = {
  small: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  medium: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  large: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;


// ============================================
// 10. LAYOUT CONFIGURATION
// ============================================

export const BottomTabInset = Platform.select({
  ios: 50,
  android: 80,
}) ?? 0;

export const MaxContentWidth = 800;

export const ScreenPadding = {
  horizontal: 24,
  vertical: 24,
} as const;


// ============================================
// 11. COMPONENT SIZES
// ============================================

export const ComponentSizes = {
  buttonHeight: 54,
  inputHeight: 56,
  iconSmall: 16,
  iconMedium: 24,
  iconLarge: 32,
  headerHeight: 60,
  tabBarHeight: 65,
} as const;


// ============================================
// 12. ANIMATION CONFIGURATION
// ============================================

export const Animation = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;
