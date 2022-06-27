/**
 * All node test goes here
 */

import * as assert from "assert";
import CairoContractNode from "../../lib/nodes/cairoContractNode";
import CairoFunctionNode from "../../lib/nodes/functionNode";
import CairoNamespaceNode from "../../lib/nodes/namespaceNode";
import CairoWithAttrNode from "../../lib/nodes/withAttrNode";

// TODO: add test for CairoContractNode after import is completed!
suite("with_attr Node Test Suite", () => {
  /**
   * Test if a line is detected as a function node
   */
  test("test-function-node-detect-new-node-scope", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);
    let functionNode = new CairoFunctionNode("node", 0, [cairoNode]);

    // accept case
    const isInExampleOne = CairoWithAttrNode.isTextLineThisNode('      with_attr error("ERC20: added_value is not a valid Uint256"):', [cairoNode, functionNode]);
    assert.equal(isInExampleOne, true, "fails to detect with_attr with space before");

    // reject cases
    const isInExampleTwo = CairoWithAttrNode.isTextLineThisNode('with_attr error("ERC20: added_value is not a valid Uint256"):', [cairoNode, functionNode]);
    assert.equal(isInExampleTwo, true, "fails to detect withAttr without space");

    const isNotInExampleThree = CairoWithAttrNode.isTextLineThisNode('# with_attr error("ERC20: added_value is not a valid Uint256"):', [cairoNode, functionNode]);
    assert.equal(isNotInExampleThree, false, "fails to reject comment");

    const isNotInExampleFour = CairoFunctionNode.isTextLineThisNode("    func xxx(", [
      cairoNode,
      functionNode
    ]);
    assert.equal(
      isNotInExampleFour,
      false,
      "fails to reject func node"
    );

    const isNotInExampleFive = CairoFunctionNode.isTextLineThisNode("    namespace cat:", [
      cairoNode,
      functionNode
    ]);
    assert.equal(
      isNotInExampleFive,
      false,
      "fails to reject namespace node"
    );


  });

  /**
   * Test if a node process well and has ended the node
   */
  // test("test-function-node-end", () => {
  //   // Initialize cairo node
  //   let cairoNode = new CairoContractNode("testing", 0, []);

  //   // Return true if the line is a function (starts with decorator)
  //   const funcNode = CairoFunctionNode.createNode("@constructor", 0, [
  //     cairoNode,
  //   ]);

  //   // Don't forget to add child to cairo node
  //   cairoNode.addChild(funcNode);
  //   funcNode.processLine("func xxx{", 1);
  //   funcNode.processLine("   }", 2);
  //   funcNode.processLine("   (a: felt, b: felt) -> (success: felt):", 3);
  //   funcNode.processLine("   ERC20.meong()", 4);
  //   funcNode.processLine("   return (TRUE)", 5);
  //   const isOver = funcNode.processLine("end", 6);

  //   // Check if name is 'xxx'
  //   assert.equal(funcNode.name, "xxx");

  //   // and check if isOver is TRUE
  //   assert.equal(isOver, true);
  // });

  // /**
  //  * Test if a namespace node process well and has ended the node
  //  */
  // test("test-namespace-node-everything", () => {
  //   // Initialize cairo node
  //   let cairoNode = new CairoContractNode("testing", 0, []);

  //   // Return true. it is the stars of namespace node.
  //   const isIn = CairoNamespaceNode.isTextLineThisNode("namespace ERC20", [
  //     cairoNode,
  //   ]);
  //   assert.equal(isIn, true);

  //   const nameSpaceNode = CairoNamespaceNode.createNode("namespace ERC20", 0, [
  //     cairoNode,
  //   ]);
  //   const isEnded = nameSpaceNode.processLine("end", 1);

  //   // Check if name is 'ERC20'
  //   assert.equal(nameSpaceNode.name, "ERC20");

  //   // check if ended
  //   assert.equal(isEnded, true);
  // });
});