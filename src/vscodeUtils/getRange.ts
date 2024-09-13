import ts from "typescript"
import vscode from "vscode"

export function getRange(sourceFile: ts.SourceFile, node: ts.Node) {
    let start = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart(sourceFile, true))
    let end = ts.getLineAndCharacterOfPosition(sourceFile, node.getEnd())

    return new vscode.Range(start.line, start.character, end.line, end.character)
}
