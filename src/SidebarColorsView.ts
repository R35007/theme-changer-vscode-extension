import * as vscode from 'vscode';
import { Action, Theme, WebViewAPIMessage } from './constant.enum.modal';
import { COLORS_VIEW } from './enum';
import { NodeModulesAccessor, NodeModulesKeys } from './NodeModuleAccessor';
import { Settings } from './Settings';
import { ThemeChanger } from './theme-changer';

export class SidebarColorsView implements vscode.WebviewViewProvider {
  public static readonly viewType = COLORS_VIEW;

  themes = [
    { id: 1, label: Theme.DYNAMITE, value: Theme.DYNAMITE },
    { id: 2, label: Theme.DYNAMITE_HIGH_CONTRAST, value: Theme.DYNAMITE_HIGH_CONTRAST },
  ];

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri, private themeChanger: ThemeChanger) { }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, NodeModulesAccessor.outputPath, 'libs'), // <--- Important
        vscode.Uri.joinPath(this._extensionUri, 'media'),
      ],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
      }
    });

    webviewView.webview.onDidReceiveMessage(this.onDidReceiveMessage);
  }

  // On receive any message from webview. 
  private onDidReceiveMessage = (data: WebViewAPIMessage) => {
    switch (data.type) {
      case Action.COLOR_SELECTED: {
        this.setColor(data.value?.toUpperCase());
        break;
      }
      case Action.COLORS_LIST_UPDATE: {
        this.setColors(data.value);
        break;
      }
      case Action.IS_USER_THEME: {
        Settings.isUserTheme = data.value;
        break;
      }
      case Action.RESET_THEME: {
        this.resetTheme();
        break;
      }
      case Action.SET_THEME: {
        Settings.theme = data.value;
        break;
      }
      case Action.SET_THEME_NAME: {
        Settings.themeName = data.value;
        break;
      }
    }
  };

  private setColor(color: string) {
    try {
      this.themeChanger.changeTheme(color);
      Settings.color = color;
      this?._view?.webview.postMessage({ type: 'updateColors', colors: Settings.colors });
      vscode.window.showInformationMessage('Theme Color Changed');
    } catch (err: any) {
      vscode.window.showErrorMessage(err.message);
    }
  }

  private setColors(colors: string[]) {
    const updatedColors = colors?.map((color: any) => color.toUpperCase());
    Settings.colors = updatedColors;
  }

  public resetColors() {
    const colors = [
      "#005C99",
      "#6C0080",
      "#CC5200",
      "#CC7E00",
      "#4D4D4D"
    ];
    Settings.colors = colors;
    this?._view?.webview.postMessage({ type: 'updateColors', colors });
    vscode.window.showInformationMessage('Theme Colors are resetted');
  }

  public changeThemeColor() {
    if (!Settings.colors.length) {
      return vscode.window.showErrorMessage('Please add Theme Colors in theme-changer.settings.colors settings');
    }

    const index = Settings.colors.findIndex((color) => color === Settings.color);
    let nextIndex = 0;
    if (index >= 0) {
      nextIndex = Settings.colors.length - 1 === index ? 0 : index + 1;
    }
    this.setColor(Settings.colors[nextIndex]);
  }

  public addColor() {
    if (this._view) {
      this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
      this._view.webview.postMessage({ type: 'addColor' });
      vscode.window.showInformationMessage('Added new color');
    }
  }

  public clearColors() {
    if (this._view) {
      this._view.webview.postMessage({ type: 'clearColors' });
      vscode.window.showInformationMessage('All colors are cleared');
    }
  }

  // Reset to vscode default theme colors
  // Clears all generated theme colors
  public resetTheme() {
    const existingThemeColors = Settings.colorCustomizations;

    if (Settings.themeName) {
      Settings.colorCustomizations = {
        ...existingThemeColors,
        [`[${Settings.themeName}]`]: {},
      };
    } else {
      Settings.colorCustomizations = {};
    }

    Settings.color = '';
    vscode.window.showInformationMessage('Resetted to vscode defaults');
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

    // Toolkit Uri
    const toolkitUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        ...NodeModulesAccessor.getPathToOutputFile(NodeModulesKeys.uiToolkit)
      )
    );

    // Do the same for the stylesheet.
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, ...['media', 'main.css']));

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    const themesOptions = this.themes.map(theme =>
      `<vscode-option ${Settings.theme === theme.value ? 'Selected' : ''} value="${theme.value}">${theme.label}</vscode-option>`
    ).join('');

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->

        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource
      }; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
				<link href="${styleMainUri}" rel="stylesheet">
        <script type="module" src="${toolkitUri}" nonce="${nonce}"></script>
				<title>Cat Colors</title>
      </head>
      <body>
        <p class="d-flex align-items-center">
          <span class="mr-3">Theme</span>
          <vscode-dropdown class="flex-1" id="theme-dropdown">
            ${themesOptions}
          </vscode-dropdown>
        </p>
				<ul id="color-list" class="color-list">
				</ul>
        <vscode-button appearance="primary" class="text-center d-block color-add-btn" id="color-add-btn">Add Color</vscode-button>
        <vscode-link href="#" id="reset-link" class="reset-link">Reset to vscode default</vscode-link>
        <p>
          Provide theme name to generate the theme colors, Leave it empty to generate as a global theme.
        </p>
        <vscode-text-field id="theme-name-textbox"  class="w-100" value="${Settings.themeName}"></vscode-text-field>
        <vscode-checkbox id="user-theme-checkbox" ${Settings.isUserTheme ? 'checked' : ''}>Set as User Theme</vscode-checkbox>
				<script nonce="${nonce}" src="${scriptUri}"></script>
				<script nonce="${nonce}">
          init(${JSON.stringify(Settings.colors)})
        </script>
			</body>
			</html>`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
