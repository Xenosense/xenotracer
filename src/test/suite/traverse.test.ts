import * as fs from "fs";
import * as assert from "assert";
import * as vscode from 'vscode';
import { CairoFileFinder } from "../../lib/traverser";
import path = require("path");


suite("Traverse Test Suite", async () => {
  test("Test traverse local and custom path", async () => {
    // get current working directory (cwd)
    // We get the current working directory by using the vscode API
    // Dont use rootPath, use another one
    const cwd = vscode.workspace.workspaceFolders![0].uri.fsPath;
    console.log(cwd);
    // This one should have absolute or relative path.
    const currentWorkingDir = cwd;  // this one takes priority
    const additionalPaths = [cwd + "/test_utils/"]; // These paths take second priority. Early index == early priority

    const cairoFileFinder = new CairoFileFinder(currentWorkingDir, additionalPaths);

    // cairoFileTraverser will be used to traverse the file
    // cairoFileTraverser will have `getFilePath` method to get the file path based on
    // importPath. For example `from a.b.c import d` will be translated to `a/b/c.cairo`
    // It will traverse through currentWorkingDir and additionalPaths
    // Return the filepath if found, otherwise return null

    // get the file path of the import path. This one will return the filepath of the import path.

    const importPath = 'test_utils.lib';

    // I do this because of windows path. Still need to know how to handle it.
    assert.equal(cairoFileFinder.getFilePath(importPath), path.join(cwd, 'test_utils/lib.cairo'));

    // This will return null instead
    const importPath2 = 'test_utils.lib.d';
    assert.equal(cairoFileFinder.getFilePath(importPath2), null);

    // This will return the path (additionalPaths)
    const importPath3 = 'this_cairo.hello';
    assert.equal(cairoFileFinder.getFilePath(importPath3), path.join(cwd, 'test_utils/this_cairo/hello.cairo'));

    // This will return null instead.
    const importPath4 = 'this_cairo.ERC20';
    assert.equal(cairoFileFinder.getFilePath(importPath4), null);
  });
});
