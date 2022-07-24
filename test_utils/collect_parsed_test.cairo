# SPDX-License-Identifier: MIT
# OpenZeppelin Contracts for Cairo v0.1.0 (token/erc20/ERC20.cairo)

%lang starknet

from starkware.cairo.common.bool import TRUE

from this_cairo.lib import Interros
from this_cairo.hello import TestNamespace


@constructor
func constructor{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(
        name: felt, 
    ):
    Interros.total_supply()
    return ()
end


@external
func function_test_2_levels{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }() -> (success: felt):
    TestNamespace.call_interros()
    return (TRUE)
end
