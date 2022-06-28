/**
 * All node test goes here
 */

import * as assert from "assert";
import CairoContractNode from "../../lib/nodes/cairoContractNode";
import CairoConditionalNode from "../../lib/nodes/conditionalNode";
import CairoWithAttrNode from "../../lib/nodes/withAttrNode";

suite("conditional Node Test Suite", () => {
  /**
   * Test if a line is detected as a conditional node
   */
  test("test-conditional-node-start", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    // accept case
    const isInExampleOne = CairoConditionalNode.isTextLineThisNode(
      "if is_infinite == FALSE:",
      [cairoNode]
    );
    assert.equal(
      isInExampleOne,
      true,
      "fails to detect conditional without space in front"
    );

    const isInExampleTwo = CairoConditionalNode.isTextLineThisNode(
      "     if is_infinite == FALSE:",
      [cairoNode]
    );
    assert.equal(
      isInExampleTwo,
      true,
      "fails to detect conditional with space in front"
    );

    // reject cases
    const isNotInExampleThree = CairoConditionalNode.isTextLineThisNode(
      "# if is_infinite == FALSE:",
      [cairoNode]
    );
    assert.equal(isNotInExampleThree, false, "fails to reject comment");

    const isNotInExampleFour = CairoConditionalNode.isTextLineThisNode(
      "    func xxx(",
      [cairoNode]
    );
    assert.equal(isNotInExampleFour, false, "fails to reject func node");

    const isNotInExampleFive = CairoConditionalNode.isTextLineThisNode(
      "    namespace cat:",
      [cairoNode]
    );
    assert.equal(isNotInExampleFive, false, "fails to reject namespace node");
  });

  /**
   * Test if a node process well and has ended the node
   */
  test("test-conditional-node-end", () => {

    // Return true if the line is a conditional (starts with if)
    const conditionalNode = CairoConditionalNode.createNode(
      "      if is_infinite == FALSE:",
      0,
      []
    );

    const withAttrNode = CairoWithAttrNode.createNode(
      '   with_attr error_message("ERC20: insufficient allowance"):',
      1,
      [conditionalNode]
    );

    // Don't forget to add child to withAttr node
    conditionalNode.addChild(withAttrNode);
    withAttrNode.processLine(
      "   let (new_allowance: Uint256) = SafeUint256.sub_le(current_allowance, amount)",
      2
    );
    const withAttrIsOver = withAttrNode.processLine("    end", 3);
    assert.equal(withAttrIsOver, true, "fails to end with_attr node");

    conditionalNode.processLine("  _approve(owner, spender, new_allowance)", 4);
    conditionalNode.processLine("  return ()", 5);

    const conditionalNodeIsOver = conditionalNode.processLine("end", 6);
    conditionalNode.processLine("return ()", 7);


    assert.equal(conditionalNode.name, "conditional0");
    assert.equal(
      conditionalNodeIsOver,
      true,
      "fails to detect end of conditional"
    );
  });
});
