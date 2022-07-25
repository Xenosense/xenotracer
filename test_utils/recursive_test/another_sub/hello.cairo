

@external
func hello{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }() -> (success: felt):
    return (TRUE)
end
