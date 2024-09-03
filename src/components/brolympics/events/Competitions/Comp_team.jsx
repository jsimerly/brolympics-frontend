import React from 'react'

const Comp_team = ({team, team_score, is_complete}) => {
  return (
    <div className='flex justify-between px-6 py-3'>
      <div className='flex items-center gap-2 font-semibold'>
        <img src={team.img} className='rounded-md w-[30px] h-[30px]'/>
        {team.name}:
      </div>  
      <div>{team_score}</div>
    </div>
  )
}

export default Comp_team