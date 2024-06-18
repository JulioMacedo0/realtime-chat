/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";
const bgContrastLight = "#fff";
const bgConstrantDark = "#000";
export const Colors = {
  light: {
    text: "#11181C",
    background: "#EAE8E7",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    headerBackground: bgContrastLight,
    tabBarBackground: bgContrastLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#171717",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    headerBackground: bgConstrantDark,
    tabBarBackground: bgConstrantDark,
  },
};
