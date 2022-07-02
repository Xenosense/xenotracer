/**
 * All node test goes here
 */

import * as assert from "assert";
import CairoContractNode from "../../lib/nodes/cairoContractNode";
import CairoFunctionCallNode from "../../lib/nodes/functionCallNode";

suite("function-call Node Test Suite", () => {
  /**
   * Test if a line is detected as a function-call node
   */
  test("test-function-call-node-start", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    // accept case
    const isInExampleOne = CairoFunctionCallNode.isTextLineThisNode(
      'ERC20.initializer(name, symbol, decimals)',
      [cairoNode]
    );
    assert.equal(
      isInExampleOne,
      true,
      "fails to detect function-call with space before"
    );

    const isInExampleTwo = CairoFunctionCallNode.isTextLineThisNode(
      'ERC20._mint(recipient, initial_supply)',
      [cairoNode]
    );
    assert.equal(
      isInExampleTwo,
      true,
      "fails to detect function-call with space before"
    );

    const isInExampleThree = CairoFunctionCallNode.isTextLineThisNode(
      'let (name) = ERC20.name()',
      [cairoNode]
    );
    assert.equal(
      isInExampleThree,
      true,
      "fails to detect function-call with space before"
    );

    const isInExampleFour = CairoFunctionCallNode.isTextLineThisNode(
      'let (totalSupply: Uint256) = ERC20.total_supply()',
      [cairoNode]
    );
    assert.equal(
      isInExampleFour,
      true,
      "fails to detect function-call with space before"
    );
   
  });

  /**
   * Test if a node process well and has ended the node
   */
  test("test-function-call-node-end", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    // Return true if the line is a function-call (starts with decorator)
    const functionCallNode = CairoFunctionCallNode.createNode(
      '      function-call error("ERC20: added_value is not a valid Uint256"):',
      0,
      [cairoNode]
    );

    // Don't forget to add child to cairo node
    cairoNode.addChild(functionCallNode);
    functionCallNode.processLine("let (new_allowance: Uint256) = ", 1);
    functionCallNode.processLine("   }", 2);
    functionCallNode.processLine(
      "SafeUint256.add(current_allowance, added_value)",
      3
    );
    const isOver = functionCallNode.processLine("end", 4);

    // Check if name is 'function-call'
    assert.equal(functionCallNode.name, "with_attr0");

    // and check if isOver is TRUE
    assert.equal(isOver, true);
  });
});
