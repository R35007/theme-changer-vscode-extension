import * as fs from 'fs';
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
    const settingsPath = Settings.path;
    if (!settingsPath) {
      return vscode.window.showErrorMessage(
        'Please provide the settings.json file path in `theme-changer.settings.path`'
      );
    }

    const generatedThemeColors = Object.entries(Settings.colorCustomizations).reduce(
      (res, [key, val]) => ({ ...res, [key]: eval(`this.getColor('${color}', '${val || ''}')`) }),
      {}
    );

    delete require.cache[settingsPath];
    const settings = require(settingsPath);

    const themePath = Settings.theme?.length
      ? `['workbench.colorCustomizations']['[${Settings.theme}]']`
      : `['workbench.colorCustomizations']`;
    const existingThemeColors = _.get(settings, themePath, {});

    _.set(settings, themePath, { ...existingThemeColors, ...generatedThemeColors });

    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  }
}
