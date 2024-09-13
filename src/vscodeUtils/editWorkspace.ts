import vscode from "vscode"

export interface WsEditAction {
    type: "file" | "folder" | "rootFolder"
    path: string
    ignoreIfExists?: boolean
}

export interface WsEditOptions {
    errorMessage?: string
    ignoreIfExists?: boolean
}

export async function editWorkspace(edits: WsEditAction[], options?: WsEditOptions) {
    if (vscode.workspace.workspaceFolders) {
        const wsEdit = new vscode.WorkspaceEdit()
        edits.forEach(async (edit) => {
            let uri = vscode.Uri.file(edit.path)
            let relativePath = vscode.workspace.asRelativePath(uri, true)
            let stat = await vscode.workspace.fs.stat(uri)
            let ignoreIfExists = options?.ignoreIfExists
            if (typeof edit.ignoreIfExists !== undefined)
                //edit option overrides overall option
                ignoreIfExists = edit.ignoreIfExists

            if (ignoreIfExists && stat.type !== 0) {
                //file already exists
                vscode.window.showInformationMessage(
                    edit.type + " already exists at " + relativePath
                )
            } else {
                //create file or folder
                switch (edit.type) {
                    case "file":
                        wsEdit.createFile(uri, {
                            ignoreIfExists: ignoreIfExists,
                        })
                    case "folder":
                        vscode.workspace.fs.createDirectory(uri)
                }
                vscode.window.showInformationMessage(edit.type + " created at " + relativePath)
            }
        })
        //remember to apply edit
        vscode.workspace.applyEdit(wsEdit)
    } else {
        //no workspace detected
        if (options && options.errorMessage) {
            vscode.window.showErrorMessage("no workspace detected, " + options.errorMessage)
        } else {
            vscode.window.showErrorMessage("no workspace detected, unable to create files")
        }
    }
}
