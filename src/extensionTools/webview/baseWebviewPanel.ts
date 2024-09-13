import { BaseWebview } from "./baseWebview"
import vscode from "vscode"

interface WebviewPanelConfig {
    viewType: string
    panelTitle: string
    column: vscode.ViewColumn
    options?: vscode.WebviewPanelOptions & vscode.WebviewOptions
}

export abstract class BaseWebviewPanel<
    R extends { type: string; data?: any } = { type: string; data?: any },
    D extends { type: string; data?: any } = { type: string; data?: any },
> extends BaseWebview<vscode.WebviewPanel, R, D> {
    private readonly panelOptions: vscode.WebviewPanelOptions & vscode.WebviewOptions = {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(this.extensionContext.extensionUri, "build")],
    }

    constructor(
        context: vscode.ExtensionContext,
        viewIndex: string,
        private readonly panelConfig: WebviewPanelConfig
    ) {
        super(context, viewIndex)
        if (panelConfig.options) this.panelOptions = panelConfig.options
    }

    public createOrShow() {
        if (this.viewContainer) {
            this.viewContainer.reveal(vscode.ViewColumn.One)
        } else {
            const panel = vscode.window.createWebviewPanel(
                this.panelConfig.viewType,
                this.panelConfig.panelTitle,
                this.panelConfig.column,
                this.panelOptions
            )
            this.setAndStartWebview(panel)
        }
    }
}
