import { BaseWebview } from "./baseWebview"
import vscode from "vscode"

export abstract class BaseWebviewProvider<
        R extends { type: string; data?: any } = { type: string; data?: any },
        D extends { type: string; data?: any } = { type: string; data?: any },
    >
    extends BaseWebview<vscode.WebviewView, R, D>
    implements vscode.WebviewViewProvider
{
    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {

        vscode.window.showInformationMessage("resolving webview view called")
        webviewView.webview.options = {
            enableScripts: true,
            enableCommandUris: true,
        }
        this.setAndStartWebview(webviewView)
    }
}
