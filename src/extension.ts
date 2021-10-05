import * as vscode from 'vscode';
import { SidebarColorsView } from './SidebarColorsView';
import { ADD_COLOR, CHANGE_THEME_COLOR, CLEAR_COLORS } from './enum';
import { ThemeChanger } from './theme-changer';
import { StatusbarUi } from './StatusBarUI';

export function activate(context: vscode.ExtensionContext) {
  const themeChanger = new ThemeChanger();

  const sidebarColorsView = new SidebarColorsView(context.extensionUri, themeChanger);

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(SidebarColorsView.viewType, sidebarColorsView));

  // Change Theme Color
  context.subscriptions.push(
    vscode.commands.registerCommand(CHANGE_THEME_COLOR, () => sidebarColorsView.changeThemeColor())
  );

  // Add Color
  context.subscriptions.push(vscode.commands.registerCommand(ADD_COLOR, () => sidebarColorsView.addColor()));

  // Clear Colors
  context.subscriptions.push(vscode.commands.registerCommand(CLEAR_COLORS, () => sidebarColorsView.clearColors()));

  // Show status bar
  context.subscriptions.push(StatusbarUi.statusBarItem);
}

// this method is called when your extension is deactivated
export function deactivate() {}
