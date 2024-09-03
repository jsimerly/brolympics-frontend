import { useNavigate, useParams } from "react-router-dom"
import {fetchStartComp} from "../../../../api/activeBro/fetchHome"

const AvailableCompetition_ind = ({event, team, uuid, type}) => {
    const navigate = useNavigate()
    const {uuid: broUuid} = useParams()

    const onStartClicked = async () => {
        const response = await fetchStartComp(uuid, type)
        if (response.ok){
            const data = await response.json()
            navigate(`/b/${broUuid}/competition/${data.comp_uuid}`)
        }
    }
    
  return (
    <div className='p-2'>
        <h2 className='pb-2 font-bold'>{event}</h2>
        <div className='flex gap-2'>
            <img src={team.img} className='h-[60px] w-[60px] min-w-[60px] bg-white rounded-md'/>
            <div className='flex items-center font-bold'>
                {team.name}
            </div>
        </div>
        <div className="flex items-center justify-center w-full pt-6">
            <button 
                className='w-1/2 p-2 font-bold rounded-md bg-primary'
                onClick={onStartClicked}
            >
            Start
            </button>
        </div>
    </div>
  )
}

export default AvailableCompetition_ind