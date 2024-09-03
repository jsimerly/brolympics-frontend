import { useState } from 'react'

const useOpenClose = (defaultOpen) => {
    const [open, setOpen] = useState(defaultOpen)

    const handleOnClick = () => {
        setOpen(!open)
    }

    return [open, setOpen, handleOnClick]
}

export default useOpenClose