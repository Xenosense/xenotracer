/**
 * All node test goes here
 */

import * as assert from "assert";
import CairoContractNode from "../../lib/nodes/cairoContractNode";
import CairoCommentNode from "../../lib/nodes/commentNode";

suite("Comment Node Test Suite", () => {
  /**
   * Test if a line is detected as a withAttr node
   */
  test("test-comment-node-start", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    // accept case
    const isInExampleOne = CairoCommentNode.isTextLineThisNode(
      "# namespace cat:",
      [cairoNode]
    );
    assert.equal(
      isInExampleOne,
      true,
      "fails to detect comment with namespace"
    );

    // accept case: just random comment
    const isInExampleTwo = CairoCommentNode.isTextLineThisNode(
      "# pikachu zips a ratata with thunderbolt",
      [cairoNode]
    );
    assert.equal(
      isInExampleTwo,
      true,
      "fails to detect comment with random text"
    );

    // reject cases: '#' in with_attr
    const hasInWithAttr = CairoCommentNode.isTextLineThisNode(
      'with_attr attribute_name("# Attribute Value")',
      [cairoNode]
    );
    assert.equal(
      hasInWithAttr,
      false,
      "fails to reject comment with # in with_atttr"
    );

    const isNotInExampleFour = CairoCommentNode.isTextLineThisNode(
      "    func xxx(",
      [cairoNode]
    );
    assert.equal(isNotInExampleFour, false, "fails to reject func node");
  });

  /**
   * Test if a node process well and has ended the node
   */
  test("test-comment-node-end", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    // Return true if the line is a Comment (starts with #)
    const commentNode = CairoCommentNode.createNode("# namespace cat:", 0, [
      cairoNode,
    ]);

    const processedComments2 = commentNode.processLine("# namespace cat: ", 1);

    const processedComments1 = commentNode.processLine(
      "# func constructor{ ",
      2
    );
    const processedComments3 = commentNode.processLine("# awawaawa", 3);
    // We check whether comment is ended
    // Since comments will be thrown away, we just check if the node is ended
    assert.equal(processedComments1, true);
    assert.equal(processedComments2, true);
    assert.equal(processedComments3, true);
  });
});
