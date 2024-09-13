import vscode from "vscode"
import * as vscodeUtils from "~/vscodeUtils"
import { CREATE_REF_FOLDER_COMMAND, DEFAULT_IGNORE, REFERENCE_FOLDER_PATH_STATE } from "~/constants"
import * as Extension from "~/extensions"

export async function setRefFolderCommand(context: vscode.ExtensionContext) {
    if (vscode.workspace.workspaceFolders) {
        let input = vscode.window.createQuickPick<Extension.FileQuickpick>()
        input.placeholder = "Select an existing path to initialise source folder..."
        vscodeUtils
            .readWorkspaceFolders({
                ignore: DEFAULT_IGNORE,
                type: "folder",
            })
            .then((folders) => (input.items = vscodeUtils.fileInfoToQuickpickItems(folders)))

        input.onDidAccept(() => {
            if (input.selectedItems.length === 1) {
                context.workspaceState.update(
                    REFERENCE_FOLDER_PATH_STATE,
                    input.selectedItems[0].path
                )
                vscode.commands.executeCommand(CREATE_REF_FOLDER_COMMAND)
            } else {
                vscode.window.showErrorMessage("create source folder action cancelled")
            }
            input.hide()
        })
        input.show()
    } else {
        vscode.window.showErrorMessage("unable to set source folder path, open a workspace first.")
    }
}
