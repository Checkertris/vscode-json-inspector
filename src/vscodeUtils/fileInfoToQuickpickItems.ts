import vscode from "vscode"
import { FileInfo, FileQuickpickItem } from "~/extensionTools/types"

export function fileInfoToQuickpickItems(files: FileInfo[]): FileQuickpickItem[] {
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
