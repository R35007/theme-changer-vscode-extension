import * as vscode from 'vscode';
import { Settings } from './Settings';
import { StatusbarUi } from './StatusBarUI';
import Themes from "./Themes"
const Color = require('color')

export class ThemeChanger {
  constructor() {
    StatusbarUi.init();
  }

  getColor(color: string, lRange: string) {
    try {
      const hsl = Color(color)?.hsl()?.color || [];
      let l = hsl[2];

      if (lRange.includes('+') || lRange.includes('-')) {
        const evalustedValue = eval(hsl[2] + lRange);
        l = evalustedValue >= 0 && evalustedValue <= 100 ? evalustedValue : l;
      } else {
        l = lRange || l;
      }
      const newColor = `hsl(${hsl[0]}, ${hsl[1]}%, ${l}%)`;
      return Color(newColor).hex();
    } catch (error: any) {
      vscode.window.showErrorMessage(error.message);
    }
  }

  changeTheme(color: string) {

    const colorRangeCustomizations = Settings.overrideDefaultColorRange
      ? Settings.colorRangeCustomizations
      : { ...Themes[Settings.theme], ...Settings.colorRangeCustomizations };

    const generatedThemeColors = Object.entries(colorRangeCustomizations).reduce((res: any, [key, val]) => {
      const _color = val.startsWith('#') ? val : color;
      const _value = val.startsWith('#') ? '' : val;
      return { ...res, [key]: eval(`this.getColor('${_color}', '${_value || ''}')`) };
    }, {});

    const existingThemeColors = JSON.parse(JSON.stringify(Settings.colorCustomizations));
    let updatedThemeColors = generatedThemeColors;

    if (Settings.themeName) {
      updatedThemeColors = {
        ...existingThemeColors,
        [`[${Settings.themeName}]`]: generatedThemeColors,
      };
    } else {
      for (let key in existingThemeColors) {
        if (!key.startsWith("[")) {
          delete existingThemeColors[key];
        }
      }
      updatedThemeColors = {
        ...generatedThemeColors,
        ...existingThemeColors
      };
    }
    Settings.colorCustomizations = updatedThemeColors;
  }
}
