import vscode from "vscode"
import { SET_REF_FOLDER_COMMAND } from "~/constants"

export function initialiseWorkspaceCommand(context: vscode.ExtensionContext) {
    if (!vscode.workspace.name) {
        vscode.commands.executeCommand("workbench.action.saveWorkspaceAs").then(() => {
            vscode.commands.executeCommand(SET_REF_FOLDER_COMMAND)
        })
    } else {
        vscode.commands.executeCommand(SET_REF_FOLDER_COMMAND)
    }
}
