import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class Settings {
  static get configuration() {
    return vscode.workspace.getConfiguration('theme-changer.settings');
  }
  static getSettings(val: string) {
    return Settings.configuration.get(val);
  }
  static setSettings(key: string, val: any, isGlobal = true) {
    return Settings.configuration.update(key, val, isGlobal);
  }
  static get path() {
    const pathStr = Settings.getSettings('path') as string;
    const settingsPath = Settings.getValidPath(pathStr || './.vscode/settings.json');
    if (settingsPath) {
      const stats = fs.statSync(settingsPath);
      if (stats.isFile()) return settingsPath;
    }
  }
  static get color() {
    return (Settings.getSettings('color') as string) || '#FF6700';
  }
  static set color(value: string) {
    Settings.setSettings('color', value);
  }
  static get colors() {
    return (Settings.getSettings('colors') as string[]) || ['#FF6700', '#D52B1E', '#3DC2FF', '#9C2780', '#3F5185'];
  }
  static set colors(value: string[]) {
    Settings.setSettings('colors', value) || '#FF6700';
  }
  static get colorCustomizations() {
    return Settings.getSettings('colorCustomizations') as object;
  }
  static set colorCustomizations(value: object) {
    Settings.setSettings('colorCustomizations', value);
  }
  static get theme() {
    return Settings.getSettings('theme') as string;
  }

  static getValidPath(relativePath: string, rootPath?: string) {
    const root = rootPath || vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath || './';
    const resolvedPath = path.resolve(root, relativePath?.trim());
    if (fs.existsSync(resolvedPath)) return resolvedPath;
  }
}
