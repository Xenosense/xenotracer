from this_cairo.lib import Interros


namespace TestNamespace:

    #
    # For testing purpose.
    # Call interros so the visualization has 2 levels of hierarchy
    #

    func call_interros{
            syscall_ptr : felt*,
            pedersen_ptr : HashBuiltin*,
            range_check_ptr
        }():
        Interros.total_supply()
        return ()
    end
end
