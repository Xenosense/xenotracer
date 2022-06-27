/**
 * All node test goes here
 */

import * as assert from "assert";
import CairoContractNode from "../../lib/nodes/cairoContractNode";
import CairoWithAttrNode from "../../lib/nodes/withAttrNode";

// TODO: add test for CairoContractNode after import is completed!
suite("with_attr Node Test Suite", () => {
  /**
   * Test if a line is detected as a function node
   */
  test("test-function-node-detect-new-node-scope", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    // accept case
    const isInExampleOne = CairoWithAttrNode.isTextLineThisNode(
      '      with_attr error("ERC20: added_value is not a valid Uint256"):',
      [cairoNode]
    );
    assert.equal(
      isInExampleOne,
      true,
      "fails to detect with_attr with space before"
    );

    // reject cases
    const isInExampleTwo = CairoWithAttrNode.isTextLineThisNode(
      'with_attr error("ERC20: added_value is not a valid Uint256"):',
      [cairoNode]
    );
    assert.equal(
      isInExampleTwo,
      true,
      "fails to detect withAttr without space"
    );

    const isNotInExampleThree = CairoWithAttrNode.isTextLineThisNode(
      '# with_attr error("ERC20: added_value is not a valid Uint256"):',
      [cairoNode]
    );
    assert.equal(isNotInExampleThree, false, "fails to reject comment");

    const isNotInExampleFour = CairoWithAttrNode.isTextLineThisNode(
      "    func xxx(",
      [cairoNode]
    );
    assert.equal(isNotInExampleFour, false, "fails to reject func node");

    const isNotInExampleFive = CairoWithAttrNode.isTextLineThisNode(
      "    namespace cat:",
      [cairoNode]
    );
    assert.equal(isNotInExampleFive, false, "fails to reject namespace node");
  });

  /**
   * Test if a node process well and has ended the node
   */
  test("test-function-node-end", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    // Return true if the line is a function (starts with decorator)
    const withAttrNode = CairoWithAttrNode.createNode(
      '      with_attr error("ERC20: added_value is not a valid Uint256"):',
      0,
      [cairoNode]
    );

    // Don't forget to add child to cairo node
    cairoNode.addChild(withAttrNode);
    withAttrNode.processLine("let (new_allowance: Uint256) = ", 1);
    withAttrNode.processLine("   }", 2);
    withAttrNode.processLine(
      "SafeUint256.add(current_allowance, added_value)",
      3
    );
    const isOver = withAttrNode.processLine("end", 4);

    // Check if name is 'withAttr'
    assert.equal(withAttrNode.name, "with_attr0");

    // and check if isOver is TRUE
    assert.equal(isOver, true);
  });
});
