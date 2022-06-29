/**
 * A collections of Node
 */
import { BaseNode } from "../base";
import { EntitiesType } from "../enumCollectionsAndUtils";

export default class CairoCommentNode extends BaseNode {
  /**
   * Creates an instance of comment node.
   * We wont make this node as the child of any node.
   *
   * @param name name of the node
   * @param startLine start line of the node
   * @param parents parents node. If you need something to do with parents, you can use this.
   */
  constructor(name: string, startLine: number, parents: BaseNode[]) {
    super(name, startLine, parents, EntitiesType.comment);
  }

  /**
   * Check if the text line starts with '#'
   *
   * @param textLine text line !
   * @param currentRunningNodeStack current running node stack (parents)
   *
   * @returns True if matches the condition
   */
  static isTextLineThisNode(
    textLine: string,
    currentRunningNodeStack: BaseNode[]
  ): boolean {
    // check it the line starts with # after trim
    return textLine.trim().startsWith("#");
  }

  /**
   * Process line. ALWAYS RETURN TRUE. since we will immediately process the line.
   *
   * @param textLine text line
   * @param lineNumber line number
   * @returns always return TRUE. meaning it's done for every line
   */
  processLine(textLine: string, lineNumber: number): boolean {
    return true;
  }

  /**
   * Create node for Comment Node
   * This static method won't be used! You need to use the main constructor instead
   *
   * @param textLine should be empty string.
   * @param lineNumber should be 0
   * @param parents
   *
   * @returns a new Comment Node
   */
  static createNode(
    textLine: string,
    lineNumber: number,
    parents: BaseNode[]
  ): BaseNode {
    return new CairoCommentNode("", lineNumber, parents);
  }
}
