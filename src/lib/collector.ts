/**
 * Anything that collect the result of parsing should be implemented here.
 */

import CairoContractNode from "./nodes/cairoContractNode";
import { EntitiesType } from "./enumCollectionsAndUtils";
import CairoFunctionCallNode from "./nodes/functionCallNode";
import CairoFunctionNode from "./nodes/functionNode";
import CairoImportNode from "./nodes/importNode";


class FunctionCallTree {
  /**
   * Function Call Tree that represents the function call tree of a contract.
   * 
   * @param contractNode The contract node that the function call tree is created from.
   * @param functionCallNodeRoot The function call node that is the root of the tree.
   * @param childs The child tuples of the tree. It contains the function calls that this function call refer to.
   *      For example: in `function Namespace.call()`, it will have all of function calls in `call()` as this child.
   */
  
  constructor(
    public contractNode: CairoContractNode,
    public functionCallNodeRoot: CairoFunctionCallNode | null,
    public childs: FunctionCallTree[] = []
  ) {
    // TODO: tree structure of this one is redundant with parsed tree. 
  // This is inefficient (twice on traversing the import).
  // This process should be done in the parser.
    this.contractNode = contractNode;
    this.functionCallNodeRoot = functionCallNodeRoot;
    this.childs = childs;
  }

  /**
   * Get graphviz representation of the function call tree.
   * @param usedVars Used variable so variable naming wont duplicate.
   *
   * @returns Tuple of arrow variables and graphviz representation (string).
   *  Tuple of used variables will be useful to represent the graphviz arrows.
   */
  public getGraphvizString(usedVars: Set<string>): [string[], string] {
    let graphvizString = "";

    // label is namespace.functionName (if namespace exist)
    // otherwise function Name
    const label = this.functionCallNodeRoot!.namespaceName
      ? `${this.functionCallNodeRoot!.namespaceName}.${
          this.functionCallNodeRoot!.functionCallName
        }`
      : this.functionCallNodeRoot!.functionCallName;
    let varName = this.functionCallNodeRoot!.functionCallName;
    // check if the variable name is used. if exists, change to varName + '_'
    // e.g: name = 'a_____'
    if (usedVars.has(varName)) {
      varName = varName + "_";
    }

    usedVars.add(`${varName}`);

    // Base case: no child present
    if (this.childs.length === 0) {
      graphvizString = graphvizString += `n_${varName} [label="${label}()"]\n`;
      return [[`n_${varName}`], graphvizString];
    }

    // recursive case: child present
    else {
      const returnedVarName: string[] = [];

      // create subgraph if this function call has childs.
      graphvizString += `subgraph cluster_${
        this.functionCallNodeRoot!.functionCallName
      } {\n`;
      graphvizString += `label="${label}()"\n`;

      this.childs.forEach((child) => {
        const tupleReturnedGraphviz = child.getGraphvizString(usedVars);
        // add the returned variable to the list.
        returnedVarName.push(...tupleReturnedGraphviz[0]);
        // add the graphviz string to the main graphviz string.
        graphvizString += tupleReturnedGraphviz[1];
      });

      // create the arrow from returnedVarName
      graphvizString += returnedVarName.join(" -> ") + "\n";
      graphvizString += "}\n";

      // Return the tuple of used variables and graphviz string.
      // We only return the first and last index of used variable
      // for the arrow in graphviz ( n1 -> n2 -> n3) -> n1 -> n3
      // We do this because the parent graph will only need the last and first index to be connected
      // with other subgraph.

      // Form returned variable name
      const lastReturnedVarName = returnedVarName[returnedVarName.length - 1];

      const returnedArrowVariables =
        returnedVarName.length === 1
          ? [returnedVarName[0]]
          : [returnedVarName[0], lastReturnedVarName];
      return [returnedArrowVariables, graphvizString];
    }
  }

  /**
   * Create a mapping of reference call (function or namespace) with its function node.
   *
   * NOTE: for now, we assume that user won't place namespace to the main contract file.
   * We will add this feature later as we find it rare for someone to place namespace to the main contract file.
   *
   * @param otherContracts other imported library or contract.
   */
  private getFunctionCallAndImportNodeMap(
    otherContracts: CairoContractNode[],
    funcCallName: string
  ) {
    // TODO: Please in the future, implement this one on parse implementation instead of here.

    // create map namespace string (alias) and function in contract
    // key: callname (either funcname or namespace) values: functionNode
    const mapOfReferenceCall = new Map<string, CairoFunctionNode>();
    const importNodes = this.contractNode.children.get(EntitiesType.import);
    const functionNodes = this.contractNode.children.get(EntitiesType.function);

    // We iterate through all the import nodes and add them to the map.
    if (importNodes) {
      importNodes.forEach((importNode) => {
        const importNodeCasted = importNode as CairoImportNode;
        // get the contract node from the other contracts.
        importNodeCasted.imports.forEach((importMap, importNameKey) => {
          // importNameKey: remember, it can be alias.
          // importMap: importPath and importName (non alias)
          // TODO: this hardcoded importPath and importName is not good, make a class instead in the future.
          const importPath = importMap.get("importPath");
          const importName = importMap.get("importName");

          // Get import contract node if exists. Then find its contact or library file.
          // After that, get its function / namespace and if all of it exists, set it to the map.
          const importedContract = otherContracts.find(
            // contractname e.g.: from a.b.c
            (contract) => contract.name === importPath
          );
          if (importedContract) {
            const importedFunction = importedContract.children.get(
              EntitiesType.function
            );
            const importedNamespace = importedContract.children.get(
              EntitiesType.nameSpace
            );

            let isFound = false;

            // Grab function node if it matches with the function call name.
            // we set the key the importNameKey to the key of the map (alias).
            if (importedFunction) {
              const importedFunctionNode = importedFunction.get(funcCallName);
              if (importedFunctionNode) {
                mapOfReferenceCall.set(importNameKey, importedFunctionNode);
                isFound = true;
              }
            }
            // Otherwise, grab namespace node with the import name (e.g.: ERC20)
            // then get the function that matches with the function call name.
            // we set the key to the "{importName}.{funcCallName}"
            // Note that importName can be alias.
            if (importedNamespace && !isFound) {
              const importedNamespaceNode = importedNamespace.get(importName!);
              if (importedNamespaceNode) {
                const importedFunctionNode = importedNamespaceNode.children.get(
                  EntitiesType.function
                );
                if (importedFunctionNode) {
                  const importedFunctionNodeCasted =
                    importedFunctionNode.get(funcCallName);
                  if (importedFunctionNodeCasted) {
                    const key = `${importName}.${funcCallName}`;
                    mapOfReferenceCall.set(key, importedFunctionNodeCasted);
                  }
                }
              }
            }
          }
        });
      });
    }

    // Then, we just iterate through all the function nodes and add them to the map.
    // All import functions will be replaced with functions on the contract.
    if (functionNodes) {
      functionNodes.forEach((functionNode) => {
        mapOfReferenceCall.set(functionNode.name, functionNode);
      });
    }

    return mapOfReferenceCall;
  }

  /**
   * Form child nodes of this node until leaf or no child can be formed recursively.
   * 
   * @param otherContracts imported contracts from the main contract and its depedency.
   */
  public formChildTillLeaf(otherContracts: CairoContractNode[]) {
    // otherContracts: all the imported contracts from the main contract.

    // get the namespace of this root function call.
    const namespace = this.functionCallNodeRoot!.namespaceName;
    const functionName = this.functionCallNodeRoot!.functionCallName;

    // get importNode from contractNode.
    const referenceMap = this.getFunctionCallAndImportNodeMap(
      otherContracts,
      functionName
    );

    // craft the key. either "{functionName}" or "{namespace}.{functionName}"
    const key = namespace ? `${namespace}.${functionName}` : functionName;

    // get the function node from the map.
    const functionNode = referenceMap.get(key);

    // Create a new tree as the child of this tree.
    if (functionNode) {
      // get the root parents (contract node)
      // TODO: add get contract function on the baseNode.
      const rootContractNode = functionNode?.parents[0];
      if (rootContractNode) {
        // create a new tree with the functionNode and its parents.
        // This process will recursively create the tree until no child can be formed.
        const newTrees = FunctionCallTree.createFunctionCallTrees(
          rootContractNode,
          otherContracts,
          functionNode
        );

        // add the new tree to the child tuples. Loop through it.
        this.childs = newTrees;
      }
    }
  }

  /**
   * Create function call trees of all functions in a contract.
   * 
   * @param contractNode the contract node that contains the function call.
   * @param otherContracts the imported contracts results from the parsed main contract.
   * @param functionNode function node that want to be explored
   * @returns return the function call tree.
   */
  public static createFunctionCallTrees(
    contractNode: CairoContractNode,
    otherContracts: CairoContractNode[],
    functionNode: CairoFunctionNode
  ): FunctionCallTree[] {
    // Base Case: if functionNode is a leaf, the node creation process will stop.
    let functionCallTrees: FunctionCallTree[] = [];

    // get all functioncall node first. Loop through all the function call nodes and create a tree for each of them.
    const functionsCallNodes = functionNode.children.get(
      EntitiesType.functionCall
    );

    // Get map value as lis
    if (functionsCallNodes) {
      for (let funcCallNode of functionsCallNodes.values()) {
        const funcCallNodeCasted = funcCallNode as CairoFunctionCallNode;
        const currentTree = new this(contractNode, funcCallNodeCasted, []);
        currentTree.formChildTillLeaf(otherContracts);
        functionCallTrees.push(currentTree);
      }
    }

    // sort the list based on lineNumber of functionCallNodeRoot
    functionCallTrees = functionCallTrees.sort((a, b) => {
      return (
        a.functionCallNodeRoot!.startLine - b.functionCallNodeRoot!.startLine
      );
    });

    return functionCallTrees;
  }
}

export class ParsedContractCollector {

  /**
   *  Create graphviz representation of the contract functions.
   * 
   * @param functionsWithTree
   *   Tuple of function with its function call tree.
   *   e.g.: constructor -> _mint, _go, _lend
   * @returns graphviz representation from the given tree and function.
   */
  public static translateTreeToGraphvizStringForm(
    functionsWithTree: [CairoFunctionNode, FunctionCallTree[]][]
  ): string {
    // TODO: tidy the indentation of the graphviz string.
    let graphvizPlaceholder = `digraph G {
compound=true;
rankdir=LR;

    `;

    // create list of graphviz variable name to avoid duplicate.
    const graphvizVarNames = new Set<string>();

    // Loop through all the functions with their trees.
    for (let [functionNode, trees] of functionsWithTree) {
      const functionName = functionNode.name;

      // Loop through all the trees.
      for (let tree of trees) {
        graphvizPlaceholder += "subgraph cluster_main_" + functionName + " {\n";
        graphvizPlaceholder += `label="${functionName}";\n`;
        const nodeGraphviz = tree.getGraphvizString(graphvizVarNames);
        const arrowVars = nodeGraphviz[0];
        const grapvizString = nodeGraphviz[1];
        graphvizPlaceholder += grapvizString + "\n";

        // arrow vars is a list of all node in the graph that will be connected
        // with arrow in graphviz
        // Loop through all the arrow variables and add them to the graphvizPlaceholder.
        graphvizPlaceholder += arrowVars.join(" -> ");
        graphvizPlaceholder += "}\n";
      }
    }

    graphvizPlaceholder += "}\n";
    return graphvizPlaceholder;
  }

  /**
   *
   * Collect parsed result from the parser that will be passed to the frontend.
   *
   * This is how we do this:
   *  1. Get the main contract
   *  2. Get all of the functions
   *  3. for every function calls, go dive deep until you reach leaf.
   *  4. Do 2 - 3 till the end of each function.
   *
   * @param mainContract The main contract that is being parsed.
   * @param importedContracts The imported contracts that are being parsed.
   * @returns return the parsed result that will be passed to the frontend.
   */
  public static collectParsedResult(
    mainContract: CairoContractNode,
    importedContracts: CairoContractNode[]
  ): string {

    const functions = mainContract.children.get(EntitiesType.function);

    // Build the trees for each function. Parser didn't do this one. In the future, we will do this
    // in parser, see FunctionCallTree class TODO.
    // iterate through functions
    const tupleOfFunctionWithTree: [CairoFunctionNode, FunctionCallTree[]][] =
      [];
    if (functions) {
      for (let func of functions.values()) {
        const functionCallTrees = FunctionCallTree.createFunctionCallTrees(
          mainContract,
          importedContracts,
          func as CairoFunctionNode
        );

        // add it to list
        tupleOfFunctionWithTree.push([
          func as CairoFunctionNode,
          functionCallTrees,
        ]);
      }
    }

    // translate the trees to graphviz string
    const graphvizString =
      ParsedContractCollector.translateTreeToGraphvizStringForm(
        tupleOfFunctionWithTree
      );
    return graphvizString;
  }
}
