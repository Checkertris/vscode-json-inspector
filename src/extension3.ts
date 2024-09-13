// import vscode from "vscode"
// import {
//     CONFIG_VIEW,
//     CREATE_REF_FOLDER_COMMAND,
//     EXSTENSION_DIAGNOSTIC_COLLECTION,
//     INITIALISE_WORKSPACE_COMMAND,
//     SET_REF_FOLDER_COMMAND,
// } from "~/constants"
// import {
//     ConfigViewProvider,
//     createRefFolderCommand,
//     initialiseWorkspaceCommand,
//     setRefFolderCommand,
// } from "~/formEditor"

// import {
//     BaseWebviewProvider,
//     ExstensionCommands,
//     ExstensionDiagnostics,
//     ExstensionWebviewProviders,
// } from "~/extensionTools"
// import { AppMessage } from "./extensionTools/types"
// import { Disposer } from "./disposer"

// const EXTENSION_COMMANDS = {
//     [CREATE_REF_FOLDER_COMMAND]: createRefFolderCommand,
//     [SET_REF_FOLDER_COMMAND]: setRefFolderCommand,
//     [INITIALISE_WORKSPACE_COMMAND]: initialiseWorkspaceCommand,
// }

// const WEBVIEW_PROVIDERS = {
//     [CONFIG_VIEW]: ConfigViewProvider,
// }

// // const DIAGNOSTIC_COLLECTIONS = {
// //     [EXSTENSION_DIAGNOSTIC_COLLECTION]: FormEditorDiagnosticConfig,
// // }

// class TestView extends BaseWebviewProvider {
//     constructor(extensionContext: vscode.ExtensionContext, viewIndex: string) {
//         super(extensionContext, viewIndex)
// vscode.window.showInformationMessage("test view created!")
//     }
//     protected async onReceiveAppMessage(
//         message: { type: string; data?: any } | AppMessage
//     ): Promise<void> {}

//     protected onWebviewStart(webviewView: vscode.WebviewView): Disposer {
//         return new Disposer()
//     }
// }

// export function activate(context: vscode.ExtensionContext) {
//     const disposables: vscode.Disposable[] = []
//     context.subscriptions.push(
//         new vscode.Disposable(() => vscode.Disposable.from(...disposables).dispose())
//     )

//     disposables.push(
//         vscode.window.registerWebviewViewProvider(
//             "extension.mainView",
//             new TestView(context,"main")
//         )
//     )

//     // disposables.push(ExstensionCommands.register(context, EXTENSION_COMMANDS))

//     // disposables.push(ExstensionWebviewProviders.register(context, WEBVIEW_PROVIDERS))

//     // disposables.push(ExstensionDiagnostics.register(context, DIAGNOSTIC_COLLECTIONS))
// }
