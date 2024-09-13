import vscode from "vscode"
import * as Extension from "~/extensions"

interface ReadDirectoryOptions {
    ignore?: string[]
    onlyInclude?: string[]
    type?: "file" | "folder"
}

export async function readDirectory(
    root: vscode.Uri,
    options?: ReadDirectoryOptions
): Promise<Extension.FileInfo[]> {
    let dirs = await vscode.workspace.fs.readDirectory(root)
    let ingnoreRegex: undefined | RegExp = undefined
    let includeRegex: undefined | RegExp = undefined
    if (options?.onlyInclude) {
        includeRegex = new RegExp("") //su.seperate(options.onlyInclude, "|"))
    }
    if (options?.ignore) {
        ingnoreRegex = new RegExp("") //su.seperate(options.ignore, "|"))
    }

    dirs.filter(([file, type]) => {
        switch (options?.type) {
            case "file":
                if (type === 2) return false
            case "folder":
                if (type === 1) return false
        }
        if (includeRegex) {
            if (includeRegex.test(file)) return true
            return false
        }
        if (ingnoreRegex) {
            if (!ingnoreRegex.test(file)) return true
            return false
        }
        return false
    })

    return dirs.map(([file, type]) => ({
        path: root + "/" + file,
        type: type === 1 ? "file" : "folder",
        name: file,
    }))
}

async function readDirectoryRecursive(
    root: vscode.Uri,
    options: ReadDirectoryOptions
): Promise<Extension.FileInfo[]> {
    let dirs = await readDirectory(root, options).then((files) =>
        Promise.all(
            files.map(async (file) => await readDirectory(vscode.Uri.file(file.path), options))
        )
    )

    return [] //su.flatten(dirs)
}

export async function readWorkspaceFolders(options: ReadDirectoryOptions): Promise<Extension.FileInfo[]> {
    let folders = vscode.workspace.workspaceFolders
    if (folders) {
        let roots: Extension.FileInfo[] = folders.map((folder) => ({
            type: "rootFolder",
            path: folder.uri.toString(),
            name: folder.name,
        }))
        let files = await Promise.all(
            folders.map(async (folder) => await readDirectoryRecursive(folder.uri, options))
        )
        return [...roots] //...su.flatten(files)]
    }
    return []
}
