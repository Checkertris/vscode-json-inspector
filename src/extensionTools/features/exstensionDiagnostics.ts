import vscode from "vscode"
import { ExtensionFeature } from "./extensionFeature"
import { Disposer } from "~/disposer"
import { DiagnosticConfigs } from "../diagnostics"

const ID = "diagnostic-collections"

export class ExstensionDiagnostics extends ExtensionFeature {
    static register(
        context: vscode.ExtensionContext,
        diagnosticCollections: Record<string, DiagnosticConfigs>
    ) {
        return this.tryRegister(ID, () => {
            let disposer = new Disposer()
            Object.entries(diagnosticCollections).map(([name, diagnosticConfig]) => {
                let collection = vscode.languages.createDiagnosticCollection(name)
                disposer.push(collection)
                disposer.push(diagnosticConfig.bindConfigurations(collection))
            })
            return disposer
        })
    }
}
