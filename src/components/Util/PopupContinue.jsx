import React from 'react'
import useClickOutside from '../../hooks/useClickOutside'
import CloseIcon from '@mui/icons-material/Close';

const PopupContinue = ({ open, setOpen, header, desc, continueText, continueFunc }) => {
    const close = () => {
        setOpen(false)
    }

    const continueClicked = () => {
        setOpen(false)
        continueFunc()
    }

    let node = useClickOutside(close)
    
  return (
    open &&
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div 
        className="relative z-30 p-6 mx-6 bg-white rounded-md shadow-xl"
        ref={node}
    >
        <h2 className="mb-4 text-2xl font-bold">{header}</h2>
        <p className="mb-6">{desc}</p>
        <div className='flex gap-3'>
            <button 
                className='p-2 border rounded-md border-primary min-w-[100px]'
                onClick={close}
            >
                Cancel
            </button>
            <button 
                className="min-w-[100px] p-2 font-semibold rounded  bg-errorRed"
                onClick={continueClicked}
            >
            {continueText}
            </button>
        </div>
        <button className='absolute top-2 right-2' onClick={close}>
            <CloseIcon/>
        </button>
      </div>
    </div>
  );
};

export default PopupContinue;
