import useClickOutside from "./useClickOutside";
import useOpenClose from "./useOpenClose";

const useDropdown = (defaultOpen) => {
    const [open, setOpen, handleOnClick] = useOpenClose(defaultOpen)

    let node = useClickOutside(()=>setOpen(false))

    return [open, setOpen, handleOnClick, node]
}

export default useDropdown