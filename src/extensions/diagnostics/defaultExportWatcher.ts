import vscode from "vscode"
import ts from "typescript"
import { getDefaultExportInfo, isTypeAssignable } from "./utils"
import * as vscodeUtils from "~/vscodeUtils"
import { DEFAULT_IGNORE } from "~/constants"
import { Disposer } from "~/disposer"

export class DefaultExportWatcher {
    public readonly exportType: ts.Type
    public readonly exportTypeLabel: string
    private disposer = new Disposer()
    private invalidDefault?: (uri: vscode.Uri, invalidNode: ts.Node) => void
    private lackDefault?: (uri: vscode.Uri) => void

    onInvalidDefaultExport(callback: (uri: vscode.Uri, invalidNode: ts.Node) => void): Disposer {
        this.invalidDefault = callback
        return this.disposer
    }
    onLackDefaultExport(callback: (uri: vscode.Uri) => void): Disposer {
        this.lackDefault = callback
        return this.disposer
    }

    constructor(
        fileType: string,
        private readonly exportTypeRef: string
    ) {
        //set export type
        let info = getDefaultExportInfo(exportTypeRef)
        if (info) {
            this.exportType = info.type
            this.exportTypeLabel = info.typeString
        } else throw ReferenceError("unable to get default export reference at " + exportTypeRef)

        //set up events
        let watcher = vscode.workspace.createFileSystemWatcher(
            `**/*${fileType}`,
            false,
            false,
            true
        )

        this.disposer.register(() => (this.disposer = new Disposer()))
        this.disposer.push(watcher.onDidChange(this.viewFile.bind(this)))
        this.disposer.push(watcher.onDidCreate(this.viewFile.bind(this)))
        this.disposer.push(
            vscode.workspace.onDidChangeWorkspaceFolders(() =>
                vscodeUtils
                    .readWorkspaceFolders({
                        onlyInclude: [fileType],
                        ignore: DEFAULT_IGNORE,
                        type: "file",
                    })
                    .then((uris) => uris.forEach((uri) => this.viewFile(vscode.Uri.file(uri.path))))
            )
        )
    }

    private viewFile(uri: vscode.Uri) {
        let info = getDefaultExportInfo(uri.toString())
        if (!info) {
            if (this.lackDefault) {
                this.lackDefault(uri)
            }
        } else if (
            isTypeAssignable(this.exportTypeRef, uri.toString(), this.exportType, info.type)
        ) {
            if (this.invalidDefault) {
                this.invalidDefault(uri, info.node)
            }
        }
    }
}
