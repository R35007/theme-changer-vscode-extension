import * as vscode from 'vscode';
import { ADD_COLOR, CHANGE_THEME_COLOR, CLEAR_COLORS, RESET_COLORS, RESET_THEME } from './enum';
import { SidebarColorsView } from './SidebarColorsView';
import { StatusbarUi } from './StatusBarUI';
import { ThemeChanger } from './theme-changer';

export function activate(context: vscode.ExtensionContext) {
  const themeChanger = new ThemeChanger();

  const sidebarColorsView = new SidebarColorsView(context.extensionUri, themeChanger);

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(SidebarColorsView.viewType, sidebarColorsView));

  // Change to next Theme Color
  context.subscriptions.push(vscode.commands.registerCommand(CHANGE_THEME_COLOR, () => sidebarColorsView.changeThemeColor()));

  // Add Color
  context.subscriptions.push(vscode.commands.registerCommand(ADD_COLOR, () => sidebarColorsView.addColor()));

  // Clear Colors
  context.subscriptions.push(vscode.commands.registerCommand(CLEAR_COLORS, () => sidebarColorsView.clearColors()));

  // Reset Colors
  context.subscriptions.push(vscode.commands.registerCommand(RESET_COLORS, () => sidebarColorsView.resetColors()));

  // Rest to VsCode default theme. Clears all generated theme colors
  context.subscriptions.push(vscode.commands.registerCommand(RESET_THEME, () => sidebarColorsView.resetTheme()));

  // Show status bar
  context.subscriptions.push(StatusbarUi.statusBarItem);
}

// this method is called when your extension is deactivated
export function deactivate() { }
