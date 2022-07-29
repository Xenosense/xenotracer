/**
 * Parser related class goes here
 * There will be a parser for cairo language
 * The parser will be able to parse the code and return a tree of nodes
 */

import { BaseNode } from "./base";
import { EntitiesType } from "./enumCollectionsAndUtils";
import CairoContractNode from "./nodes/cairoContractNode";
import CairoFunctionNode from "./nodes/functionNode";
import CairoNamespaceNode from "./nodes/namespaceNode";
import CairoWithAttrNode from "./nodes/withAttrNode";
import CairoConditionalNode from "./nodes/conditionalNode";
import CairoCommentNode from "./nodes/commentNode";
import CairoFunctionCallNode from "./nodes/functionCallNode";
import CairoImportNode from "./nodes/importNode";
import { CairoFileFinder, readFile } from "./traverser";

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
    EntitiesType.scopingWithAttr,
    EntitiesType.conditionalStatement,
    EntitiesType.import,
    EntitiesType.functionCall,
  ];

  // Main File Contract Node. Used for running the parser.
  private _mainContract: CairoContractNode | null;

  // Other File Contract Node that is recursively parsed. It is a list of contracts
  private _otherContracts: CairoContractNode[] = [];

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

  private helperRecursiveParser(contractnode: BaseNode): string[] {
    const importObjects = contractnode.children.get(EntitiesType.import)!;

    // path that want to be explored
    let pathAdded: string[] = [];

    // placeholder to see if the import node has been added
    let doneTraverseImportName: string[] = [];

    // if importObjects is not undefined, then we need to parse the import
    if (importObjects) {
    // Loop through the import children that contains map of string, basenode
      for (const [key, value] of importObjects) {

        const importNode = value as CairoImportNode;

        // get the import node name and add to doneTraverseImportName
        const importName = importNode.name;

        // check if importName is already in doneTraverseImportName if yes just skip
        if (doneTraverseImportName.includes(importName)) {
          continue;
        }
        doneTraverseImportName.push(importName);

        // get `imports` map variable from the node and iterate through it
        const nodeImports = importNode.imports;

        for (const [key, value] of nodeImports) {
          // get the importPath from value map
          const importPath = value.get("importPath")!;

          // We ignore starkware imports here

          const splittedPath = importPath.split(".");
          if (splittedPath[0] === "starkware") {
            continue;
          }

          // check if importPath is in pathAdded if not, add it to path added
          // We do this to avoid infinite loop on parsing contract files
          if (!pathAdded.includes(importPath)) {
            pathAdded.push(importPath);
          }
        }
      }
    }
    return pathAdded;
  }

  public getOtherContract(): CairoContractNode[] {
    return this._otherContracts;
  }

  private recursivePathTilldone(
    pathAdded: string[],
    currentWorkingDir: string,
    additionalPaths: string[]
  ) {

    const cairoFileFinder = new CairoFileFinder(
      currentWorkingDir,
      additionalPaths
    );

    const queuePath = pathAdded.slice();
    
    // placeholder so we can check if the path is already processed
    const pathDone: string[] = [];

    // we will loop while queuePath is not empty
    while (queuePath.length > 0) {
      // take the first item of queuePath (QUEUE)
<<<<<<< HEAD
      const importDotPath = queuePath.shift()!;

      // check if the path is already in pathDone (avoid infinite loop)
      if (pathDone.includes(importDotPath)) {
=======
      const path = queuePath.shift()!;

      // check if the path is already in pathDone (avoid infinite loop)
      if (pathDone.includes(path)) {
>>>>>>> main
        continue;
      }

      // get the filepath using cairoFileFinder, return null if the file
      // doesn't exist
<<<<<<< HEAD
      const filePath = cairoFileFinder.getFilePath(importDotPath);
=======
      const filePath = cairoFileFinder.getFilePath(path);
>>>>>>> main

      if (filePath) {
        // read the file
        const codeContent = readFile(filePath);
<<<<<<< HEAD
        
        // The filepath is the import dot path (e.g.: a.b.c)
        this.parseAFile(codeContent, importDotPath, false);
=======

        // Then parse the file
        this.parseAFile(codeContent, filePath, false);
>>>>>>> main

        // get the last _otherContract then get its import path
        // using helperRecursiveParser
        const lastContract =
          this._otherContracts[this._otherContracts.length - 1];

        const importPaths = this.helperRecursiveParser(lastContract);

<<<<<<< HEAD
        // then put them into queuePath. check if they're already in pathDone
=======
        // then put them into queuePath. check first if they're already in pathDone
>>>>>>> main
        for (const importPath of importPaths) {
          if (!pathDone.includes(importPath)) {
            queuePath.push(importPath);
          }
        }
      }

<<<<<<< HEAD
      pathDone.push(importDotPath);
=======
      pathDone.push(path);
>>>>>>> main
    }
  }

  /**
   * Parse a contract import recursively. It will create contract nodes for each import.
   * 
   * 
   * @param code original file contract content
   * @param fileName the file name of the contract
   * @param currentWorkingDir current working directory. Used to find the contract
   * @param additionalPaths other additional paths to find the imported contract.
   */
  public parseContractRecursively(
    code: string,
    fileName: string,
    currentWorkingDir: string,
    additionalPaths: string[]
  ) {
    // First, parse the main file
    this.parseAFile(code, fileName, true);

    // get its import by checking each import node and get their path
    const pathWillTraverse = this.helperRecursiveParser(this._mainContract!);

    // do recursive Path till done
    this.recursivePathTilldone(
      pathWillTraverse,
      currentWorkingDir,
      additionalPaths
    );
  }

  /**
   * Entry point of the parser.
   * Parses a contract OR file and make it into a tree of nodes.
   * It will be stored as private variable in the class.
   * @param code the text of the contract
   * @param fileName the name of the file
   * @param isMainContract if the contract is the main contract
   */
  public parseAFile(
    code: string,
    fileName: string,
    isMainContract: boolean = true
  ): void {
    // First we split the code into lines
    const lines = code.split("\n");

    // Then, we initiate a Contract Node!
    // remove the '.cairo' from fileName if its there
    const contractName = fileName.replace(".cairo", "");

    let runningContract: CairoContractNode;

    // If it is a main contract, then we create a new contract node
    // Otherwise, we create a new contract node and add it to the list of contracts
    if (isMainContract) {
      this._mainContract = new CairoContractNode(contractName, 0, []);
      runningContract = this._mainContract;
    } else {
      runningContract = new CairoContractNode(contractName, 0, []);
      this._otherContracts.push(runningContract);
    }

    // Add it into the running stack
    this._runningStack.push(runningContract);

    // Set current to running contract
    this._currentNode = runningContract;

    // Loop through each line
    for (let i = 0; i < lines.length; i++) {
      this.parseLine(lines[i], i);
    }

    // Check if the _currentNode is the mainContract, if no, throw error
    if (this._currentNode !== runningContract) {
<<<<<<< HEAD
      // TODO: Improvement, add better error message
=======
      // Improvement, add better error message
>>>>>>> main
      throw new Error("Error: Parser: Something wrong with your cairo file!");
    }

    // Empty it
    this._currentNode = null;
    this._runningStack.pop();
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

    if (CairoCommentNode.isTextLineThisNode(line, runningStackClone)) {
      chosenNode = CairoCommentNode.createNode(
        line,
        lineNumber,
        runningStackClone
      );
    } else if (CairoContractNode.isTextLineThisNode(line, runningStackClone)) {
      chosenNode = CairoContractNode.createNode(
        line,
        lineNumber,
        runningStackClone
      );
    } else if (CairoImportNode.isTextLineThisNode(line, runningStackClone)) {
      chosenNode = CairoImportNode.createNode(
        line,
        lineNumber,
        runningStackClone
      );
    } else if (CairoNamespaceNode.isTextLineThisNode(line, runningStackClone)) {
      chosenNode = CairoNamespaceNode.createNode(
        line,
        lineNumber,
        runningStackClone
      );
    } else if (CairoFunctionNode.isTextLineThisNode(line, runningStackClone)) {
      chosenNode = CairoFunctionNode.createNode(
        line,
        lineNumber,
        runningStackClone
      );
    } else if (CairoWithAttrNode.isTextLineThisNode(line, runningStackClone)) {
      chosenNode = CairoWithAttrNode.createNode(
        line,
        lineNumber,
        runningStackClone
      );
    } else if (
      CairoConditionalNode.isTextLineThisNode(line, runningStackClone)
    ) {
      chosenNode = CairoConditionalNode.createNode(
        line,
        lineNumber,
        runningStackClone
      );
    } else if (
      CairoFunctionCallNode.isTextLineThisNode(line, runningStackClone)
    ) {
      chosenNode = CairoFunctionCallNode.createNode(
        line,
        lineNumber,
        runningStackClone
      );
    }

    // continue else if till the end of the list of entities

    return chosenNode;
  }

  /**
   * Parse a line on a contract
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
