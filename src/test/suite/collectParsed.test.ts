import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

import { CairoParser } from "../../lib/parser";
import { ParsedContractCollector } from "../../lib/collector";

suite("Collect Parsed Result Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Collect Parsed Result Test Suite", () => {
    // We test a file and get its output that can be used for front end.
    // To do that, we will read a file, parse, and get its output.
    const cwd = vscode.workspace.workspaceFolders![0].uri.fsPath;

    // -- Case: contract contains 2 functions --
    // One of them has depth of one, and the others has two depth
    // Accept if the output is the same as the expected output (Graphviz)
    const cairoParser = new CairoParser();
    const filePath = "../../test_utils/collect_parsed_test.cairo";

    // Get the file content using filesystem typecript
    const fileContent = fs.readFileSync(filePath).toString();

    // Parse the file text. We use test_utils as its base directory.
    // After that, get the parsed result that will be thrown to frontend
    // THEN, we will compare the output with the expected output.
    cairoParser.parseContractRecursively(
      fileContent,
      "collect_parsed_test.cairo",
      cwd,
      [path.join(cwd, "test_utils")]
    );
    const result = ParsedContractCollector.collectParsedResult(cairoParser);

    // Get the expected output from the file
    const acceptedResult = fs
      .readFileSync("../../test_utils/graphviz_mock/asserted_test_1.cairo")
      .toString();

    assert.equal(result, acceptedResult);
  });
});
