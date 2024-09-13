import vscode from "vscode"
import * as Extension from "~/extensions"
import * as vscodeUtils from "~/vscodeUtils"
import { Disposer } from "~/disposer"

function getUri(webview: vscode.Webview, extensionUri: vscode.Uri, pathList: string[]) {
    return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList))
}

export abstract class WebviewContainer<
    C extends vscode.WebviewPanel | vscode.WebviewView,
    R extends { type: string; data?: any } = { type: string; data?: any },
    D extends { type: string; data?: any } = { type: string; data?: any },
> {
    protected viewContainer?: C

    constructor(
        protected readonly extensionContext: vscode.ExtensionContext,
        public readonly viewIndex: string
    ) {}

    protected setAndStartWebview(viewContainer: C) {
        this.viewContainer = viewContainer
        let disposer = new Disposer()

        this.viewContainer.webview.html = this.getWebviewHtml(this.viewContainer.webview)
        disposer.push(
            this.viewContainer.webview.onDidReceiveMessage(this.onReceiveAppMessage.bind(this))
        )
        disposer.push(this.onWebviewStart(this.viewContainer))

        this.viewContainer.onDidDispose(() => disposer.dispose())
    }

    protected abstract onReceiveAppMessage(message: R | Extension.AppMessage): void

    protected abstract onWebviewStart(webviewView: C): Disposer

    protected postAppMessage(message: D) {
        if (this.viewContainer?.webview) {
            this.viewContainer.webview.postMessage(message)
        }
    }

    protected getWebviewHtml(webview: vscode.Webview) {
        const stylesUri = getUri(webview, this.extensionContext.extensionUri, [
            "webview-ui",
            "build",
            "assets",
            `${this.viewIndex}.css`,
        ])
        const codiconFontUri = getUri(webview, this.extensionContext.extensionUri, [
            "webview-ui",
            "build",
            "assets",
            "codicon.ttf",
        ])
        const scriptUri = getUri(webview, this.extensionContext.extensionUri, [
            "webview-ui",
            "build",
            "views",
            `${this.viewIndex}.js`,
        ])

      const nonce = vscodeUtils.getNonce()
      
      console.log("webview data: " + JSON.stringify({
        stylesUri,codiconFontUri, scriptUri, nonce
      }))

return `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'nonce-${nonce}'; font-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
              <link rel="stylesheet" type="text/css" href="${stylesUri}">
              <title>${this.viewIndex}</title>
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
