
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DataList from './DataList';
import {useNavigate} from 'react-router-dom'


const Card = (league, index, setOpen) => {
  const navigate = useNavigate()
  const onClick = () => {
    navigate(`/league/${league.uuid}`)
    setOpen(false)
  }
  return(
    <div 
      className='flex items-center w-full gap-3 p-3 rounded-md' 
      key={index}
      onClick={onClick}
    > 
      <img src={league.img} className=' h-[40px] w-[40px] rounded-md'/>

      <div className='text-[18px]'>
        {league.name}
      </div>
    </div>
  ) 

}

const LeaguesButtons = ({leagues, setOpen}) => {
  const navigate = useNavigate()
  const addLeagueClick = () => {
    navigate(`/start-league`)
    setOpen(false)
  }
  const AddLeagueButton = () => (
    <button 
      className='flex gap-3 p-3 text-[16px]'
      onClick={addLeagueClick}
    >
      Add League
      <AddCircleOutlineIcon/>
    </button>
  )

  return (
    <div className=''>
      <DataList
        title='Leagues'
        data={leagues}
        card={Card}
        setOpen={setOpen}
      />  
      <AddLeagueButton/>
    </div>
  )
}

export default LeaguesButtons