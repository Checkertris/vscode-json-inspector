import vscode from "vscode"

export class Disposer extends vscode.Disposable {
    private disposables: vscode.Disposable[] = []

    constructor() {
        super(() => this.disposables.forEach((disposable) => disposable.dispose()))
    }

    register(callback: () => void) {
        this.disposables.push(new vscode.Disposable(callback))
    }

    push(disposable: vscode.Disposable) {
        this.disposables.push(disposable)
    }

    concat(disposables: vscode.Disposable[]) {
        this.disposables.concat(disposables)
    }
}
