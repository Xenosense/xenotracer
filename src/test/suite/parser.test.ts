/**
 * All parser test goes here
 */

import * as path from 'path';

import { CairoParser } from "./../../lib/parser";
import * as fs from 'fs';
suite("Parser Test Suite", () => {
  test("test-parse-erc20-file", () => {
    // Test parser to parse a real .cairo contract
    // For now, we just test if the parser can parse a real .cairo contract without error
    let parser = new CairoParser();

    // first, we read the contract from a file on test_utils/ERC20.cairo.
    const pathFile = path.resolve(__dirname, '../../../test_utils/ERC20.cairo');
    const text = fs.readFileSync(pathFile, 'utf8');

    // It will throw error if it doesn't parse correctly!
    parser.parseAFile(text, "ERC20.cairo");

  });
});
