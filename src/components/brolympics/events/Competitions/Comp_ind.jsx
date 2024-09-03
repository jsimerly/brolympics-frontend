import React from 'react'

const Comp_ind = ({team, player_1_score, player_2_score, is_complete}) => {
  

  return (
    <div className='flex flex-col px-6 py-3'>
      <h3 className='flex items-center gap-2 pb-1 font-semibold'>
        <img src={team.img} className='rounded-md w-[30px] h-[30px]'/>{team.name}
      </h3>

      {is_complete ?
         <>
          <div className='text-[14px]'>
            <div className='flex'>
              <p>{team.player_1 ? team.player_1.short_name : 'Player 1'}</p>: {player_1_score}
            </div>
            <div className='flex'>
              <p>{team.player_2 ? team.player_2.short_name : 'Player 2'}</p>: {player_2_score}
            </div>
          </div>
         </>
         :
         <div className='text-[12px]'>
          This team has not completed this event yet.
        </div>
      }

    </div>
  )
}

export default Comp_ind