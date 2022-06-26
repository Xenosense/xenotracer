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
 * 3. We create a CairoContractNode object
 * 4. We loop through the lines
 * 5. We CHECK if the current line is the scope of new node that is checked in `createNodeIfEntity`. It means that each Node class 
 *    Will run `isTextLineThisNode` method to check if the current line is the scope of the node. e.g.: FunctionNode need to have `function` or @decorator.
 * 6. If yes, then we create a new node and push it to the stack. Process the line with the new node instead
 * 7. If no, then we process the line with the current node (e.g.: Current Node is in function scope, so FunctionNode will process the line to do something
 *    and adjust its object (e.g.: counting line number, etc and store it as a variable)
 * 8. When we finish the loop, we pop the last node from the stack. We check if the last node is the same as the _mainContract. 
 *    if yes, then no error is thrown.
 * 
 *
 * Entities will be anything that what is related to our visualization
 * For example: function, namespace, if-else, with_attr, etc.
 *
 * NOTE that, we assume that each scope only have one entity.
 */
export class CairoParser {
  // Store entities that are important to us
  // They will be added as a children of a node, others won't be added
  // The others will still be run as a part of the node, but won't be added as a children of the node
  // THIS IS NOT GOOD, TO DO LATER: MOVE TO CONFIG FILE
  private importantEntitiesType: EntitiesType[] = [
    EntitiesType.function,
    EntitiesType.nameSpace,
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
   * Getter of Main Contract
   * @returns the main contract
   */
  public getMainContract(): CairoContractNode | null {
    return this._mainContract;
  }

  /**
   * Entry point of the parser.
   * Parses a contract OR file and make it into a tree of nodes.
   * It will be stored as private variable in the class.
   * @param code the text of the contract
   */
  public parseAFile(code: string, fileName: string): void {
    // First we split the code into lines
    const lines = code.split("\n");

    // Then, we initiate a Contract Node!
    // remove the '.cairo' from fileName if its there
    const contractName = fileName.replace(".cairo", "");
    this._mainContract = new CairoContractNode(contractName, 0, []);

    // Add it into the running stack
    this._runningStack.push(this._mainContract);

    // Set current Node to _mainContract
    this._currentNode = this._mainContract;

    // Loop through each line
    for (let i = 0; i < lines.length; i++) {
      this.parseLine(lines[i], i);
    }

    // Check if the _currentNode is the mainContract, if no, throw error
    if (this._currentNode !== this._mainContract) {
      throw new Error(
        "Error: Parser: Current node is not the main contract! Something wrong with your file!"
      );
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