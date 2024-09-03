

const Comp_h2h = ({team_1, team_1_score, team_2, team_2_score, winner, is_active, is_complete}) => {
    
    const getFontSize = (name) => {
        if (name) {
            if (name.length <= 10) {
                return '16px';
            } else if (name.length <= 16) {
                return '14px';
            } else if (name.length <= 20) {
                return '12px';
            } else {
                return '10px'
            }
        }
    }

  return (
    <div 
        className={`flex items-center justify-center py-3 px-6
        bg-neutral  ${is_active && 'bg-neutralLight'}`}
    >
        <div className='flex items-center justify-center w-full'>
            <div 
                className={`w-2/5 ${team_1.uuid === winner?.uuid ? 'font-bold text-primaryLight' : ''}`}
                style={{fontSize : getFontSize(team_1.name)}}
            > 
                {team_1.name}
            </div>
            <div className='w-1/5 text-center'>
                {is_complete ? 
                    <>
                    <span className={`${team_1.uuid === winner?.uuid ? 'font-bold text-primaryLight' : ''}`}>{team_1_score}</span>
                    <span className="px-1">:</span> 
                    <span className={`${team_2.uuid === winner?.uuid ? 'font-bold text-primaryLight' : ''} `}>{team_2_score}</span>
                    </>
                    : 
                    'vs'
                }

            </div>
            <div 
                className={`w-2/5 ${team_2.uuid === winner?.uuid ? 'font-bold text-primaryLight' : ''} text-end`}
                style={{fontSize : getFontSize(team_2.name)}}
            > 
                {team_2.name}
            </div> 
        </div>

    </div>
  )
}

export default Comp_h2h