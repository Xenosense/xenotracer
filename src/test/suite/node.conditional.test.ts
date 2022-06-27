/**
 * All node test goes here
 */

import * as assert from "assert";
import CairoContractNode from "../../lib/nodes/cairoContractNode";
import CairoConditionalNode from "../../lib/nodes/conditionalNode";

suite("conditional Node Test Suite", () => {
  /**
   * Test if a line is detected as a conditional node
   */
  test("test-conditional-node-start", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    // accept case
    const isInExampleOne = CairoConditionalNode.isTextLineThisNode(
      'if is_infinite == FALSE:',
      [cairoNode]
    );
    assert.equal(
      isInExampleOne,
      true,
      "fails to detect conditional without space in front"
    );

    
    const isInExampleTwo = CairoConditionalNode.isTextLineThisNode(
      '     if is_infinite == FALSE:',
      [cairoNode]
    );
    assert.equal(
      isInExampleTwo,
      true,
      "fails to detect conditional with space in front"
    );
    
    // reject cases
    const isNotInExampleThree = CairoConditionalNode.isTextLineThisNode(
      '# if is_infinite == FALSE:',
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
  // test("test-conditional-node-end", () => {
  //   // Initialize cairo node
  //   let cairoNode = new CairoContractNode("testing", 0, []);

  //   // Return true if the line is a conditional (starts with decorator)
  //   const conditionalNode = CairoConditionalNode.createNode(
  //     '      with_attr error("ERC20: added_value is not a valid Uint256"):',
  //     0,
  //     [cairoNode]
  //   );

  //   // Don't forget to add child to cairo node
  //   cairoNode.addChild(conditionalNode);
  //   conditionalNode.processLine("let (new_allowance: Uint256) = ", 1);
  //   conditionalNode.processLine("   }", 2);
  //   conditionalNode.processLine(
  //     "SafeUint256.add(current_allowance, added_value)",
  //     3
  //   );
  //   const isOver = conditionalNode.processLine("end", 4);

  //   // Check if name is 'conditional'
  //   assert.equal(conditionalNode.name, "with_attr0");

  //   // and check if isOver is TRUE
  //   assert.equal(isOver, true);
  // });
});
