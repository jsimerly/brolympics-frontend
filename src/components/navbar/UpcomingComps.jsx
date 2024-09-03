import DataList from './DataList';
import {useNavigate} from 'react-router-dom'

const Card = (info, index, setOpen) => {
    const navigate = useNavigate()
    const onClick = () => {
      navigate(`/b/${info.uuid}/home`)
      setOpen(false)
    }
    
    return(
        <div 
            className='flex items-center w-full gap-3 p-3 rounded-md fex-items-center' 
            key={index+'_comps_upcoming'}
            onClick={onClick}
        > 
            <img src={info.img} className='bg-white h-[40px] w-[40px] rounded-lg text-black'/>
            <div className="flex flex-col">
                <h3 className="text-[18px]">{info.name}</h3>
                <div className='text-[14px] ml-1 opacity-60'>
                    {info.projected_date} @ {info.location}
                </div>
            </div>
        </div>
    );
}


const UpcomingCompetitions = ({upcoming_competitions, setOpen}) => {
    return (
        <>
        {
        upcoming_competitions.length !== 0 &&
            <DataList
                title="Upcoming Competitions"
                data={upcoming_competitions}
                card={Card}
                setOpen={setOpen}
            />
        }
        </>
    )
}

export default UpcomingCompetitions;