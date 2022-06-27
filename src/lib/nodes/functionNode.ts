/**
 * A collections of Node
 */
import { BaseNode } from "../base";
import { EntitiesType } from "../enumCollectionsAndUtils";

export default class CairoFunctionNode extends BaseNode {
  /**
   * Creates an instance of function node.
   * @param name name of the node
   * @param startLine start line of the node
   * @param parents parents node. If you need something to do with parents, you can use this.
   */
  constructor(name: string, startLine: number, parents: BaseNode[]) {
    super(name, startLine, parents, EntitiesType.function);
  }

  /**
   * Return true if the line has `decorator` or it's a function that has
   * namespaceNode parents
   *
   * @param textLine text line !
   * @param currentRunningNodeStack current running node stack (parents)
   *
   * @returns return true if the line has `decorator` or it's a function that has
   *      namespaceNode parents
   */
  static isTextLineThisNode(
    textLine: string,
    currentRunningNodeStack: BaseNode[]
  ): boolean {
    // get top level stack as the parent of this node
    const topLevel =
      currentRunningNodeStack[currentRunningNodeStack.length - 1];

    // Starts with decorator means it's a function
    if (textLine.includes("@")) {
      // Check if it has parent of namespace, if it has, it is invalid
      // return false
      if (topLevel.getEntityType() === EntitiesType.nameSpace) {
        return false;
      }
      // otherwise, return true
      return true;
    }

    // But if it starts with func, it needs to check whether it has namespaceNode parent (top level of stack)
    // (currentRunningNodeStack). If it has, it's valid, return true!
    if (textLine.includes("func")) {
      // Check if it has namespaceNode parent
      // get the top level of stack
      if (topLevel.getEntityType() === EntitiesType.nameSpace) {
        return true;
      }
    }
    return false;
  }

  /**
   * Process line.
   * If name doesn't exists (''), it will assign name to the node.
   * If name exists, it will check if the line has ended (end).
   * @param textLine text line
   * @param lineNumber line number
   * @returns always return false. This node will finish its job on the end of line.
   */
  processLine(textLine: string, lineNumber: number): boolean {
    // If it starts from func, it will assign a name to the node
    if (this.name === "") {
      // if the line starts with func, it will assign a name to the node
      if (textLine.includes("func")) {
        const regex = /func\s+(\w+)\{/;
        const match = regex.exec(textLine);
        this.name = match![1];

        // Now, we change our parents child key `""` to this name
        // previously, we had `""` as key, but now we have the name
        // Get the top level of stack
        this.parents[this.parents.length - 1].changeChildKey(
          this.getEntityType()!,
          "",
          this.name,
          this
        );
      }
    }
    // If it has name, it will check if the line has ended
    // Just check if the line starts with end
    if (textLine.trim().startsWith("end")) {
      return true;
    }
    return false;
  }

  /**
   * Create node for FunctionNode
   * We don't need to handle namespace non space anymore.
   * We will assume that a function node starts with decorator OR function
   *
   * @param textLine text line
   * @param lineNumber line number in the text editor
   * @param parents parents node
   *
   * @returns a new CairoContractNode
   */
  static createNode(
    textLine: string,
    lineNumber: number,
    parents: BaseNode[]
  ): BaseNode {
    // If text line starts with "@decorator" e.g.: @constructor, @external, @view
    // Then we will create a new node without name.

    if (textLine.includes("@")) {
      return new CairoFunctionNode("", lineNumber, parents);
    } else if (textLine.includes("func")) {
      // parse the func name, e.g. "func xxx{", take the 'xxx'
      // Take the function name
      const regex = /func\s+(\w+)\{/;
      const match = regex.exec(textLine);
      const funcName = match![1];
      return new CairoFunctionNode(funcName, lineNumber, parents);
    }
    // raise error if the line is not a function
    throw new Error(
      `Line ${lineNumber} is not a function. It starts with ${textLine}`
    );
  }
}
