/**
 * All node test goes here
 */

import * as assert from "assert";
import CairoContractNode from "../../lib/nodes/cairoContractNode";

// TODO: add test for CairoContractNode after import is completed!
suite("Node Test Suite", () => {
  test("test-got-parsed-all-cairo-node", () => {
    // Test if a line is parsed correctly

    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0 , []);

    // The name of the node is 'testing' (e.g.: testing.cairo file)
    assert.equal(cairoNode.name, "testing");
    const shouldReturnFalse = CairoContractNode.isTextLineThisNode(
      "testing",
      []
    );
    assert.equal(shouldReturnFalse, false);
  });
});
