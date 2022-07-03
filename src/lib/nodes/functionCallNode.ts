/**
 * A collections of Node
 */
import { match } from "assert";
import { BaseNode } from "../base";
import { EntitiesType } from "../enumCollectionsAndUtils";


export default class CairoFunctionCallNode extends BaseNode {
  namespaceName: string;
  functionCallName: string;

  /**
   * Creates an instance of namespace node.
   * @param name name of the node
   * @param startLine start line of the node
   * @param parents parents node. If you need something to do with parents, you can use this.
   */
  constructor(name: string, startLine: number, parents: BaseNode[], namespaceName: string, functionCallName: string) {
    super(name, startLine, parents, EntitiesType.functionCall);
    this.namespaceName = namespaceName;
    this.functionCallName = functionCallName;

  }

  /**
   * This function will check if the line is a namespace.
   * Just check the `namespace` keyword in it
   * @param textLine text line !
   * @param currentRunningNodeStack current running node stack (parents)
   *
   * @returns always return false
   */
  static isTextLineThisNode(
    textLine: string,
    currentRunningNodeStack: BaseNode[]
  ): boolean {
    
    // if not using namespace
    // e.g. name()
    const regexInTheMiddleOfFunction = /^\s+\w+,/;
    const matchInTheMiddleOfFunction = regexInTheMiddleOfFunction.exec(textLine);
    if (matchInTheMiddleOfFunction){
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
    const regexEndOfFunction = /\w+\)/
    const match = regexEndOfFunction.exec(textLine)
    if (match){
      return true;
    }
    return false;
  }

  /**
   *
   * Parse namespace name from the text lline
   * for example, namespace xxx, parse the `xxx`.
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

    // if using namespace
    const regexWithNamespace = /(\w+)\.(\w+)\([\w\s\,]*/;
    const matchWithNamespace = regexWithNamespace.exec(textLine);
    if (matchWithNamespace) {
      const namespaceName = matchWithNamespace[1];
      const functionCallName = matchWithNamespace[2];
      const name: string = namespaceName.concat("-",functionCallName, "-", lineNumber.toString());
      return new CairoFunctionCallNode(name, lineNumber, parents, namespaceName, functionCallName);
    }
    // if not using namespace
    const regexWithoutNamespace = /(\w+)\([\w\s]*,/
    const matchWithoutNamespace = regexWithoutNamespace.exec(textLine);
    
    if (matchWithoutNamespace) {
        const namespaceName = "null"
        const functionCallName = matchWithoutNamespace[1]
        const name: string = namespaceName.concat("-", functionCallName, "-", lineNumber.toString());
        return new CairoFunctionCallNode(name, lineNumber, parents, namespaceName, functionCallName);
    }
    throw new Error(
      "Cannot create namespace node, invalid text line on line " + lineNumber
    );
  }
}
