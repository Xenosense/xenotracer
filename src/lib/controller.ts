/**
 * Main Controller as the pipeline of our code parser.
 * Also acts to pass it to user.
 */
import * as vscode from "vscode";

/**
 * Main parser controller
 */
export default class MainVisualizerController {
  /**
   * Runs extension of 'Visualize'
   */
  public runExtension() {
    // First, we take all the text from the active window in vs code
    const activeTextEditor = vscode.window.activeTextEditor;

    // if there is no active text editor, we return and send a message to the user
    // We also check if text editor is in .cairo format
    if (
      activeTextEditor !== undefined &&
      activeTextEditor.document.languageId === "cairo"
    ) {
      // get its text
      const text = activeTextEditor.document.getText();
    } else {
      // if there is no opened file, we return and send a message to the user
      // Give message to the user that the user need to open a .cairo file
      vscode.window.showInformationMessage(
        "Please open a .cairo file to visualize it"
      );
    }
  }
}
