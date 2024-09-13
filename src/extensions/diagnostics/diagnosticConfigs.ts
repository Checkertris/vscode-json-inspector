import vscode from "vscode"
import ts from "typescript"
import * as vscodeUtils from "~/vscodeUtils"
import { DefaultExportWatcher } from "./defaultExportWatcher"
import { Disposer } from "~/disposer"

export class DiagnosticConfigs {
    private collection?: vscode.DiagnosticCollection
    private disposer = new Disposer()

    bindConfigurations(collection: vscode.DiagnosticCollection): Disposer {
        this.collection = collection
        return this.disposer
    }

    addDefaultExportDiagnostic(fileType: string, exportTypeRef: string) {
        let watcher = new DefaultExportWatcher(fileType, exportTypeRef)

        this.disposer.push(
            watcher.onLackDefaultExport((uri) => {
                this.collection?.set(uri, [
                    new vscode.Diagnostic(
                        new vscode.Range(0, 0, 0, 2),
                        `file type ${fileType} requires a default export`,
                        vscode.DiagnosticSeverity.Error
                    ),
                ])
            })
        )

        this.disposer.push(
            watcher.onInvalidDefaultExport((uri, node) => {
                let file = uri.toString()
                let program = ts.createProgram([file], { allowJs: true })
                let sourceFile = program.getSourceFile(file)
                if (sourceFile) {
                    this.collection?.set(uri, [
                        new vscode.Diagnostic(
                            vscodeUtils.getRange(sourceFile, node),
                            `default export is not assignable to ${watcher.exportTypeLabel} `,
                            vscode.DiagnosticSeverity.Error
                        ),
                    ])
                }
            })
        )

        return this
    }
}
