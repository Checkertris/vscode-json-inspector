import vscode from "vscode"
import * as Extension from "~/extensions"

export function fileInfoToQuickpickItems(files: Extension.FileInfo[]): Extension.FileQuickpick[] {
    let includeWorkspaceFolders = false
    if (vscode.workspace.workspaceFolders)
        if (vscode.workspace.workspaceFolders.length > 1) includeWorkspaceFolders = true

    return files.map((file) => {
        let label = "/" + vscode.workspace.asRelativePath(file.path, includeWorkspaceFolders)

        switch (file.type) {
            case "rootFolder":
                return { description: "- workspace root", label, ...file }
            default:
                return { label, ...file }
        }
    })
}
