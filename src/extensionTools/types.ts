import vscode from "vscode"

export interface FileInfo {
    type: "file" | "folder" | "rootFolder"
    path: string
    name: string
}

export type FileQuickpickItem = vscode.QuickPickItem & FileInfo

export type AppMessage = { type: "app-ready" }
