/**
 * A collections of Node
 */
import { BaseNode } from "../base";
import { EntitiesType } from "../enumCollectionsAndUtils";

export default class CairoWithAttrNode extends BaseNode {
  /**
   * Creates an instance of with_attr node.
   * @param name name of the node
   * @param startLine start line of the node
   * @param parents parents node. If you need something to do with parents, you can use this.
   */
  constructor(name: string, startLine: number, parents: BaseNode[]) {
    super(name, startLine, parents, EntitiesType.scopingWithAttr);
  }

  /**
   * This function will check if the line is a with_attr.
   * Just check the `with_attr` keyword in it
   * @param textLine text line !
   * @param currentRunningNodeStack current running node stack (parents)
   *
   * @returns always return false
   */
  static isTextLineThisNode(
    textLine: string,
    currentRunningNodeStack: BaseNode[]
  ): boolean {
    // Check if it is 'end' textLine
    const regex = /^with_attr/;
    const match = regex.exec(textLine.trim());

    if (match) {
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
   * Parse with_attr name from the text line
   * for example, with_attr xxx, parse the `with_attr`.
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
    const regex = /with_attr/;
    const match = regex.exec(textLine);
    if (match) {
      return new CairoWithAttrNode("withAttr", lineNumber, parents);
    }
    // if not match, raise error
    throw new Error(
      "Cannot create withAttr node, invalid text line on line" + lineNumber
    );
  }
}
