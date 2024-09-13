import vscode from "vscode"
import * as vscodeUtils from "~/vscodeUtils"

export class ColorsViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "calicoColors.colorsView"

    private _view?: vscode.WebviewView

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [this._extensionUri],
        }

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview, this._extensionUri)

        webviewView.webview.onDidReceiveMessage((data) => {
            switch (data.type) {
                case "colorSelected": {
                    vscode.window.activeTextEditor?.insertSnippet(
                        new vscode.SnippetString(`#${data.value}`)
                    )
                    break
                }
            }
        })
    }

    public addColor() {
        if (this._view) {
            this._view.show?.(true) // `show` is not implemented in 1.49 but is for 1.50 insiders
            this._view.webview.postMessage({ type: "addColor" })
        }
    }

    public clearColors() {
        if (this._view) {
            this._view.webview.postMessage({ type: "clearColors" })
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri) {
        let index = "main"
        // The CSS file from the React build output
        const stylesUri = vscodeUtils.getUri(webview, extensionUri, [
            "webview-ui",
            "build",
            "assets",
            `${index}.css`,
        ])
        // Codicon font file from the React build output
        const codiconFontUri = vscodeUtils.getUri(webview, extensionUri, [
            "webview-ui",
            "build",
            "assets",
            "codicon.ttf",
        ])
        // The JS file from the React build output
        const scriptUri = vscodeUtils.getUri(webview, extensionUri, [
            "webview-ui",
            "build",
            "views",
            `${index}.js`,
        ])

        const nonce = vscodeUtils.getNonce()

        console.log("webview data: ", {
            stylesUri: stylesUri.toString(),
            codiconFontUri: codiconFontUri.toString(),
            scriptUri: scriptUri.toString(),
            nonce,
        })

        return `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'nonce-${nonce}'; font-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
              <link rel="stylesheet" type="text/css" href="${stylesUri}">
              <title>${index}</title>
              <style nonce="${nonce}">
                @font-face {
                  font-family: "codicon";
                  font-display: block;
                  src: url("${codiconFontUri}") format("truetype");
                }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
            </body>
          </html>
        `
    }
}

