import * as vscode from 'vscode';

export class Settings {
  static get workbench() {
    return vscode.workspace.getConfiguration('workbench');
  }
  static getWorkbench(key: string) {
    return Settings.workbench.get(key);
  }
  static setWorkbench(key: string, val: any, isGlobal = false) {
    return Settings.workbench.update(key, val, isGlobal);
  }
  static get colorCustomizations() {
    return (Settings.getWorkbench('colorCustomizations') as { [key: string]: any }) || {};
  }
  static set colorCustomizations(value: { [key: string]: any }) {
    Settings.setWorkbench('colorCustomizations', value, Settings.isGlobalTheme);
  }

  static get themeChangerConfiguration() {
    return vscode.workspace.getConfiguration('theme-changer.settings');
  }
  static getThemeChangerSetttings(val: string) {
    return Settings.themeChangerConfiguration.get(val);
  }
  static setThemeChangerSetttings(key: string, val: any, isGlobal = true) {
    return Settings.themeChangerConfiguration.update(key, val, isGlobal);
  }
  static get isGlobalTheme() {
    return Settings.getThemeChangerSetttings('setAsGlobalTheme') as boolean;
  }
  static set isGlobalTheme(value: boolean) {
    Settings.setThemeChangerSetttings('setAsGlobalTheme', value);
  }
  static get color() {
    return (Settings.getThemeChangerSetttings('color') as string) || '#FF6700';
  }
  static set color(value: string) {
    Settings.setThemeChangerSetttings('color', value);
  }
  static get colors() {
    return (
      (Settings.getThemeChangerSetttings('colors') as string[]) || [
        '#FF6700',
        '#D52B1E',
        '#3DC2FF',
        '#9C2780',
        '#3F5185',
      ]
    );
  }
  static set colors(value: string[]) {
    Settings.setThemeChangerSetttings('colors', value) || '#FF6700';
  }
  static get colorRangeCustomization() {
    return Settings.getThemeChangerSetttings('colorRangeCustomizations') as object;
  }
  static set colorRangeCustomization(value: object) {
    Settings.setThemeChangerSetttings('colorRangeCustomizations', value);
  }
  static get theme() {
    return Settings.getThemeChangerSetttings('theme') as string;
  }
}
