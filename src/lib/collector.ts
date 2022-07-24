/**
 * Anything that collect the result of parsing should be implemented here.
 */

import CairoContractNode from "./nodes/cairoContractNode";
import { EntitiesType } from "./enumCollectionsAndUtils";


export class ParsedContractCollector {

  private static diveUntilLeaf(node: BaseNode): BaseNode[] {
    const children = node.children.get(EntitiesType.functionCall);
    if (children.length === 0) {
      return [node];
    }

    const result: BaseNode[] = [];
    for (const child of children) {
      result.push(...this.diveUntilLeaf(child));
    }

    return result;
  }

  /**
   *
   * Collect parsed result from the parser that will be passed to the frontend.
   *
   * This is how we do this:
   *  1. Get the main contract
   *  2. Get all of the functions
   *  3. for every function calls, go dive deep until you reach leaf.
   *  4. Do 2 - 3 till the end of each functions.
   * 
   * @param mainContract The main contract that is being parsed.
   * @param importedContracts The imported contracts that are being parsed.
   * @returns return the parsed result that will be passed to the frontend.
   */
  public static collectParsedResult(
    mainContract: CairoContractNode,
    importedContracts: CairoContractNode[]
  ): string {
    // This is how we do this:
    // 1. Get the main contract
    // 2. Get all of the functions
    // 3. for every invocation, go dive deep until you reach leaf.
    // 4. Do 2 - 3 till the end of each functions.
    const functions = mainContract.children.get(EntitiesType.function);
    
    // TODO
    // 1: create a class that can make a tree between function calls
    // 2: build the tree (from the contract node, it will traverse the imports, if it has it, add it as a child)
    // 3: traverse the tree and get the string representation of the tree

  }
}
