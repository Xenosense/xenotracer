/**
 * Connector between extension with frontend implementation.
 */
import * as vscode from "vscode";
import { ReactPanel } from "./reactPanel";

export function commandWebView(context: vscode.ExtensionContext) {
  /**
   * Create command Web View
   */
  ReactPanel.createOrShow(context.extensionPath);
}
