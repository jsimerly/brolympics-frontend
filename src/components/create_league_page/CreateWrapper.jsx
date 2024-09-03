import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const CreateWrapper = ({button_text, step, submit, title, description, grey_out=false, children}) => {
  return (
    <div 
        className={`absolute flex flex-col items-center justify-between w-full p-6 h-[calc(100vh-160px)]
        `}
        style={{transform: `translateX(${100 * (step-1)}%)`}}        
    >
        <div className='w-full'>
            <h2 className='text-[20px] font-bold'>{title}</h2>
            <p className='text-[11px]'>
                {description}
            </p>
            <div className='w-full py-3'>
                {children}
            </div>
        </div>
        <button 
            className={`flex justify-between w-full p-3  font-bold text-white rounded-md  ${grey_out ? 'bg-neutralLight' : 'bg-primary'}`}
            onClick={submit}
        >
        <div className='pr-6'/>
            {button_text}
            <ArrowForwardIcon/>
        </button>
    </div>
  )
}

export default CreateWrapper