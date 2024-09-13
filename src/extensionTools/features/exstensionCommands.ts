import vscode from "vscode"
import { ExtensionFeature } from "./extensionFeature"
import { Disposer } from "~/disposer"

const ID = "commands"

export class ExstensionCommands extends ExtensionFeature {
    private static commandListeners: Record<string, (() => void)[]>

    static register(
        context: vscode.ExtensionContext,
        exstensionCommands: Record<string, (context: vscode.ExtensionContext) => void>
    ) {
        return this.tryRegister(ID, () => {
            let disposer = new Disposer()
            disposer.concat(
                Object.entries(exstensionCommands).map(([commandId, command]) =>
                    vscode.commands.registerCommand(commandId, () => {
                        command(context)
                        this.commandListeners[commandId].forEach((callback) => callback())
                    })
                )
            )
            disposer.register(() => (this.commandListeners = {}))
            return disposer
        })
    }

    static addCommandListener(commandId: string, callback: () => void) {
        this.commandListeners[commandId].push(callback)
    }
}
