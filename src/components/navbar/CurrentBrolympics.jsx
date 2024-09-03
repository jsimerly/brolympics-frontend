import DataList from './DataList';
import {useNavigate} from 'react-router-dom'

const Card = (info, index, setOpen) => {
    const navigate = useNavigate()
    const onClick = () => {
      navigate(`/b/${info.uuid}/home`)
      setOpen(false)
    }

    const formatDate = (dateString) => {
        const options = {month: 'short', day:'numeric'}
        return new Date(dateString).toLocaleDateString(undefined, options)
    }
    
    return(
        <div 
            className='flex items-center w-full gap-3 p-3 rounded-md' 
            key={index}
            onClick={onClick}
        > 
            <img src={info.img} className='bg-white h-[40px] w-[40px] rounded-lg text-black'/>
            <div className="flex flex-col">
                <h3 className="text-[18px]">{info.name}</h3>
                <div className='text-[14px] opacity-60'>
                    {info.projected_start_date && formatDate(info.projected_start_date)}
                    {info.projected_start_date && info.projected_end_date && ' - '}
                    {info.projected_end_date && formatDate(info.projected_end_date)}
                </div>
            </div>
        </div>
    );
}

const CurrentBrolympics = ({current_brolympics, setOpen}) => {

    return (
        <>
        {
            current_brolympics.length !== 0 &&
            <DataList
                title="Current Brolympics"
                data={current_brolympics}
                card={Card}
                setOpen={setOpen}
            /> 
        }
        </>
    )
}

export default CurrentBrolympics;