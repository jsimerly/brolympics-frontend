import React from 'react'

const ActiveCompetition_team = ({event, name, team}) => {
    return (
        <div className='p-2'>
            <h2 className='pb-2 font-bold'>{event}</h2>
            <div className='flex gap-2'>
                <img src={team.img} className='h-[60px] w-[60px] min-w-[60px] bg-white rounded-md'/>
                <div className='flex items-center font-bold'>
                    {team.name}
                </div>
            </div>
        </div>
      )
    }

export default ActiveCompetition_team