import vscode from "vscode"
import { ExtensionFeature } from "./extensionFeature"
import { Disposer } from "~/disposer"

const ID = "webview-providers"

export class ExstensionWebviewProviders extends ExtensionFeature {
    static register(
        context: vscode.ExtensionContext,
        webviewProviders: Record<
            string,
            new (context: vscode.ExtensionContext) => vscode.WebviewViewProvider
        >
    ) {
        return this.tryRegister(ID, () => {
            let disposer = new Disposer()
            disposer.concat(
                Object.entries(webviewProviders).map(([viewId, webviewProvider]) =>
                    vscode.window.registerWebviewViewProvider(viewId, new webviewProvider(context))
                )
            )
            return disposer
        })
    }
}
