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

    {
      const isInExample = CairoFunctionCallNode.isTextLineThisNode(
        "let (name) = ERC20.name()",
        [cairoNode]
      );
      assert.equal(
        isInExample,
        true,
        "fails to detect function-call with namespace with no params"
      );
    }

    {
      const isInExample = CairoFunctionCallNode.isTextLineThisNode(
        "ERC20._mint(recipient, initial_supply)",
        [cairoNode]
      );
      assert.equal(
        isInExample,
        true,
        "fails to detect function-call with namespace with no params"
      );
    }

    {
      const isInExample = CairoFunctionCallNode.isTextLineThisNode(
        "name()",
        [cairoNode]
      );
      assert.equal(
        isInExample,
        true,
        "fails to detect function-call without namespace with no params"
      );
    }

    {
      const isInExample = CairoFunctionCallNode.isTextLineThisNode(
        "_mint(recipient, initial_supply)",
        [cairoNode]
      );
      assert.equal(
        isInExample,
        true,
        "fails to detect function-call without namespace with no params"
      );
    }

    {
      const isInExample = CairoFunctionCallNode.isTextLineThisNode(
        "test(",
        [cairoNode]
      );
      assert.equal(
        isInExample,
        true,
        "fails to detect function-call without namespace with no params"
      );
    }

    {
      const isNotInExample = CairoFunctionCallNode.isTextLineThisNode(
        "a,",
        [cairoNode]
      );
      assert.equal(
        isNotInExample,
        false,
        "fails to detect function-call without namespace with no params"
      );
    }


    {
      const isNotInExample = CairoFunctionCallNode.isTextLineThisNode(
        "b,",
        [cairoNode]
      );
      assert.equal(
        isNotInExample,
        false,
        "fails to detect function-call without namespace with no params"
      );
    }

    {
      const isNotInExample = CairoFunctionCallNode.isTextLineThisNode(
        ")",
        [cairoNode]
      );
      assert.equal(
        isNotInExample,
        false,
        "fails to detect function-call without namespace with no params"
      );
    }


    {
      const isNotInExample = CairoFunctionCallNode.isTextLineThisNode(
        "%lang starknet",
        [cairoNode]
      );
      assert.equal(
        isNotInExample,
        false,
        "fails to detect function-call without namespace with no params"
      );

    }

    {
      const isNotInExample = CairoFunctionCallNode.isTextLineThisNode(
        "from starkware.cairo.common.cairo_builtins import HashBuiltin",
        [cairoNode]
      );
      assert.equal(
        isNotInExample,
        false,
        "fails to detect function-call without namespace with no params"
      );

    }

    {
      const isNotInExample = CairoFunctionCallNode.isTextLineThisNode(
        "return (remaining)",
        [cairoNode]
      );
      assert.equal(
        isNotInExample,
        false,
        "fails to detect function-call without namespace with no params"
      );

    }

    {
      const isNotInExample = CairoFunctionCallNode.isTextLineThisNode(
        "}(spender: felt, amount: Uint256) -> (success: felt):",
        [cairoNode]
      );
      assert.equal(
        isNotInExample,
        false,
        "fails to detect function-call without namespace with no params"
      );

    }
  });

  /**
   * Test if a node process well and has ended the node
   */
  // test("test-function-call-node-end", () => {
  //   // Initialize cairo node
  //   let cairoNode = new CairoContractNode("testing", 0, []);

  //   // Return true if the line is a function-call (starts with decorator)
  //   {
  //     const functionCallNode = CairoFunctionCallNode.createNode(
  //       "      ERC20.initializer(name, symbol, decimals):",
  //       0,
  //       [cairoNode]
  //     );

  //     const functionCallNodeCasted = functionCallNode as CairoFunctionCallNode;
  //     assert.equal("ERC20-initializer-0", functionCallNode.name);
  //     assert.equal("ERC20", functionCallNodeCasted.namespaceName);
  //     assert.equal("initializer", functionCallNodeCasted.functionCallName);

  //     const isOver = functionCallNode.processLine(
  //       "    ERC20.initializer(name, symbol, decimals) ",
  //       0
  //     );
  //     assert.equal(true, isOver, "fails to process end scope");
  //   }

  //   {
  //     const functionCallNode = CairoFunctionCallNode.createNode(
  //       "          _wtf(recipient,",
  //       1,
  //       [cairoNode]
  //     );

  //     const functionCallNodeCasted = functionCallNode as CairoFunctionCallNode;
  //     assert.equal("null-_wtf-1", functionCallNode.name);
  //     assert.equal("null", functionCallNodeCasted.namespaceName);
  //     assert.equal("_wtf", functionCallNodeCasted.functionCallName);

  //     const isNotOver = functionCallNode.processLine("    asd,", 1);
  //     assert.equal(false, isNotOver, "fails to process end scope");

  //     const isOver = functionCallNode.processLine("    initial_supply)", 2);
  //     assert.equal(true, isOver, "fails to process end scope");
  //   }

  //   {
  //     const functionCallNode = CairoFunctionCallNode.createNode(
  //       "          ERC20._wtf(recipient, ",
  //       1,
  //       [cairoNode]
  //     );

  //     const functionCallNodeCasted = functionCallNode as CairoFunctionCallNode;
  //     assert.equal("ERC20-_wtf-1", functionCallNode.name);
  //     assert.equal("ERC20", functionCallNodeCasted.namespaceName);
  //     assert.equal("_wtf", functionCallNodeCasted.functionCallName);

  //     const isNotOver = functionCallNode.processLine("    asd,", 1);
  //     assert.equal(false, isNotOver, "fails to process end scope");

  //     const isOver = functionCallNode.processLine("    initial_supply)", 2);
  //     assert.equal(true, isOver, "fails to process end scope");
  //   }
  // });
});
