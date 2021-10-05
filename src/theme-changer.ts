import * as vscode from 'vscode';
import { Settings } from './Settings';
import { StatusbarUi } from './StatusBarUI';
import _ = require('lodash');

const Color = require('color');

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
    const generatedThemeColors = Object.entries(Settings.colorRangeCustomization).reduce(
      (res, [key, val]) => ({ ...res, [key]: eval(`this.getColor('${color}', '${val || ''}')`) }),
      {}
    );

    const existingThemeColors = Settings.colorCustomizations;
    let updatedThemeColors = existingThemeColors;

    if (Settings.theme) {
      updatedThemeColors = {
        ...existingThemeColors,
        [`[${Settings.theme}]`]: {
          ...existingThemeColors[Settings.theme],
          ...generatedThemeColors,
        },
      };
    } else {
      updatedThemeColors = {
        ...existingThemeColors,
        ...generatedThemeColors,
      };
    }
    Settings.colorCustomizations = updatedThemeColors;
  }
}
