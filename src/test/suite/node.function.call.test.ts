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
  // test("test-function-call-node-start", () => {
  //   // Initialize cairo node
  //   let cairoNode = new CairoContractNode("testing", 0, []);

  //   {
  //     const isInExample = CairoFunctionCallNode.isTextLineThisNode(
  //       "let (name) = ERC20.name()",
  //       [cairoNode]
  //     );
  //     assert.equal(
  //       isInExample,
  //       true,
  //       "fails to detect function-call with namespace with no params"
  //     );
  //   }

  //   {
  //     const isInExample = CairoFunctionCallNode.isTextLineThisNode(
  //       "ERC20._mint(recipient, initial_supply)",
  //       [cairoNode]
  //     );
  //     assert.equal(
  //       isInExample,
  //       true,
  //       "fails to detect function-call with namespace with no params"
  //     );
  //   }

  //   {
  //     const isInExample = CairoFunctionCallNode.isTextLineThisNode(
  //       "name()",
  //       [cairoNode]
  //     );
  //     assert.equal(
  //       isInExample,
  //       true,
  //       "fails to detect function-call without namespace with no params"
  //     );
  //   }

  //   {
  //     const isInExample = CairoFunctionCallNode.isTextLineThisNode(
  //       "_mint(recipient, initial_supply)",
  //       [cairoNode]
  //     );
  //     assert.equal(
  //       isInExample,
  //       true,
  //       "fails to detect function-call without namespace with no params"
  //     );
  //   }

  //   {
  //     const isInExample = CairoFunctionCallNode.isTextLineThisNode(
  //       "test(",
  //       [cairoNode]
  //     );
  //     assert.equal(
  //       isInExample,
  //       true,
  //       "fails to detect function-call without namespace with no params"
  //     );
  //   }

  //   {
  //     const isNotInExample = CairoFunctionCallNode.isTextLineThisNode(
  //       "a,",
  //       [cairoNode]
  //     );
  //     assert.equal(
  //       isNotInExample,
  //       false,
  //       "fails to detect function-call without namespace with no params"
  //     );
  //   }


  //   {
  //     const isNotInExample = CairoFunctionCallNode.isTextLineThisNode(
  //       "b,",
  //       [cairoNode]
  //     );
  //     assert.equal(
  //       isNotInExample,
  //       false,
  //       "fails to detect function-call without namespace with no params"
  //     );
  //   }

  //   {
  //     const isNotInExample = CairoFunctionCallNode.isTextLineThisNode(
  //       ")",
  //       [cairoNode]
  //     );
  //     assert.equal(
  //       isNotInExample,
  //       false,
  //       "fails to detect function-call without namespace with no params"
  //     );
  //   }


  //   {
  //     const isNotInExample = CairoFunctionCallNode.isTextLineThisNode(
  //       "%lang starknet",
  //       [cairoNode]
  //     );
  //     assert.equal(
  //       isNotInExample,
  //       false,
  //       "fails to detect function-call without namespace with no params"
  //     );

  //   }

  //   {
  //     const isNotInExample = CairoFunctionCallNode.isTextLineThisNode(
  //       "from starkware.cairo.common.cairo_builtins import HashBuiltin",
  //       [cairoNode]
  //     );
  //     assert.equal(
  //       isNotInExample,
  //       false,
  //       "fails to detect function-call without namespace with no params"
  //     );

  //   }

  //   {
  //     const isNotInExample = CairoFunctionCallNode.isTextLineThisNode(
  //       "return (remaining)",
  //       [cairoNode]
  //     );
  //     assert.equal(
  //       isNotInExample,
  //       false,
  //       "fails to detect function-call without namespace with no params"
  //     );

  //   }

  //   {
  //     const isNotInExample = CairoFunctionCallNode.isTextLineThisNode(
  //       "}(spender: felt, amount: Uint256) -> (success: felt):",
  //       [cairoNode]
  //     );
  //     assert.equal(
  //       isNotInExample,
  //       false,
  //       "fails to detect function-call without namespace with no params"
  //     );

  //   }
  // });

  /**
   * Test if a node process well and has ended the node
   */
  test("test-function-call-node-end", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    {
      const functionCallNode = CairoFunctionCallNode.createNode(
        "      ERC20.initializer(name, symbol, decimals):",
        0,
        [cairoNode]
      );

      const functionCallNodeCasted = functionCallNode as CairoFunctionCallNode;
      assert.equal("initializer0", functionCallNode.name);
      assert.equal("ERC20", functionCallNodeCasted.namespaceName);
      assert.equal("initializer", functionCallNodeCasted.functionCallName);

      const isOver = functionCallNode.processLine(
        "    ERC20.initializer(name, symbol, decimals) ",
        0
      );
      assert.equal(true, isOver, "fails to process end scope");
    }

    {
      const functionCallNode = CairoFunctionCallNode.createNode(
        "       initializer(name, symbol, decimals)",
        1,
        [cairoNode]
      );

      const functionCallNodeCasted = functionCallNode as CairoFunctionCallNode;
      assert.equal("initializer1", functionCallNode.name);
      assert.equal(null, functionCallNodeCasted.namespaceName);
      assert.equal("initializer", functionCallNodeCasted.functionCallName);

      const isOver = functionCallNode.processLine("initializer(name, symbol, decimals):", 2);
      assert.equal(true, isOver, "fails to process end scope");
    }

    {
      const functionCallNode = CairoFunctionCallNode.createNode(
        "          ERC20.approve(spender, ",
        1,
        [cairoNode]
      );

      const functionCallNodeCasted = functionCallNode as CairoFunctionCallNode;

      assert.equal("approve1", functionCallNode.name);
      assert.equal("ERC20", functionCallNodeCasted.namespaceName);
      assert.equal("approve", functionCallNodeCasted.functionCallName);

      const isNotOver = functionCallNode.processLine("    asd,", 1);
      assert.equal(false, isNotOver, "fails to process end scope");

      const isOver = functionCallNode.processLine("    initial_supply)", 2);
      assert.equal(true, isOver, "fails to process end scope");
    }

    {
      const functionCallNode = CairoFunctionCallNode.createNode(
        "          ERC721.wtf(spender, ",
        1,
        [cairoNode]
      );

      const functionCallNodeCasted = functionCallNode as CairoFunctionCallNode;

      assert.equal("wtf1", functionCallNode.name);
      assert.equal("ERC721", functionCallNodeCasted.namespaceName);
      assert.equal("wtf", functionCallNodeCasted.functionCallName);

      const isNotOver = functionCallNode.processLine("    asd,", 1);
      assert.equal(false, isNotOver, "fails to process end scope");
      
      const isOver = functionCallNode.processLine("    ) ", 2);
      assert.equal(true, isOver, "fails to process end scope");
    }
  });
});
