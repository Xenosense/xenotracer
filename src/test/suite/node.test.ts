/**
 * All node test goes here
 */

import * as assert from "assert";
import CairoContractNode from "./../../lib/nodes/cairoContractNode";

// TODO: add test for CairoContractNode after import is completed!
suite("Extension Test Suite", () => {

  test("test-got-parsed-all", () => {
    CairoContractNode.createNode("testing", 0, []);
  });
});
