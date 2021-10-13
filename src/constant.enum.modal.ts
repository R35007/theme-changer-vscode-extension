export interface WebViewAPIMessage {
  type: Action,
  value?: any
}

export enum Action {
  COLOR_SELECTED = "color-selected",
  COLORS_LIST_UPDATE = "colors-list-update",
  IS_USER_THEME = "is-user-theme",
  RESET_THEME = "reset-theme",
  SET_THEME = "set-theme",
  SET_THEME_NAME = "set-theme-name"
}

export type KeyValString = { [key: string]: string }

export enum Theme {
  DYNAMITE = "Dynamite",
  DYNAMITE_HIGH_CONTRAST = "Dynamite High Contrast"
}
