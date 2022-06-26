/**
 * All node test goes here
 */

import * as assert from "assert";
import CairoContractNode from "../../lib/nodes/cairoContractNode";
import CairoFunctionNode from "../../lib/nodes/functionNode";
import CairoNamespaceNode from "../../lib/nodes/namespaceNode";

// TODO: add test for CairoContractNode after import is completed!
suite("Node Test Suite", () => {
  test("test-got-parsed-all-cairo-node", () => {
    // Test if a line is parsed correctly

    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    // The name of the node is 'testing' (e.g.: testing.cairo file)
    assert.equal(cairoNode.name, "testing");
    const shouldReturnFalse = CairoContractNode.isTextLineThisNode(
      "testing",
      []
    );
    assert.equal(shouldReturnFalse, false);
  });

  /**
   * Test if a line is detected as a function node
   */
  test("test-function-node-detect-new-node-scope", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    // Return true if the line is a function (starts with decorator)
    const isIn = CairoFunctionNode.isTextLineThisNode("@constructor", [
      cairoNode,
    ]);
    assert.equal(isIn, true, "fails to detect function node with decorator");

    // Return false if the line is not in namespace, but doesn't start with decorator
    const isNotIn = CairoFunctionNode.isTextLineThisNode("    func xxx(", [
      cairoNode,
    ]);
    assert.equal(
      isNotIn,
      false,
      "fails to not detect function node without decorator"
    );

    // Return true if the line is in namespace, but doesn't start with decorator
    const nameSpaceNode = new CairoNamespaceNode("namestuff", 0, []);

    const isInButNotStartWithDecorator = CairoFunctionNode.isTextLineThisNode(
      "    func xxx(",
      [cairoNode, nameSpaceNode]
    );
    assert.equal(
      isInButNotStartWithDecorator,
      true,
      "fails to detect function node without decorator but within namespace"
    );

    // Return false if the line is in namespace, but starts with decorator
    const isInButStartWithDecorator = CairoFunctionNode.isTextLineThisNode(
      "@external",
      [cairoNode, nameSpaceNode]
    );
    assert.equal(
      isInButStartWithDecorator,
      false,
      "fails to not detect function node with decorator but within namespace"
    );
  });

  /**
   * Test if a node process well and has ended the node
   */
  test("test-function-node-end", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    // Return true if the line is a function (starts with decorator)
    const funcNode = CairoFunctionNode.createNode("@constructor", 0, [
      cairoNode,
    ]);

    // Don't forget to add child to cairo node
    cairoNode.addChild(funcNode);
    funcNode.processLine("func xxx{", 1);
    funcNode.processLine("   }", 2);
    funcNode.processLine("   (a: felt, b: felt) -> (success: felt):", 3);
    funcNode.processLine("   ERC20.meong()", 4);
    funcNode.processLine("   return (TRUE)", 5);
    const isOver = funcNode.processLine("end", 6);

    // Check if name is 'xxx'
    assert.equal(funcNode.name, "xxx");

    // and check if isOver is TRUE
    assert.equal(isOver, true);
  });

  /**
   * Test if a namespace node process well and has ended the node
   */
  test("test-namespace-node-everything", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    // Return true. it is the stars of namespace node.
    const isIn = CairoNamespaceNode.isTextLineThisNode("namespace ERC20", [
      cairoNode,
    ]);
    assert.equal(isIn, true);

    const nameSpaceNode = CairoNamespaceNode.createNode("namespace ERC20", 0, [
      cairoNode,
    ]);
    const isEnded = nameSpaceNode.processLine("end", 1);

    // Check if name is 'ERC20'
    assert.equal(nameSpaceNode.name, "ERC20");

    // check if ended
    assert.equal(isEnded, true);
  });
});
