import * as vscode from 'vscode';
import { COLORS_VIEW } from './enum';
import { Settings } from './Settings';
import { ThemeChanger } from './theme-changer';

export class SidebarColorsView implements vscode.WebviewViewProvider {
  public static readonly viewType = COLORS_VIEW;

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri, private themeChanger: ThemeChanger) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
      }
    });

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case 'colorSelected': {
          this.setColor(data.value?.toUpperCase());
          break;
        }
        case 'colors-list-update': {
          this.setColors(data.value);
          break;
        }
        case 'is-user-theme': {
          Settings.isUserTheme = data.value;
          break;
        }
        case 'reset-theme': {
          this.resetTheme();
          break;
        }
      }
    });
  }

  private setColor(color: string) {
    try {
      this.themeChanger.changeTheme(color);
      Settings.color = color;
      this?._view?.webview.postMessage({ type: 'updateColors', color, colors: Settings.colors });
      vscode.window.showInformationMessage('Theme Color Changed');
    } catch (err: any) {
      vscode.window.showErrorMessage(err.message);
    }
  }

  private setColors(colors: string[]) {
    const updatedColors = colors?.map((color: any) => color.toUpperCase());
    Settings.colors = updatedColors;
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

    if (Settings.theme) {
      Settings.colorCustomizations = {
        ...existingThemeColors,
        [`[${Settings.theme}]`]: {},
      };
    } else {
      Settings.colorCustomizations = {};
    }

    Settings.color = '';
    vscode.window.showInformationMessage('Theme color resetted');
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

    // Toolkit Uri
    const toolkitUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        ...['node_modules', '@vscode', 'webview-ui-toolkit', 'dist', 'toolkit.js']
      )
    );

    // Do the same for the stylesheet.
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, ...['media', 'main.css']));

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->

        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${
          webview.cspSource
        }; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
				<link href="${styleMainUri}" rel="stylesheet">
        <script type="module" src="${toolkitUri}" nonce="${nonce}"></script>
				<title>Cat Colors</title>
      </head>
      <body>
        <vscode-checkbox id="user-theme-checkbox" ${
          Settings.isUserTheme ? 'checked' : ''
        }>Set as User Theme</vscode-checkbox>
				<ul id="color-list" class="color-list">
				</ul>
        <vscode-button appearance="primary" class="text-center d-block color-add-btn" id="color-add-btn">Add Color</vscode-button>
        <vscode-link href="#" id="reset-link" class="reset-link">Reset to vscode default</vscode-link>
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
