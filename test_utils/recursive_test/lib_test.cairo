from lib import Interros
from another_sub.hello import hello

namespace ERC20:

    #
    # Initializer
    #

    func initializer{
            syscall_ptr : felt*,
            pedersen_ptr : HashBuiltin*,
            range_check_ptr
        }(
            name: felt,
            symbol: felt,
            decimals: felt
        ):
        ERC20_name.write(name)
        ERC20_symbol.write(symbol)
        with_attr error_message("ERC20: decimals exceed 2^8"):
            assert_lt(decimals, UINT8_MAX)
        end
        ERC20_decimals.write(decimals)
        return ()
    end

    #
    # Public functions
    #

    func name{
            syscall_ptr : felt*,
            pedersen_ptr : HashBuiltin*,
            range_check_ptr
        }() -> (name: felt):
        let (name) = ERC20_name.read()
        return (name)
    end
end
