

namespace Interros:
    func total_supply{
            syscall_ptr : felt*,
            pedersen_ptr : HashBuiltin*,
            range_check_ptr
        }() -> ():
        return ()
    end
end


namespace Interros2:
    func total_supply{
            syscall_ptr : felt*,
            pedersen_ptr : HashBuiltin*,
            range_check_ptr
        }() -> ():
        hello_world()
        A.b()
        c.xxx()
        return ()
    end
end

