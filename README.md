# Theme Changer

This extensions helps to save your favorite Theme color and generates the `workbench.colorCustomizations` colors from the selected theme color. All generated theme colors will be in the selected theme color shade.

![Theme Changer](https://user-images.githubusercontent.com/23217228/205438387-ba43acf6-4e83-42d7-8963-dd3617445b3f.gif)

## Features

- Add your favorite theme color
- Generate vscode theme colors for both user and workspace settings
- Sidebar webview view is available
- Click on the color pallet icon on the status bar to set the vscode to next favorite theme color
- Fully customizable

## Extension Settings

This extension contributes the following settings:

- `theme-changer.settings.setAsUserTheme` - Set to true to update the theme color in user settings else it sets to the workspace folder settings.
- `theme-changer.settings.theme:'Dynamite'`: Set Theme Name to generate colors.
- `theme-changer.settings.themeName:'Default Dark+'`: Provide theme name to generate the Theme Colors, Leave it empty to generate as a global theme.
- `theme-changer.settings.colors: [ "#005C99", "#6C0080", "#CC5200", "#CC7E00", "#4D4D4D" ]`: add your favorite theme colors here.
- `theme-changer.settings.colorRangeCustomizations` - Set vsCode style attributes and its color lightness from 0 to 100. give + or - to increment or decrement the current color lightness.
- `theme-changer.settings.overrideDefaultColorRange` - Set to true if you want to override the default Color Range Customizations

Example colorRangeCustomizations :

```jsonc
// Theme Color #CC5200
{
  "button.background": "", // If its empty it uses the exact Theme color -> #CC5200
  "button.hoverBackground": "+10", // Increments Theme color lghtness by 10% and becomes lighter shade -> #FF6700
  "settings.headerForeground": "-5", // Decrements Theme color lightness by 5% and becomes darker shade -> #E65C00
  "badge.background": "50", // Directly sets the lightnes to 50% of the Theme color -> #FF6700
  "editor.background": "0", // Becomes Black color => #000000
  "statusBar.foreground": "100", // Becomes White color => #ffffff
  "terminal.background": "#181818" // Overrides the Theme color and uses the given color
}
```

You can adjust the lightness to get the darker and lighter shade of the Theme color from the settings `theme-changer.settings.colorRangeCustomizations`

- You can adjust the lightness from `0` to `100` to get the shades.
- `'+10'` or `'-10'` - Helps to increment or decrement the lightness by `10%` from the selected Theme Color.
- Incrementing value will gives you the lighter shade and Decrementing value will gives you the darked shade of the selected color.
- `'50'` - You can also directly set the lightness without incrementing or decrementing the selected color.
- `'0'` - give you the black color.
- `'100'` gives you the white color.
- `''` - leaving it empty will use the actual lightness of the selected color.

**Enjoy!**
