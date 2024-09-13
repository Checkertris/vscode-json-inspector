import vscode from "vscode"
import {
    CONFIG_VIEW,
    CREATE_REF_FOLDER_COMMAND,
    INITIALISE_WORKSPACE_COMMAND,
    SET_REF_FOLDER_COMMAND,
} from "~/constants"
import {
    createRefFolderCommand,
    initialiseWorkspaceCommand,
    setRefFolderCommand,
} from "~/jsonInspector"
import * as Extension from "~/extensions"
import { Disposer } from "./disposer"

const EXTENSION_COMMANDS = {
    [CREATE_REF_FOLDER_COMMAND]: createRefFolderCommand,
    [SET_REF_FOLDER_COMMAND]: setRefFolderCommand,
    [INITIALISE_WORKSPACE_COMMAND]: initialiseWorkspaceCommand,
}

// const WEBVIEW_PROVIDERS = {
//     [CONFIG_VIEW]: ConfigViewProvider,
// }

// const DIAGNOSTIC_COLLECTIONS = {
//     [EXSTENSION_DIAGNOSTIC_COLLECTION]: FormEditorDiagnosticConfig,
// }

class TestView extends Extension.WebviewProvider {
protected onReceiveAppMessage(message: { type: string; data?: any } | Extension.AppMessage): void {
    
}
    protected onWebviewStart(webviewView: vscode.WebviewView): Disposer {
        return new Disposer()
    }
}

export function activate(context: vscode.ExtensionContext) {
    const disposables: vscode.Disposable[] = []
    context.subscriptions.push(
        new vscode.Disposable(() => vscode.Disposable.from(...disposables).dispose())
    )

    disposables.push(
        vscode.window.registerWebviewViewProvider(
            "extension.mainView",
            new TestView(context,"main")
        )
    )

    // disposables.push(ExstensionCommands.register(context, EXTENSION_COMMANDS))

    // disposables.push(ExstensionWebviewProviders.register(context, WEBVIEW_PROVIDERS))

    // disposables.push(ExstensionDiagnostics.register(context, DIAGNOSTIC_COLLECTIONS))
}
