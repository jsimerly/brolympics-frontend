
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import {useState} from 'react'
import CopyWrapper from '../../Util/CopyWrapper';
import PopupContinue from '../../Util/PopupContinue';

import {fetchCreateSingleTeam, fetchDeleteTeam, fetchRemovePlayer} from '../../../api/fetchTeam.js'


export const TeamCard = ({name, player_1, player_2, img, uuid}) => {
    const [editing, setEditing] = useState(false)
    const toggleEditing = () => {
        setEditing(editing => !editing)
    }    
    
    const onRemovePlayer = (player) => {
        setRemovePlayer(player)
        setPopupPlayerOpen(true)
    }
    const removePlayerFunc = async () => {
        const response = await fetchRemovePlayer(removePlayer.uuid, uuid)
        if (response.ok){
            location.reload()
        }
    }

    const deleteClicked = () => {
        setPopupTeamOpen(true)
    }

    const deleteTeamFunc = async () => {
        const response = await fetchDeleteTeam(uuid)
        if (response.ok){
            location.reload()
        }
    }

    const [popupTeamOpen, setPopupTeamOpen] = useState(false)
    const [popupPlayerOpen, setPopupPlayerOpen] = useState(false)
    const [removePlayer, setRemovePlayer] = useState()
    
    return(
        <div className='relative flex items-center gap-3 p-2 border rounded-md border-primary'>
            <div className={`relative ${editing ? 'min-[80px] w-[80px] h-[80px]' : 'min-w-[60px] w-[60px] h-[60px]'} rounded-md`}>
                <img 
                    src={img}
                    className={`w-full h-full bg-white rounded-md  ${editing ? 'min-w-[80px] h-[80px]' : 'min-w-[60px] h-[60px]'} `}
                />
                {editing &&
                    <CameraAltIcon sx={{fontSize:40}} className='absolute z-20 w-full h-full transform -translate-x-1/2 -translate-y-1/2 opacity-80 text-neutral top-1/2 left-1/2'/>
                }
            </div>
            <div className='flex items-start justify-between w-full min-h-[60px]'>
                <div>
                    <h3 className='font-bold text-[18px]'>{name}</h3>
                    <div className='text-[16px]'>
                        {editing ? 
                            <div className='flex flex-col'>
                                {player_1 &&
                                    <div
                                        onClick={()=>onRemovePlayer(player_1)}
                                    >
                                        <RemoveIcon className='text-errorRed' sx={{fontSize:20}}/>
                                        {player_1.full_name}
                                    </div>                              
                                }

                                {player_2 &&
                                    <div
                                        onClick={()=>onRemovePlayer(player_2)}
                                    >
                                        <RemoveIcon className='text-errorRed' sx={{fontSize:20}}/>
                                        {player_2.full_name}
                                    </div>
                                }

                            </div>
                            :
                            <div className='text-[14px] font-semibold'>
                                {player_1 && player_1.short_name}
                                {player_1 && player_2 && <span className='text-[12px] font-normal'> & </span>} 
                                {player_2 && player_2.short_name}
                            </div>
                        }
                    </div>
                </div>
                <button 
                    className='absolute flex right-2 top-2'
                    onClick={toggleEditing}
                >
                    {editing ?
                        <CloseIcon sx={{fontSize:20}}/>
                        :
                        <EditIcon sx={{fontSize:20}}/>
                    }
                </button>
                {editing &&
                    <button 
                        className='p-1 px-2 text-white rounded-md bg-errorRed text-[12px] mt-3 absolute bottom-2 right-2'
                        onClick={deleteClicked}
                    >
                        Delete Team
                    </button>
                }
                {!editing && !(player_1 && player_2) &&
                    <div className='absolute bottom-2 right-2 text-primary text-[12px] border-primary border p-1 rounded-md flex items-center gap-1'>
                        <CopyWrapper
                            copyString={`https://brolympic.com/invite/team/${uuid}`}
                            size={20}
                        >
                            <span className='mr-1'>Copy Invite Link</span>
                        </CopyWrapper>
                    </div>
                }
            </div>
            <PopupContinue 
                open={popupTeamOpen}
                setOpen={setPopupTeamOpen}
                header={'Delete this Team?'}
                desc={'Doing this will perminately delete this team.'}
                continueText={'Delete'}
                continueFunc={deleteTeamFunc}
            />
            <PopupContinue 
                open={popupPlayerOpen}
                setOpen={setPopupPlayerOpen}
                header={`Remove ${removePlayer && removePlayer.full_name} from this team?`}
                desc={`Doing this will perminately remove ${removePlayer && removePlayer.first_name}. If you do, you can always add them back to the team later.`}
                continueText={'Delete'}
                continueFunc={removePlayerFunc}
            />
        </div>
    )
}



const ManageTeams = ({teams, broUUID}) => {
    const [addingTeam, setAddingTeam] = useState(false)
    const toggleAddingTeam = () => {
        setAddingTeam(addingTeam => !addingTeam)
    }
    
    const [teamName, setTeamName] = useState('')
    const handleChangeTeamName = (e) => {
        setTeamName(e.target.value)
    }
    const handleCreateTeamClicked = async () => {
        const response = await fetchCreateSingleTeam(teamName, broUUID)

        if (response.ok){
            const data = await response.json()
            location.reload()
        } else {
            const data = await response.json()
            console.log(data)
        }
    }    
    
    
  return (
    <div className=''>
        <h2 className='font-bold text-[16px]'>Manage Teams</h2>
        {teams ?
            <div className='my-2 space-y-3'>
                {teams.map((team, i) => (
                    <TeamCard {...team} key={i+'_teamsCard'}/>
                ))}
            </div>
            :
            'There are no teams in this league yet.'
        }

        <button
            className='flex gap-3  text-[16px] text-neutralLight'
            onClick={toggleAddingTeam}
        >
            Add Team
            {addingTeam ? <RemoveIcon/> : <AddCircleOutlineIcon/> }
            
        </button>
        {addingTeam &&
            <div className=''>
                <h4 className='font-semibold'> Team Name </h4>
                <input 
                    value={teamName}
                    onChange={handleChangeTeamName}   
                    placeholder='Team Name'
                    className='w-full p-2 border rounded-md outline-none border-primary'
                />
                <button 
                    className='w-full p-3 mt-3 font-semibold text-white rounded-md bg-primary'
                    onClick={handleCreateTeamClicked}
                >
                    Create Team
                </button>
            </div>
        }
    </div>
  )
}

export default ManageTeams