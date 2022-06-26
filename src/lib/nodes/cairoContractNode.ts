/**
 * A collections of Node
 */
import { BaseNode } from "../base";
import { EntitiesType } from "../enumCollectionsAndUtils";

export default class CairoContractNode extends BaseNode {
  /**
   * Creates an instance of contract node.
   * @param name name of the node
   * @param startLine start line of the node
   * @param parents parents node. If you need something to do with parents, you can use this.
   */
  constructor(name: string, startLine: number, parents: BaseNode[]) {
    super(name, startLine, parents, EntitiesType.contract);
  }

  /**
   * This always returns true, since it will be added at the start of parsing.
   * @param textLine text line !
   * @param currentRunningNodeStack current running node stack (parents)
   *
   * @returns always return false
   */
  static isTextLineThisNode(
    textLine: string,
    currentRunningNodeStack: BaseNode[]
  ): boolean {
    return false;
  }

  /**
   * Process line. TODO in the future, process import Node!
   * @param textLine text line
   * @param lineNumber line number
   * @returns always return false. This node will finish its job on the end of line.
   */
  processLine(textLine: string, lineNumber: number): boolean {
    return false;
  }

  /**
   * Create node for CairoContractNode
   * This static method won't be used! You need to use the main constructor instead
   * 
   * @param textLine should be empty string.
   * @param lineNumber should be 0 
   * @param parents 
   * 
   * @returns a new CairoContractNode
   */
  static createNode(
    textLine: string,
    lineNumber: number,
    parents: BaseNode[]
  ): BaseNode {
    return new CairoContractNode("", lineNumber, parents);
  }


}
