import * as vscode from 'vscode';
import { ColorsViewProvider } from './extensionTools/webview/colorsViewProvider';
import { ComponentGalleryPanel } from './extensionTools/webview/ComponentGalleryPanel';

export function activate(context: vscode.ExtensionContext) {

	const provider = new ColorsViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ColorsViewProvider.viewType, provider));
	
	  const showGalleryCommand = vscode.commands.registerCommand(
          "component-gallery-react.showGallery",
          () => {
              ComponentGalleryPanel.render(context.extensionUri)
          }
      )

      // Add command to the extension context
      context.subscriptions.push(showGalleryCommand)
}
