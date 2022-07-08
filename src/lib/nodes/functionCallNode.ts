/**
 * A collections of Node
 */
import { BaseNode } from "../base";
import { EntitiesType } from "../enumCollectionsAndUtils";

export default class CairoFunctionCallNode extends BaseNode {
  public namespaceName: string | null;
  public functionCallName: string;

  /**
   * Creates an instance of namespace node.
   * @param name name of the node
   * @param startLine start line of the node
   * @param parents parents node. If you need something to do with parents, you can use this.
   */
  constructor(
    name: string,
    startLine: number,
    parents: BaseNode[],
    namespaceName: string | null,
    functionCallName: string
  ) {
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
    const regex = /\w+.\w+\(.*\)*/;
    const match = regex.exec(textLine);
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
    const regexEndOfFunction = /.*\)/;
    const match = regexEndOfFunction.exec(textLine);
    if (match) {
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
    const regex = /\w+.\w+\(.*\)*/;
    const match = regex.exec(textLine);
    // console.log(match);

    if (match) {
      const line = match[0];

      // if namespace exists
      if (line.includes(".")) {
        const namespaceRegex = /(\w+)\.(\w+)/;
        const namespaceMatch = namespaceRegex.exec(line);
        if (namespaceMatch) {
          const namespaceName = namespaceMatch[1];
          const functionCallName = namespaceMatch[2];
          const name = functionCallName.concat(lineNumber.toString());
          return new CairoFunctionCallNode(
            name,
            lineNumber,
            parents,
            namespaceName,
            functionCallName
          );
        }
      }

      const functionNameRegex = /(\w+)\(/;
      const functionNameMatch = functionNameRegex.exec(line);
      if (functionNameMatch) {
        const functionCallName = functionNameMatch[1];
        const name = functionCallName.concat(lineNumber.toString());
        return new CairoFunctionCallNode(
          name,
          lineNumber,
          parents,
          null,
          functionCallName
        );
      }
    }

    throw new Error(
      "Cannot create functionCall node, invalid text line on line " + lineNumber
    );
  }
}
