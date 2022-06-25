/**
 * Parser related class goes here
 * There will be a parser for cairo language
 * The parser will be able to parse the code and return a tree of nodes
 */

import { BaseNode } from "./base";
import { EntitiesType } from "./enumCollectionsAndUtils";
import CairoContractNode from "./nodes/cairoContractNode";

/**
 * Parser class.
 *
 * Here's how it works!
 * First of all, we create a public variable map that will contain entities of the language with its objects (map of string with entity object).
 * For example, map of {'entity': 'function', 'objects': {'a': FunctionNode(), 'b': FunctionNode()}}
 * Then, we have a private variable that will contain the current node that we are parsing. It's a Stack data structure
 * We will create a new node when we find a new entity. We will push the new node to the stack.
 *
 * 1. We take the text from the active window in vs code
 * 2. We split the text into lines
 * 3. We loop through each line
 * 4. We check the line and matches to our target entities. If it fits, we create a new node and push it to the stack.
 * 5. We also put it into our map of entities.
 * 6. We check if the line is a comment. If it is, we ignore it.
 * 7. For an entity that is in the current top of stack, process line till we find the end of the entity.
 * 8. We pop the top of the stack and set the current node to the top of the stack.
 * 9. Loop till the end of line.
 *
 * Entities will be anything that what is related to our visualization
 * For example: function, namespace, if-else, with_attr, etc.
 *
 * NOTE that, we assume that each scope only have one entity.
 */
class CairoParser {
  // Store entities that are important to us
  // They will be added as a children of a node, others won't be added
  // The others will still be run as a part of the node, but won't be added as a children of the node
  // THIS IS NOT GOOD, TO DO LATER: MOVE TO CONFIG FILE
  private importantEntitiesType: EntitiesType[] = [
    EntitiesType.Function,
    EntitiesType.NameSpace,
  ];

  // Main File Contract Node. Used for running the parser.
  private _mainContract: CairoContractNode | null;

  // Running stack to parse a file. It is a stack of nodes.
  private _runningStack: CairoContractNode[] = [];

  private _currentNode: BaseNode | null = null;

  constructor() {
    this._mainContract = null;
  }

  /**
   * Entry point of the parser.
   * Parses a contract OR file and make it into a tree of nodes.
   * It will be stored as private variable in the class.
   * @param code the text of the contract
   */
  public parseAFile(code: string) {
    // First we split the code into lines
    const lines = code.split("\n");

    // Then, we initiate a Contract Node!
    this._mainContract = new CairoContractNode("contract", 0, []);

    // Add it into the running stack
    this._runningStack.push(this._mainContract);

    // Set current Node to _mainContract
    this._currentNode = this._mainContract;

    // Loop through each line
    for (let i = 0; i < lines.length; i++) {
      this.parseLine(lines[i], i);
    }
  }

  /**
   * Creates a node if the line is an entity.
   *
   * @param line the line that is passed in
   */
  private createNodeIfEntity(
    line: string,
    lineNumber: number
  ): BaseNode | null {
    // I HAVEN'T FOUND A GOOD WAY LIKE PYTHON TO MAP ALLOWED ENTITIES TO CLASS.
    // FOR NOW, I WILL USE A SWITCH STATEMENT

    let chosenNode: BaseNode | null = null;

    // This line is the allowed entity to be checked.
    // Since typescript doesn't allow to use class as a variable, so here is how I do.
    // REMEMBER TO UPDATE THIS IF YOU ADD A NEW ENTITY TO BE ALLOWED!
    // THIS IS ACTUALLY NOT HEALTHY IN THE FUTURE, THINK ABOUT HOW WE REFACTOR IT LATER!
    //
    // Just use if else

    // clone runningStack, so it won't be used as pass of reference
    // Useful for traversing later (you don't wanna make the parent node as a reference variable)
    const runningStackClone = this._runningStack.slice();

    if (CairoContractNode.isTextLineThisNode(line, runningStackClone)) {
      chosenNode = CairoContractNode.createNode(
        line,
        lineNumber,
        runningStackClone
      );
    }

    // continue else if till the end of the list of entities

    return chosenNode;
  }

  /**
   * Parse a line
   *
   * @param line the line that is passed in
   * @param lineNumber the line number the line is in
   */
  private parseLine(line: string, lineNumber: number) {
    // Check if the line is a comment
    if (line.startsWith("//")) {
      return;
    }

    // Check if the line is an entity
    const node = this.createNodeIfEntity(line, lineNumber);

    // if node is null, we do processLine with our current top of node.
    if (node === null) {
      const isNodeEnded = this._currentNode!.processLine(line, lineNumber);

      // if the node is ended, we pop the top of the stack, and set the current node to the top of the stack.
      if (isNodeEnded) {
        this._runningStack.pop();
        this._currentNode = this._runningStack[this._runningStack.length - 1];
      }
    }
    // otherwise, change the current node to the new node, and push it to the stack.
    else {
      // before that, add the new node as the child of the current node
      // It will be done if the node is importantEntitiesType
      if (this.importantEntitiesType.includes(node.getEntityType()!)) {
        this._currentNode!.addChild(node);
      }
      this._currentNode = node;
      this._runningStack.push(node);

      // process the line with the node after it got initialized!
      // WARNING: this is redundant, REFACTOR IT LATER!
      const isNodeEnded = this._currentNode!.processLine(line, lineNumber);
      if (isNodeEnded) {
        this._runningStack.pop();
        this._currentNode = this._runningStack[this._runningStack.length - 1];
      }
    }
  }
}
