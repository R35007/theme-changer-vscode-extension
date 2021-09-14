import * as vscode from 'vscode';
import { CHANGE_THEME_COLOR } from './enum';

export class StatusbarUi {
  private static _statusBarItem: vscode.StatusBarItem;

  static get statusBarItem(): vscode.StatusBarItem {
    if (!StatusbarUi._statusBarItem) {
      StatusbarUi._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
      this.statusBarItem.show();
    }
    return StatusbarUi._statusBarItem;
  }

  static set statusBarItem(val: vscode.StatusBarItem) {
    StatusbarUi._statusBarItem = val;
  }

  static init() {
    StatusbarUi.statusBarItem.text = '$(symbol-color~spin)';
    StatusbarUi.statusBarItem.tooltip = 'Change Theme Color';
    StatusbarUi.statusBarItem.command = CHANGE_THEME_COLOR;
  }
}
