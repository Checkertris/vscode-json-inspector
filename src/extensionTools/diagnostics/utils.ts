import ts from "typescript"

function isDefaultExportDeclaration(node: ts.Node) {
    let isExport = false
    let isDefault = false
    ts.forEachChild(node, (child) => {
        switch (child.kind) {
            case ts.SyntaxKind.ExportKeyword:
                isExport = true
            case ts.SyntaxKind.DefaultKeyword:
                isDefault = true
        }
    })
    if (isExport && isDefault) return true
    return false
}

function getDefaultExport(sourceFile: ts.SourceFile, checker: ts.TypeChecker) {
    return ts.forEachChild(sourceFile, (node) => {
        if (ts.isExportAssignment(node)) {
            //is export assignment
            if (checker.getSymbolAtLocation(node)?.escapedName === "default") {
                return node
            }
        } else if (isDefaultExportDeclaration(node)) {
            //is export declaration
            return node
        }
    })
}

function getIdentifierType(node: ts.Node, checker: ts.TypeChecker) {
    if (ts.isIdentifier(node)) {
        return checker.getTypeAtLocation(node)
    } else {
        let type: ts.Type | undefined
        node.forEachChild((child) => {
            if (ts.isIdentifier(child)) {
                type = checker.getTypeAtLocation(child)
            } else {
                type = getIdentifierType(child, checker)
            }
        })
        return type
    }
}

export interface NodeInfo {
    type: ts.Type
    checker: ts.TypeChecker
    source: ts.SourceFile
    node: ts.Node
    program: ts.Program
}

export function getDefaultExportInfo(file: string) {
    let program = ts.createProgram([file], { allowJs: true })
    let checker = program.getTypeChecker()
    let source = program.getSourceFile(file)
    if (source) {
        let node = getDefaultExport(source, checker)
        if (node) {
            let type = getIdentifierType(node, checker)
            if (type) {
                return { type, node, typeString: checker.typeToString(type) }
            } else {
                // console.log("no idenfifier found in default export at" + file)
            }
        } else {
            // console.log("no default export found in " + file)
        }
    } else {
        //   console.log("unable to find file at path " + file)
    }
}

export function isTypeAssignable(path1: string, path2: string, type1: ts.Type, type2: ts.Type) {
    let program = ts.createProgram([path1, path2], { allowJs: true })
    let checker = program.getTypeChecker()
    return true //checker.isTypeAssignableTo(type1, type2)
}
