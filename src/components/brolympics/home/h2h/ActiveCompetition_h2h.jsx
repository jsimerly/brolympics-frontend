
import TeamsBlock from './TeamBlock';

const ActiveCompetition_h2h = ({event, team_1, team_2, uuid, type, is_bracket, team_1_seed, team_2_seed}) => {
  const createRecordString = (team) => {
    const wins = team.wins
    const losses = team.losses
    const ties = team.ties

    return `${wins}-${losses}` + (ties ? `-${ties}` : '');
  }


  return (
    <div className='p-2'>
      <TeamsBlock
        name={event}
        team_1_name={team_1.name}
        team_1_record={createRecordString(team_1)}
        team_1_img={team_1.img}
        team_1_seed={team_1_seed}

        team_2_name={team_2.name}
        team_2_record={createRecordString(team_2)}
        team_2_img={team_2.img}
        team_2_seed={team_2_seed}
        is_bracket={is_bracket}
      />
    </div>
  )
}

export default ActiveCompetition_h2h