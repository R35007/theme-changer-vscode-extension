# Theme Changer

Generate your favorite VSCode workbench Theme color Customizations

![Theme Changer](./images/Theme_Changer.gif)

## Features

This extensions helps to save your favorite Theme primary color and generates the `workbench.colorCustomizations` colors from the selected primary theme color.

> Note: This extension will directly update the `settings.json` file. Please make sure the file is a valid json formate and no comments in it.

## Extension Settings

This extension contributes the following settings:

- `theme-changer.settings.path`: set the `settings.json` file path. It can be either user settings or workspace settings file path.
  - `Default` is set to `'.vscode/settings.json'`
- `theme-changer.settings.theme`: give the theme name to generate the colors.
  - `Default` is set to `'Default Dark+'`
- `theme-changer.settings.colors`: add your favorite theme colors here.
  - `Default` colors are `["#FF1A66","#9C27B0","#007ACC","#388E3C","#CC7E00","#CC5200","#CC0000"]`
- `theme-changer.settings.colorCustomizations` - helps to set your color customizations lightness.
  - `Default` colorCustomizations

```json
{
  "activityBar.activeBackground": "15",
  "activityBar.activeBorder": "",
  "activityBar.background": "5",
  "activityBar.dropBorder": "",
  "activityBarBadge.background": "",
  "badge.background": "",
  "breadcrumb.activeSelectionForeground": "60",
  "breadcrumb.focusForeground": "60",
  "button.background": "",
  "button.hoverBackground": "+10",
  "editor.background": "0",
  "editor.findMatchBackground": "40",
  "editor.findMatchHighlightBackground": "25",
  "editor.inactiveSelectionBackground": "20",
  "editor.lineHighlightBackground": "15",
  "editor.selectionBackground": "20",
  "editor.selectionHighlightBackground": "20",
  "editor.selectionHighlightBorder": "",
  "editorBracketMatch.border": "",
  "editorCursor.foreground": "60",
  "editorGroup.dropBackground": "10",
  "editorGroupHeader.tabsBackground": "10",
  "editorIndentGuide.background": "10",
  "editorLineNumber.activeForeground": "70",
  "editorLink.activeForeground": "70",
  "notificationLink.foreground": "",
  "focusBorder": "30",
  "list.activeSelectionBackground": "20",
  "list.highlightForeground": "",
  "list.hoverBackground": "15",
  "list.inactiveSelectionBackground": "15",
  "menu.background": "10",
  "menu.selectionBackground": "30",
  "merge.currentContentBackground": "15",
  "merge.currentHeaderBackground": "30",
  "panelTitle.activeForeground": "60",
  "progressBar.background": "",
  "scrollbarSlider.activeBackground": "",
  "scrollbarSlider.background": "20",
  "scrollbarSlider.hoverBackground": "30",
  "searchEditor.findMatchBackground": "25",
  "selection.background": "20",
  "settings.focusedRowBackground": "5",
  "settings.focusedRowBorder": "20",
  "settings.modifiedItemIndicator": "",
  "settings.rowHoverBackground": "5",
  "sideBar.background": "5",
  "sideBar.border": "0",
  "sideBarTitle.foreground": "60",
  "statusBar.background": "",
  "statusBar.noFolderBackground": "",
  "symbolIcon.arrayForeground": "",
  "symbolIcon.constructorForeground": "70",
  "symbolIcon.functionForeground": "70",
  "symbolIcon.methodForeground": "",
  "symbolIcon.moduleForeground": "",
  "symbolIcon.variableForeground": "60",
  "tab.activeBackground": "20",
  "tab.activeBorder": "",
  "tab.activeModifiedBorder": "",
  "tab.border": "20",
  "tab.hoverBackground": "15",
  "tab.inactiveBackground": "10",
  "tab.inactiveModifiedBorder": "",
  "terminal.foreground": "60",
  "terminal.selectionBackground": "20",
  "terminalCursor.foreground": "",
  "textLink.foreground": "",
  "textLink.activeForeground": "+10",
  "titleBar.activeBackground": "15",
  "toolbar.hoverBackground": "0",
  "window.activeBorder": "-10"
}
```

You can adjust the lightness to get the darker and lighter shade of the Theme color from the settings `theme-changer.settings.colorCustomizations`

- You can adjust the lightness from `0` to `100` to get the shades.
- `'+10'` or `'-10'` - Helps to increment or decrement the lightness by `10%` from the selected Theme Color.
- Incrementing value will gives you the lighter shade and Decrementing value will gives you the darked shade of the selected color.
- `'50'` - You can also directly set the lightness without incrementing or decrementing the selected color.
- `'0'` - give you the black color and `'100'` gives you the white color.
- `''` - leaving it empty will use the actual lightness of the selected color.

**Enjoy!**
