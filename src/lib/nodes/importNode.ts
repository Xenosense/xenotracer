/**
 * A collections of Node
 */
import { BaseNode } from "../base";
import { EntitiesType } from "../enumCollectionsAndUtils";

export default class CairoImportNode extends BaseNode {
  public imports: Map<string, Map<string, string>>;
  /**
   * Creates an instance of Import Node node.
   * We wont make this node as the child of any node.
   *
   * @param name name of the node. This will contains `import` - line number: e.g.: import-3
   * @param startLine start line of the node
   * @param parents parents node. If you need something to do with parents, you can use this.
   * @param imports imports object (key: alias or real name, value: dictionary of import path and import name)
   */
  constructor(
    name: string,
    startLine: number,
    parents: BaseNode[],
    imports: Map<string, Map<string, string>>
  ) {
    super(name, startLine, parents, EntitiesType.import);
    this.imports = imports;
  }

  /**
   * Check if the format is correct.
   * Import should have this kind of format, check with regex
   * from .... import ....
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
    // check it the line have pattern from .... import ....
    return /^from\s+[\w\d\s\.]+\s+import\s+[\w\d\s\.,]+/.test(textLine);
  }

  /**
   * This function will always return True
   * Before that, change our parent node child. First, we remove
   * the current node from the parent node children. (remove key import-linenumber)
   * Then, we add key with each import in line.
   * e.g.: from a import b,c,d
   *
   * We add b,c,d to our parent node children (entitiestype.import) , they will have this
   * object as value
   *
   * @param textLine text line
   * @param lineNumber line number
   * @returns always return TRUE. meaning it's done for every line
   */
  processLine(textLine: string, lineNumber: number): boolean {
    // remove the current node from the parent node children.
    // get the parent node (the last index)
    const parentNode = this.parents[this.parents.length - 1];

    // remove the current node from the parent node children.
    // get the children of parentNode from its map (entitesType)
    const importChildren = parentNode.children.get(this.getEntityType()!);

    // remove the current node from the parent node children. key is this.name
    importChildren!.delete(this.name);

    // Add the import to the parent node children. For Each this.imports keys
    // refer to this object
    this.imports.forEach((_, importName) => {
      importChildren!.set(importName, this);
    });
    return true;
  }

  /**
   * Create node for Import Node
   *
   * @param textLine should be empty string.
   * @param lineNumber
   * @param parents
   *
   * @returns a new Comment Node
   */
  static createNode(
    textLine: string,
    lineNumber: number,
    parents: BaseNode[]
  ): BaseNode {
    // Parse textLine, take import path and import name with its alias
    // e.g.: from a import b,c,d as e
    // b,c,d is the import name, e is the alias
    // if alias is presents (as e) extract it
    // Do regex first make sure to get all of import path and import name
    // e.g.: from a import b,c,d as e

    const reg = /^from\s+([\w\d\s\.]+)\s+import\s+([\w\d\s.,]+)/;

    const match = textLine.match(reg);
    // we assume that the import path is the first group
    const importPath = match![1];

    // we assume that the import name is the second group, we need to split it
    const importNames = match![2].split(",");

    // we construct imports placeholder object.
    // key: alias or real name, value: dictionary of import path and import name
    const imports: Map<string, Map<string, string>> = new Map();

    // Loop through importNames and add it to imports object
    // check if it has 'as', if it has, we will add it to the alias (key)
    // if it doesn't have 'as', we will add it to the real name (key)
    // e.g.: b,c,d as e
    // b,c,d is the import name, e is the alias

    importNames.forEach((importName) => {
      const reg = /^\s*([\w\d\.]+)\s*(as\s*([\w\d\s\.]+))?/;
      const match = importName.trim().match(reg);
      const importNameFound = match![1];
      const alias = match![3];
      if (alias) {
        // if alias is presents (as e) add it to the imports object
        // also put importPath and importName as its value
        const newMap = new Map([
          ["importPath", importPath],
          ["importName", importNameFound],
        ]);
        imports.set(alias, newMap);
      } else {
        // if alias is not presents (as e) add it to the imports object
        // also put importPath and importName as its value
        const newMap = new Map([
          ["importPath", importPath],
          ["importName", importNameFound],
        ]);
        imports.set(importNameFound, newMap);
      }
    });
    return new CairoImportNode(
      "import-" + lineNumber,
      lineNumber,
      parents,
      imports
    );
  }
}
