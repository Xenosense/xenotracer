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

    // reject case
    const isInExampleFive = CairoFunctionCallNode.isTextLineThisNode(
      '%lang starknet',
      [cairoNode]
    );
    assert.equal(
      isInExampleFive,
      false,
      "fails to detect function-call with space before"
    );

    const isInExampleSix = CairoFunctionCallNode.isTextLineThisNode(
      'from starkware.cairo.common.cairo_builtins import HashBuiltin',
      [cairoNode]
    );
    assert.equal(
      isInExampleSix,
      false,
      "fails to detect function-call with space before"
    );

    const isInExampleSeven = CairoFunctionCallNode.isTextLineThisNode(
      'return (remaining)',
      [cairoNode]
    );
    assert.equal(
      isInExampleSeven,
      false,
      "fails to detect function-call with space before"
    );

    const isInExampleEight = CairoFunctionCallNode.isTextLineThisNode(
      '}(spender: felt, amount: Uint256) -> (success: felt):',
      [cairoNode]
    );
    assert.equal(
      isInExampleEight,
      false,
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
      '      ERC20.initializer(name, symbol, decimals):',
      0,
      [cairoNode]
    );

    const isOver = functionCallNode.processLine("      ERC20.initializer(name, symbol, decimals):", 0);
    // Check if name is '{namespace-methodName-lineNumber}'
    assert.equal(functionCallNode.name, "erc20-initializer-0", "fails to set name");

    // and check if isOver is TRUE
    assert.equal(isOver, true);

    const functionCallNode2 = CairoFunctionCallNode.createNode(
      '      ERC20._mint(recipient, initial_supply)',
      0,
      [cairoNode]
    );

    // Check if name is '{namespace-methodName-lineNumber}'
    const isOver2 = functionCallNode2.processLine("      ERC20._mint(recipient, initial_supply)", 0);
    assert.equal(functionCallNode2.name, "erc20-_mint-0", "fails to set name");

    assert.equal(isOver2, true)
    



  });
});
