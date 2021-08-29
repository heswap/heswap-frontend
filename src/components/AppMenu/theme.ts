import { darkColors, lightColors } from "@heswap/uikit";
import { MenuTheme } from "./types";

export const light: MenuTheme = {
  border: 'rgba(133, 133, 133, 0.1)',
  topBar: lightColors.backgroundAlt,
  leftBarBody: lightColors.backgroundAlt,
  leftBarFooter: lightColors.backgroundAlt,
};

export const dark: MenuTheme = {
  border: 'rgba(133, 133, 133, 0.1)',
  topBar: darkColors.backgroundAlt,
  leftBarBody: darkColors.backgroundAlt,
  leftBarFooter: lightColors.backgroundAlt,
};
