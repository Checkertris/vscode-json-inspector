import vscode from "vscode"
import * as vscodeUtils from "~/vscodeUtils"
import {
    OUTPUT_FOLDER_NAME,
    REFERENCE_FOLDER_NAME,
    REFERENCE_FOLDER_PATH_STATE,
    SCHEMA_FOLDER_NAME,
} from "~/constants"

export function createRefFolderCommand(context: vscode.ExtensionContext) {
    let path: string | undefined = context.workspaceState.get(REFERENCE_FOLDER_PATH_STATE)
    if (path) {
        vscodeUtils.editWorkspace(
            [
                {
                    path: "", //su.seperate([path, REFERENCE_FOLDER_NAME, OUTPUT_FOLDER_NAME], "/"),
                    type: "folder",
                },
                {
                    path: "", //su.seperate([path, REFERENCE_FOLDER_NAME, SCHEMA_FOLDER_NAME], "/"),
                    type: "folder",
                },
            ],
            {
                ignoreIfExists: true,
                errorMessage: "unable to initialise source folder.",
            }
        )
    } else {
        vscode.window.showErrorMessage(
            "no path assigned to source folder, unable to create source folder"
        )
    }
}
