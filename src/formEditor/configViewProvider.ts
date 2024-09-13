import vscode from "vscode"
import { AppMessage } from "~/extensionTools/types"
import { Disposer } from "~/disposer"
import {
    EDITOR_SCHEMA_FILE_TYPE,
    INITIALISE_WORKSPACE_COMMAND,
    OUTPUT_FOLDER_NAME,
    REFERENCE_FOLDER_NAME,
    REFERENCE_FOLDER_PATH_STATE,
    SCHEMA_FOLDER_NAME,
    SET_REF_FOLDER_COMMAND,
} from "~/constants"
import fs from "fs"
import { readDirectory } from "~/vscodeUtils"
import { BaseWebviewProvider } from "~/extensionTools/webview"
import { ExstensionCommands } from "~/extensionTools/features"
import { ConfigAppMessage, ConfigViewMessage, SchemaReference } from "./types"

const VIEW_INDEX = "config"

export class ConfigViewProvider extends BaseWebviewProvider<ConfigAppMessage, ConfigViewMessage> {
    constructor(context: vscode.ExtensionContext) {
        super(context, VIEW_INDEX)
    }

    onWebviewStart(webviewView: vscode.WebviewView): Disposer {
        // ExstensionCommands.addCommandListener(
        //     INITIALISE_WORKSPACE_COMMAND,
        //     this.triggerHasWorkspaceMessage.bind(this)
        // )

        // ExstensionCommands.addCommandListener(
        //     SET_REF_FOLDER_COMMAND,
        //     this.triggerPathChangeMessage.bind(this)
        // )

        // fs.watch(SCHEMA_FOLDER_NAME, (type) => {
        //     if (type === "rename") this.triggerFolderChangeMessage()
        // })

        let disposer = new Disposer()
        // disposer.push(webviewView.onDidChangeVisibility(this.triggerHasWorkspaceMessage.bind(this)))
        // disposer.push(
        //     vscode.workspace.onDidChangeWorkspaceFolders(this.triggerHasWorkspaceMessage.bind(this))
        // )
        return disposer
    }

    protected async onReceiveAppMessage(message: ConfigAppMessage | AppMessage) {
        switch (message.type) {
            case "app-ready":
                this.triggerHasWorkspaceMessage()
                this.triggerFolderChangeMessage()
                this.triggerPathChangeMessage()
                return
        }
    }

    private triggerHasWorkspaceMessage() {
        this.postAppMessage({ type: "has-workspace", data: !!vscode.workspace.name })
    }

    private triggerPathChangeMessage() {
        this.postAppMessage({
            type: "path-change",
            data: this.extensionContext.workspaceState.get(REFERENCE_FOLDER_PATH_STATE),
        })
    }

    private async triggerFolderChangeMessage() {
        let path = this.extensionContext.workspaceState.get(REFERENCE_FOLDER_PATH_STATE)
        let data = {
            refFolder: false,
            schemaFolder: false,
            outputFolder: false,
            schemas: [] as SchemaReference[],
        }

        if (path) {
            let refUri = vscode.Uri.file(path + "/" + REFERENCE_FOLDER_NAME)
            let schemaUri = vscode.Uri.file(path + "/" + SCHEMA_FOLDER_NAME)
            let outputUri = vscode.Uri.file(path + "/" + OUTPUT_FOLDER_NAME)

            data.refFolder = !!(await vscode.workspace.fs.stat(refUri)).type
            data.schemaFolder = !!(await vscode.workspace.fs.stat(schemaUri)).type
            data.outputFolder = !!(await vscode.workspace.fs.stat(outputUri)).type

            if (data.schemaFolder) {
                data.schemas = await readDirectory(schemaUri, {
                    onlyInclude: [EDITOR_SCHEMA_FILE_TYPE],
                    type: "file",
                })
            }
        }

        this.postAppMessage({
            type: "folder-change",
            data,
        })
    }
}

// private triggerOpenNewForm(path: string, name: string) {
//     this.newFormTimeout.trigger(async () => {
//         await import(path).then((imprt) => {
//             if (imprt.default) {
//                 if (isExtends<ObjectSchema<any, any, any, any>>(imprt.default)) {
//                     this.postAppMessage({
//                         type: "new-form-callback",
//                         data: imprt.default,
//                     })
//                     return
//                 }
//             }
//             return vscode.window.showInformationMessage(
//                 "unable to open " + name + " from " + path
//             )
//         })
//     })
// }
