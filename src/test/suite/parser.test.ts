/**
 * All parser test goes here
 */

 import * as path from "path";

 import { CairoParser } from "./../../lib/parser";
 import { EntitiesType } from "./../../lib/enumCollectionsAndUtils";
 
 import * as fs from "fs";
 import * as assert from "assert";
 
 suite("Parser Test Suite", () => {
   test("test-parse-erc20-file", () => {
     // Test parser to parse a real .cairo contract
     // For now, we just test if the parser can parse a real .cairo contract without error
     let parser = new CairoParser();
 
     // first, we read the contract from a file on test_utils/ERC20.cairo.
     const pathFile = path.resolve(__dirname, "../../../test_utils/ERC20.cairo");
     const text = fs.readFileSync(pathFile, "utf8");
 
     // It will throw error if it doesn't parse correctly!
     parser.parseAFile(text, "ERC20.cairo");
 
     // CHeck if total of main contract's function is correct
     // Which is 12
     const mainContract = parser.getMainContract();
     const childrenFunctions = mainContract?.children.get(EntitiesType.function);
 
     // childrenFunction is a map of function nodes, calculate its length
     // Then assert to 12
     assert.equal(childrenFunctions?.size, 12);
   });
 
   /**
    * Get a function node name after its initialized
    */
   test("test-parse-function-name", () => {
     let parser = new CairoParser();
 
     const text = `
     @external
     func increaseAllowance{
             syscall_ptr : felt*,
             pedersen_ptr : HashBuiltin*,
             range_check_ptr
         }(spender: felt, added_value: Uint256) -> (success: felt):
         ERC20.increase_allowance(spender, added_value)
         return (TRUE)
     end
     `;
     const test = EntitiesType;
     parser.parseAFile(text, "ERC20.cairo");
 
     const funcName = parser
       .getMainContract()
       ?.children.get(EntitiesType.function)
       ?.get("increaseAllowance")!.name;
 
     assert(funcName === "increaseAllowance");
   });
 });
 