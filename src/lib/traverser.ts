/**
 * Traverser class goes here
 */

import * as path from "path";
import * as fs from "fs";


export class CairoFileFinder {
  /**
   * @param {string} currentWorkingDir Absolute or relative path to the current working directory
   * @param {string[]} additionalPaths Absolute or relative paths to additional paths
   *
   * @constructor
   * @memberof CairoFileFinder
   * @description
   * This class is used to find the file path of the import path.
   * This class will traverse through the currentWorkingDir and additionalPaths
   * Return the filepath if found, otherwise return null
   *
   */
  constructor(
    public currentWorkingDir: string,
    public additionalPaths: string[]
  ) {
    this.currentWorkingDir = currentWorkingDir;
    this.additionalPaths = additionalPaths;
  }

    /**
     * Get file path with import path of cairo. e.g: from `a.b.c` import d.
     * 
     * @param {string} importPath
     * @returns {string|null}
     * @memberof CairoFileFinder
     * @description
     * This method will return the file path of the import path.
     * This method will traverse through the currentWorkingDir and additionalPaths
     * Return the filepath if found, otherwise return null
     * 
     */
    public getFilePath(importPath: string): string | null {

        // placeholder if not found
        let filePathReturned = null;

        // Change importPath (a.b.c) into (a/b/c) (with slash)
        const importPathWithSlash = importPath.replace(/\./g, "/");

        // also add .cairo to the end of the path
        const importPathWithCairo = importPathWithSlash + ".cairo";

        // Then check if the importPathWithCairo exists in the currentWorkingDir
        let filePath = path.join(this.currentWorkingDir, importPathWithCairo);
        if (fs.existsSync(filePath)) {
            return filePath;
        }

        // Then check if the importPathWithCairo exists in the additionalPaths
        for (let i = 0; i < this.additionalPaths.length; i++) {
            filePath = path.join(this.additionalPaths[i], importPathWithCairo);
            if (fs.existsSync(filePath)) {
                return filePath;
            }
        }

        //  If not found, return null
        return filePathReturned;
    }
}


/** 
 * Read file from filePath
 * @param {string} filePath
 * @returns {string} the file content
 * 
*/
export function readFile(filePath: string): string {
    return fs.readFileSync(filePath, "utf8");
}

