/**
 * A collections of Node
 */
import { BaseNode } from "../base";
import { EntitiesType } from "../enumCollectionsAndUtils";

export default class CairoConditionalNode extends BaseNode {
  /**
   * Creates an instance of if node.
   * @param name name of the node
   * @param startLine start line of the node
   * @param parents parents node. If you need something to do with parents, you can use this.
   */
  constructor(name: string, startLine: number, parents: BaseNode[]) {
    super(name, startLine, parents, EntitiesType.conditionalStatement);
  }

  /**
   * This function will check if the line is a if.
   * Just check the `if` keyword in it
   * @param textLine text line !
   * @param currentRunningNodeStack current running node stack (parents)
   *
   * @returns always return false
   */
  static isTextLineThisNode(
    textLine: string,
    currentRunningNodeStack: BaseNode[]
  ): boolean {
    if (textLine.trim().startsWith("if")) {
      return true;
    }

    return false;
  }

  /**
   *  This function will return true if only it meets 'end' textline.
   * Otherwise, false.
   * @param textLine text line
   * @param lineNumber line number
   * @returns always return false. This node will finish its job on the end of line.
   */
  processLine(textLine: string, lineNumber: number): boolean {
    if (textLine.trim().startsWith("end")) {
      return true;
    }

    return false;
  }

  /**
   *
   * Parse if name from the text line
   * for example, if xxx, parse the `if`.
   *
   * @param textLine should be empty string.
   * @param lineNumber should be 0
   * @param parents
   *
   * @returns a new CairoWithAttrNode
   */
  static createNode(
    textLine: string,
    lineNumber: number,
    parents: BaseNode[]
  ): BaseNode {
    if (this.isTextLineThisNode(textLine, parents)) {
      return new CairoConditionalNode(
        "conditional".concat(lineNumber.toString()),
        lineNumber,
        parents
      );
    }
    // if not match, raise error
    throw new Error(
      "Cannot create conditional node, invalid text line on line" +
        lineNumber.toString()
    );
  }
}
