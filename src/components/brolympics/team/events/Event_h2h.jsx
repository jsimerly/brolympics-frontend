import EventWrapper from './EventWrapper';

const Matchup = ({team, team_1, team_1_score, team_2, team_2_score, winner, is_active}) => {
    const getFontSize = (name) => {
        if (name) {
            if (name.length <= 10) {
                return '16px';
            } else if (name.length <= 16) {
                return '16px';
            } else if (name.length <= 20) {
                return '14px';
            } else {
                return '12px'
            }
        }
    }

    let team_1_text;
    switch (true) {
        case team_1.uuid == winner?.uuid && team_1.uuid == team:
            team_1_text = 'text-primaryLight font-semibold';
            break;
        case team_2.uuid == winner?.uuid && team_1.uuid == team:
            team_1_text = 'text-errorRedLight'
            break
        default:
            team_1_text = '';
    }

    let team_2_text;
    switch (true) {
        case team_2.uuid == winner?.uuid && team_2.uuid == team:
            team_2_text = 'text-primaryLight font-semibold';
            break;
        case team_1.uuid == winner && team_2.uuid == team:
            team_2_text = 'text-errorRedLight'
            break
        default:
            team_2_text = '';
    }


    return(
        <div 
            className={`flex items-center justify-center px-1 
                ${is_active && 'border rounded-md'}
            `}
        >
            <div className='flex items-center justify-center w-full'>
                <div className={`w-2/5 ${team_1_text}`} style={{fontSize : getFontSize(team_1.name)}}> 
                    {team_1.name}
                </div>
                <div className='flex items-center justify-center w-1/5 text-center'>
                    <span className={`${team_1_text} w-2/3`}>{team_1_score}</span>
                    <span className='w-1/5'>:</span>
                    <span className={`${team_2_text} w-2/3`}>{team_2_score}</span>
                </div>
                <div className={` ${team_2_text} w-2/5 text-end`} style={{fontSize : getFontSize(team_2.name)}}> 
                    {team_2.name}
                </div> 
            </div>

        </div>
    )
}
    

const EventDropdown_H2h = ({decimal_places, score_for, score_against, sos_wins, sos_losses, comps, is_active, team}) => (
    <div className={`py-2 border-t`}>
        <div className='flex justify-between'>
            <div className='w-1/2'>
                <h3 className='font-semibold'>Margin</h3>
                <div className='grid grid-cols-2'>
                    <div>Pts For</div><div>{score_for} pts</div>
                    <div>Pts Against</div><div>{score_against} pts</div>
                </div>
            </div>
            <div className='w-1/2'>
                <h3 className='font-semibold'>Strengh of Schedule</h3>
                <div className='grid grid-cols-2'>
                    <div>Wins</div><div>{sos_wins} </div>
                    <div>Losses</div><div>{sos_losses} </div>
                </div>
            </div>
        </div>
        <h4 className='pt-2 font-semibold'>Competitions</h4>    
        <div className='flex flex-col gap-1 py-1'>
            {comps.map((comp, i) => (
                <Matchup {...comp} team={team} key={i+'_team_matchup'}/>
            ))}
            {comps.length === 0 && 'Event has not started yet.'}
        </div>
    </div>
)


const Event_h2h = ({name, decimal_places, wins, losses, ties, score_for, score_against, sos_losses, sos_wins, rank, points, is_final, is_active, comps, team}) => {
    
    return (
        <EventWrapper
            name={name}
            rank={rank}
            points={points}
            display_score={wins+'-'+losses}
            is_active={is_active}
            is_final={is_final}
        >
            <EventDropdown_H2h 
                decimal_places={decimal_places}
                score_for={score_for}
                score_against={score_against}
                sos_wins={sos_wins}
                sos_losses={sos_losses}
                comps={comps}
                is_active={is_active}
                team={team}
            />
        </EventWrapper>
    )
}

export default Event_h2h