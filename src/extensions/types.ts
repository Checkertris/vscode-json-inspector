import vscode from "vscode"

export interface FileInfo {
    type: "file" | "folder" | "rootFolder"
    path: string
    name: string
}

export type FileQuickpick = vscode.QuickPickItem & FileInfo

export type AppMessage = { type: "app-ready" }
