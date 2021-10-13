import * as vscode from 'vscode';
import { KeyValString, Theme } from './constant.enum.modal';

export class Settings {
  static get workbench() {
    return vscode.workspace.getConfiguration('workbench');
  }
  static getWorkbench(key: string) {
    return Settings.workbench.get(key);
  }
  static setWorkbench(key: string, val: any, isUser = false) {
    return Settings.workbench.update(key, val, isUser);
  }
  static get colorCustomizations() {
    return (Settings.getWorkbench('colorCustomizations') as { [key: string]: any }) || {};
  }
  static set colorCustomizations(value: { [key: string]: any }) {
    Settings.setWorkbench('colorCustomizations', value, Settings.isUserTheme);
  }

  static get themeChangerConfiguration() {
    return vscode.workspace.getConfiguration('theme-changer.settings');
  }
  static getThemeChangerSetttings(val: string) {
    return Settings.themeChangerConfiguration.get(val);
  }
  static setThemeChangerSetttings(key: string, val: any, isUser = true) {
    return Settings.themeChangerConfiguration.update(key, val, isUser);
  }
  static get isUserTheme() {
    return Settings.getThemeChangerSetttings('setAsUserTheme') as boolean;
  }
  static set isUserTheme(value: boolean) {
    Settings.setThemeChangerSetttings('setAsUserTheme', value);
  }
  static get color() {
    return Settings.getThemeChangerSetttings('color') as string;
  }
  static set color(value: string) {
    Settings.setThemeChangerSetttings('color', value);
  }
  static get colors() {
    return Settings.getThemeChangerSetttings('colors') as string[];
  }
  static set colors(value: string[]) {
    Settings.setThemeChangerSetttings('colors', value);
  }
  static get colorRangeCustomizations() {
    return Settings.getThemeChangerSetttings('colorRangeCustomizations') as KeyValString;
  }
  static set colorRangeCustomizations(value: KeyValString) {
    Settings.setThemeChangerSetttings('colorRangeCustomizations', value);
  }
  static get overrideDefaultColorRange() {
    return Settings.getThemeChangerSetttings('overrideDefaultColorRange') as boolean;
  }
  static get themeName() {
    return Settings.getThemeChangerSetttings('themeName') as string;
  }
  static set themeName(themeName: string) {
    Settings.setThemeChangerSetttings('themeName', themeName);
  }
  static get theme() {
    return Settings.getThemeChangerSetttings('theme') as Theme;
  }
  static set theme(theme: Theme) {
    Settings.setThemeChangerSetttings('theme', theme);
  }
}
