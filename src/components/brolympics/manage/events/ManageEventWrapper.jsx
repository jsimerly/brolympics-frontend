import {useState} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const ManageEventWrapper = ({name, children}) => {
    const [open, setOpen] = useState(false)

    const onClick = () => {
        setOpen(open => !open)
    }
  return (

    <div className='w-full py-3'>
        <div 
            className='flex justify-between w-full'
            onClick={onClick}
        >
            <h4 className='text-[20px]'>
                {name}
            </h4>
            {open ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
        </div>
        {open &&
            <div>
                <div className='w-full bg-gray-200 h-[1px] mt-3'/>
                <div className='py-3'>
                    {children}
                </div>
            </div>
        }
    </div>
  )
}

export default ManageEventWrapper