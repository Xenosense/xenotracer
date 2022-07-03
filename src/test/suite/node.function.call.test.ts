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
      false,
      "fails to detect function-call with space before 0"
    );

    const isInExampleTwo = CairoFunctionCallNode.isTextLineThisNode(
      'ERC20._mint(recipient, initial_supply),',
      [cairoNode]
    );
    assert.equal(
      isInExampleTwo,
      false,
      "fails to detect function-call with space before 1"
    );

    const isInExampleThree = CairoFunctionCallNode.isTextLineThisNode(
      'let (name) = ERC20.name()',
      [cairoNode]
    );
    assert.equal(
      isInExampleThree,
      false,
      "fails to detect function-call with space before 2"
    );

    const isInExampleFour = CairoFunctionCallNode.isTextLineThisNode(
      'let (totalSupply: Uint256) = ERC20.total_supply()',
      [cairoNode]
    );
    assert.equal(
      isInExampleFour,
      false,
      "fails to detect function-call with space before 3"
    );

    {
      const isInExampleFour = CairoFunctionCallNode.isTextLineThisNode(
        '_mint(recipient, initial_supply)',
        [cairoNode]
      );
      assert.equal(
        isInExampleFour,
        false,
        "fails to detect function-call _mint without namespace with no params"
      );
    }

    {
      const isInExampleFour = CairoFunctionCallNode.isTextLineThisNode(
        'let (totalSupply: Uint256) = total_supply()',
        [cairoNode]
      );
      assert.equal(
        isInExampleFour,
        false,
        "fails to detect function-call _total_supply without namespace with no params"
      );
    }

    {
      const isInExampleFour = CairoFunctionCallNode.isTextLineThisNode(
        'let (totalSupply: Uint256) = total_supply(asd, asdf)',
        [cairoNode]
      );
      assert.equal(
        isInExampleFour,
        false,
        "fails to detect function-call without namespace with params"
      );
    }

    {
      const isInExampleFour = CairoFunctionCallNode.isTextLineThisNode(
        ' asd,',
        [cairoNode]
      );
      assert.equal(
        isInExampleFour,
        true,
        "fails to detect function-call without namespace in the middle of function"
      );
    }

    {
      const isNotInExampleFour = CairoFunctionCallNode.isTextLineThisNode(
        'initial_supply)',
        [cairoNode]
      );
      assert.equal(
        isInExampleFour,
        false,
        "fails to detect function-call without namespace in the end of function"
      );
    }

    // reject case
    const isInExampleFive = CairoFunctionCallNode.isTextLineThisNode(
      '%lang starknet',
      [cairoNode]
    );
    assert.equal(
      isInExampleFive,
      false,
      "fails to detect function-call with space before 4"
    );

    const isInExampleSix = CairoFunctionCallNode.isTextLineThisNode(
      'from starkware.cairo.common.cairo_builtins import HashBuiltin',
      [cairoNode]
    );
    assert.equal(
      isInExampleSix,
      false,
      "fails to detect function-call with space before 5"
    );

    const isInExampleSeven = CairoFunctionCallNode.isTextLineThisNode(
      'return (remaining)',
      [cairoNode]
    );
    assert.equal(
      isInExampleSeven,
      false,
      "fails to detect function-call with space before 6"
    );

    const isInExampleEight = CairoFunctionCallNode.isTextLineThisNode(
      '}(spender: felt, amount: Uint256) -> (success: felt):',
      [cairoNode]
    );
    assert.equal(
      isInExampleEight,
      false,
      "fails to detect function-call with space before 7"
    );
   
  });

  /**
   * Test if a node process well and has ended the node
   */
  test("test-function-call-node-end", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    // Return true if the line is a function-call (starts with decorator)
    {
      const functionCallNode = CairoFunctionCallNode.createNode(
        '      ERC20.initializer(name, symbol, decimals):',
        0,
        [cairoNode]
      );

      assert.equal('ERC20-initializer-0', functionCallNode.name)
      const isOver = functionCallNode.processLine("    ERC20.initializer(name, symbol, decimals) ", 0)
      assert.equal(true, isOver, "fails to process end scope")
    }

    {
      const functionCallNode = CairoFunctionCallNode.createNode(
        '          _wtf(recipient,',
        1,
        [cairoNode]
      );
      assert.equal('null-_wtf-1', functionCallNode.name)

      const isNotOver = functionCallNode.processLine('    asd,', 1)
      assert.equal(false, isNotOver, "fails to process end scope")

      const isOver = functionCallNode.processLine('    initial_supply)', 2)
      assert.equal(true, isOver, "fails to process end scope")

    }

    {
      const functionCallNode = CairoFunctionCallNode.createNode(
        '          ERC20._wtf(recipient, ',
        1,
        [cairoNode]
      );
      assert.equal('ERC20-_wtf-1', functionCallNode.name)

      const isNotOver = functionCallNode.processLine('    asd,', 1)
      assert.equal(false, isNotOver, "fails to process end scope")

      const isOver = functionCallNode.processLine('    initial_supply)', 2)
      assert.equal(true, isOver, "fails to process end scope")

    }


  });
});
