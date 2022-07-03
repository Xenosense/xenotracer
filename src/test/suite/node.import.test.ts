/**
 * All node test goes here
 */

import * as assert from "assert";
import CairoContractNode from "../../lib/nodes/cairoContractNode";
import CairoImportNode from "../../lib/nodes/importNode";
import {EntitiesType} from "../../lib/enumCollectionsAndUtils";


suite("Import Node Test Suite", () => {
  /**
   * Test if a line is detected as a withAttr node
   */
  test("test-import-node-start", () => {
    // Initialize cairo node
    let cairoNode = new CairoContractNode("testing", 0, []);

    // accept case
    const isInExampleOne = CairoImportNode.isTextLineThisNode(
      "from openzeppelin.token.erc20.library import ERC20",
      [cairoNode]
    );
    assert.equal(isInExampleOne, true, "normal import node should be detected");

    // accept case
    const isTrueCaseImportAsMulti = CairoImportNode.isTextLineThisNode(
      "from a.b import c as d, e, f",
      [cairoNode]
    );
    assert.equal(
      isTrueCaseImportAsMulti,
      true,
      "import with several names should be detected. It also adds other import."
    );

    // accept case
    const isTrueCaseSingleImportAlias = CairoImportNode.isTextLineThisNode(
      "from a.b import c as d",
      [cairoNode]
    );
    assert.equal(
      isTrueCaseSingleImportAlias,
      true,
      "import with alias should be detected."
    );

    // REJECT CASES
    const isNotImport = CairoImportNode.isTextLineThisNode("%lang cairo", [
      cairoNode,
    ]);
    assert.equal(isNotImport, false, "fails to reject %lang");

    const isNotImportWithComment = CairoImportNode.isTextLineThisNode(
      "# import aaa from bbb",
      [cairoNode]
    );
    assert.equal(isNotImportWithComment, false, "fails to reject comments");

    const isNotInExampleFour = CairoImportNode.isTextLineThisNode(
      "    func xxx(",
      [cairoNode]
    );
    assert.equal(isNotInExampleFour, false, "fails to reject func node");

    const isNotInExampleFive = CairoImportNode.isTextLineThisNode(
      "    namespace cat:",
      [cairoNode]
    );
    assert.equal(isNotInExampleFive, false, "fails to reject namespace node");
  });

  /**
   * Test if a node process well and has ended the node
   */
  test("test-import-create-parse-import", () => {
    // Initialize cairo node with its parents
    let cairoNode = new CairoContractNode("testing", 0, []);

    // The name should be the 'import' + line number
    const importNode = CairoImportNode.createNode(
      "from openzeppelin.token.erc20.library import ERC20",
      3,
      [cairoNode]
    );

    // cast to importNode
    const importNodeCast = importNode as CairoImportNode;

    assert.equal(importNode.name, "import-3", "name should be import-3");

    // importNode with have map of import
    // It will have key of the name of the import (either alias or not)
    // and value of the import that contains dictionary of 'importName' and 'importPath'
    assert.equal(importNodeCast.imports.size, 1, "should have one import");
    assert.equal(importNodeCast.imports.get("ERC20")!.get("importName"), "ERC20");
    assert.equal(
      importNodeCast.imports.get("ERC20")!.get("importPath"),
      "openzeppelin.token.erc20.library"
    );

    // The name should be the same as the name after 'as' in below case
    // Below name is meow, but the importName is cat
    const importNode2 = CairoImportNode.createNode(
      "from a.b import cat as meow",
      0,
      [cairoNode]
    );
      
    // cast to importNode
    const importNodeCast2 = importNode2 as CairoImportNode;

    // assert size is one
    assert.equal(importNodeCast2.imports.size, 1, "should have one import");

    // assert the name of the import is cat
    // The key to access the imports is `meow`
    assert.equal(importNodeCast2.imports.get("meow")!.get("importName"), "cat");

    // assert the path of the import is a.b
    assert.equal(importNodeCast2.imports.get("meow")!.get("importPath"), "a.b");

    // assert multiple import
    const importNode3 = CairoImportNode.createNode(
      "from a.b import cat as meow, mbeow, guk",
      0,
      [cairoNode]
    );

    // cast to importNode
    const importNodeCast3 = importNode3 as CairoImportNode;
    
    // assert size is three
    assert.equal(importNodeCast3.imports.size, 3, "should have three import");

    // Assert if the 'meow', 'mbeow', and 'guk' key is in the map
    assert.equal(importNodeCast3.imports.has("meow"), true, "should have meow");
    assert.equal(importNodeCast3.imports.has("mbeow"), true, "should have mbeow");
    assert.equal(importNodeCast3.imports.has("guk"), true, "should have guk");

    // Assert if the meow importName is 'cat'
    assert.equal(importNodeCast3.imports.get("meow")!.get("importName"), "cat");

    // assert the path of 'meow', 'mbeow', and 'guk' is a.b
    
    assert.equal(importNodeCast3.imports.get("meow")!.get("importPath"), "a.b");
    assert.equal(importNodeCast3.imports.get("mbeow")!.get("importPath"), "a.b");
    assert.equal(importNodeCast3.imports.get("guk")!.get("importPath"), "a.b");

  });
});
