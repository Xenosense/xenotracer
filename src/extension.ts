import * as vscode from "vscode";
import { CairoParser } from "./lib/parser";
import path = require("path");
import { commandWebView } from "./frontendGateway/gateway";
import { ParsedContractCollector } from "./lib/collector";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "xeno-tracer" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "xeno-tracer.visualizeContractFlow",
    () => {
      // initialize the parser
      let parser = new CairoParser();

      // get the active editor
      let editor = vscode.window.activeTextEditor;

      // get the active document
      let document = editor?.document;

      // get its text
      let text = document?.getText();

      // get the workspace working directory string
      let cwd = vscode.workspace.workspaceFolders![0].uri.fsPath;

      // parse the text
      // do it if text is not undefined

      if (text && cwd) {
        parser.parseContractRecursively(
          text,
          document!.fileName,
          cwd,
          // TODO: FIX CWD LATER
          [path.join(cwd, "this_cairo"), path.join(cwd, "recursive_test")]
        );

        // show the result in a new panel

        const result = ParsedContractCollector.collectParsedResult(
          parser.getMainContract()!,
          parser.getOtherContract()
        );

        console.log("RESULT: " + result);

        commandWebView(context, result);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
