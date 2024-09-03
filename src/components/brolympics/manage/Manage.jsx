import { useNavigate } from "react-router-dom"

const ManageButton = ({header, desc, nav}) => {
    const navigate = useNavigate()
    const onClick = () => {
        navigate(nav)    
    }

    return (
    <div 
        className='w-full p-3 border rounded-md border-primary'
        onClick={onClick}
    >
        <h2 className='font-semibold text-[16px]'>{header}</h2>
        <p className='text-[12px]'>{desc}</p>
    </div>
    )
}

const Manage = () => {

  return (
    <div className='flex flex-col gap-3'>
        <ManageButton 
            header='Manage Brolympics' 
            desc={'Manage your Brolympics settings including: start date, end date, invites, etc.'}
            nav={'manage-brolympics'}
        />
        <ManageButton 
            header='Manage Events' 
            desc={'Manage your events rules and settings including: scoring, number of matches, availablility, etc.'}
            nav={'manage-events'}
        />
        <ManageButton 
            header='Manage Teams' 
            desc={'Manage the teams in this Brolympics including: moving partners, sending invites for team, deleting teams.'}
            nav={'manage-teams'}
        />
        <ManageButton 
            header='Edit Overall Standings & Points' 
            desc={'Update the overall standings or points for this Brolympics.'}
            nav={'edit-overall'}
        />
        <ManageButton 
            header='Edit Event Standings & Points' 
            desc={'Edit event standings and points for this Brolympics.'}
            nav={'edit-event'}
        />
        <ManageButton 
            header='Edit Competitions' 
            desc={'Edit competition results or matchups for this Brolympics'}
            nav={'edit-competition'}
        />
        <ManageButton 
            header='Edit Brackets' 
            desc={'Edit bracket results or matchups for this Brolympics'}
            nav={'edit-bracket'}
        />
    </div>
  )
}

export default Manage