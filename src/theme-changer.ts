import * as vscode from 'vscode';
import { Settings } from './Settings';
import { StatusbarUi } from './StatusBarUI';

const Color = require('color');

export class ThemeChanger {
  colorRangeCustomizations = {
    'activityBar.activeBackground': '15',
    'activityBar.activeBorder': '50',
    'activityBar.background': '5',
    'activityBar.dropBorder': '50',
    'activityBarBadge.background': '',
    'badge.background': '',
    'breadcrumb.activeSelectionForeground': '60',
    'breadcrumb.focusForeground': '60',
    'button.background': '',
    'button.hoverBackground': '+10',
    'editor.background': '0',
    'editor.findMatchBackground': '40',
    'editor.findMatchHighlightBackground': '25',
    'editor.inactiveSelectionBackground': '20',
    'editor.lineHighlightBackground': '15',
    'editor.selectionBackground': '20',
    'editor.selectionHighlightBackground': '20',
    'editor.selectionHighlightBorder': '50',
    'editorBracketMatch.border': '50',
    'editorCursor.foreground': '60',
    'editorGroup.dropBackground': '10',
    'editorGroupHeader.tabsBackground': '10',
    'editorIndentGuide.background': '10',
    'editorLineNumber.activeForeground': '70',
    'editorLink.activeForeground': '70',
    'notificationLink.foreground': '',
    focusBorder: '30',
    'list.activeSelectionBackground': '20',
    'list.highlightForeground': '',
    'list.hoverBackground': '15',
    'list.inactiveSelectionBackground': '15',
    'menu.background': '10',
    'menu.selectionBackground': '30',
    'merge.currentContentBackground': '15',
    'merge.currentHeaderBackground': '30',
    'panelTitle.activeForeground': '60',
    'progressBar.background': '',
    'scrollbarSlider.activeBackground': '',
    'scrollbarSlider.background': '20',
    'scrollbarSlider.hoverBackground': '30',
    'searchEditor.findMatchBackground': '25',
    'selection.background': '20',
    'settings.focusedRowBackground': '5',
    'settings.focusedRowBorder': '20',
    'settings.modifiedItemIndicator': '',
    'settings.rowHoverBackground': '5',
    'sideBar.background': '5',
    'sideBar.border': '0',
    'sideBarTitle.foreground': '60',
    'statusBar.background': '',
    'statusBar.noFolderBackground': '',
    'symbolIcon.arrayForeground': '',
    'symbolIcon.constructorForeground': '70',
    'symbolIcon.functionForeground': '70',
    'symbolIcon.methodForeground': '',
    'symbolIcon.moduleForeground': '',
    'symbolIcon.variableForeground': '60',
    'tab.activeBackground': '20',
    'tab.activeBorder': '50',
    'tab.activeModifiedBorder': '50',
    'tab.border': '20',
    'tab.hoverBackground': '15',
    'tab.inactiveBackground': '10',
    'tab.inactiveModifiedBorder': '',
    'terminal.foreground': '60',
    'terminal.selectionBackground': '20',
    'terminalCursor.foreground': '',
    'textLink.foreground': '50',
    'textLink.activeForeground': '65',
    'titleBar.activeBackground': '15',
    'toolbar.hoverBackground': '0',
    'window.activeBorder': '30',
  };

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
      : { ...this.colorRangeCustomizations, ...Settings.colorRangeCustomizations };

    const generatedThemeColors = Object.entries(colorRangeCustomizations).reduce(
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
