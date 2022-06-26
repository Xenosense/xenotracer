/**
 * A class that can be inherited from to create a Node
 */
import { EntitiesType } from "./enumCollectionsAndUtils";

export abstract class BaseNode {
  /**
   * The name of the node
   */
  // Map of children of this node
  // The format is {EntitiesType: {"node name": BaseNode}}
  public children: Map<EntitiesType, Map<string, BaseNode>>;

  // End of line number.
  public endLine: number;

  /**
   * Creates an instance of base node.
   * @param name name of the node
   * @param startLine start line of the node
   * @param parents parents node. If you need something to do with parents, you can use this.
   * @param entityType entity type of the node
   */
  constructor(
    public name: string,
    public startLine: number,
    public parents: BaseNode[],
    private entityType: EntitiesType | null = null
  ) {
    this.children = new Map<EntitiesType, Map<string, BaseNode>>();
    this.endLine = 0;
  }

  /**
   * Gets entity type
   * @returns entity type
   */
  public getEntityType(): EntitiesType | null {
    return this.entityType;
  }

  /**
   * A method that is used to change the key of child node.
   * Useful for function that set the name with "" first. (e.g.: function name)
   *
   * @param entityType  the entity type of the child node
   * @param oldKey the old name of the child node
   * @param newKey the new name of the child node
   * @param newObject the new child node
   *
   */
  changeChildKey(
    entityType: EntitiesType,
    oldKey: string,
    newKey: string,
    newObject: BaseNode
  ): void {
    const children = this.children.get(entityType)!;

    children.delete(oldKey);
    children.set(newKey, newObject);
  }

  /**
   * Check if the line that is passed in points out to this node.
   * Override this method to check if the line is a text line that points to this node.
   *
   * @param textLine the line that is passed in
   * @param currentRunningNodeStack current running node stack (parents). Useful if you need to check parents.
   *      (e.g.): you check if a statement is inside a function, you need to check if the function is in the stack.
   *
   * @returns true if the line points to this node. It means that we will
   *      push this node to the stack in parser file.
   */
  static isTextLineThisNode(
    textLine: string,
    currentRunningNodeStack: BaseNode[]
  ): boolean {
    return false;
  }

  /**
   * Create this Node Object.
   * The job of this function is to parse its name, intializing something, etc.
   * OVERRIDE THIS FUNCTION
   *
   * @param textLine the line that is passed in
   * @param lineNumber the line number of the line that is passed in
   */
  static createNode(
    textLine: string,
    lineNumber: number,
    parents: BaseNode[]
  ): BaseNode {
    throw new Error("NOT IMPLEMENTED!");
  }

  /**
   * Process line.
   *
   * @param child the child that is passed in
   */

  addChild(child: BaseNode): void {
    const childName = child.name;
    const childEntityType = child.getEntityType()!;

    // set it to our children
    if (!this.children.has(childEntityType)) {
      this.children.set(childEntityType, new Map<string, BaseNode>());
    }

    const children = this.children.get(childEntityType)!;
    children.set(childName, child);
  }

  /**
   * Process the line that is passed in. Meaning that your core logic will be here.
   *
   * It is also a flag whether
   * the node has ended its processing.
   *
   * @param textLine the line that is passed in
   *
   * @returns true if the node has ended its processing.
   */
  abstract processLine(textLine: string, lineNumber: number): boolean;
}
