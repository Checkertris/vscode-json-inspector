
import vscode from "vscode"
import { WebviewContainer } from "./webviewContainer";

export abstract class WebviewProvider<
        R extends { type: string; data?: any } = { type: string; data?: any },
        D extends { type: string; data?: any } = { type: string; data?: any },
    >
    extends WebviewContainer<vscode.WebviewView, R, D>
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
