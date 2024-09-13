"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode_1 = require("vscode");
const ComponentGalleryPanel_1 = require("./panels/ComponentGalleryPanel");
function activate(context) {
    // Create the show gallery command
    const showGalleryCommand = vscode_1.commands.registerCommand("component-gallery-react.showGallery", () => {
        ComponentGalleryPanel_1.ComponentGalleryPanel.render(context.extensionUri);
    });
    // Add command to the extension context
    context.subscriptions.push(showGalleryCommand);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map