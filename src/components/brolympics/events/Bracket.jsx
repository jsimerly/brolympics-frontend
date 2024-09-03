import BracketNode from "./BracketNode"
import { TeamNode } from "./BracketNode"
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const BracketConnection = ({match1, match2}) => (
    <div className="flex items-center">
        <div className="inline-flex flex-col gap-6">
            <BracketNode match={match1}/>
            <BracketNode match={match2}/>
        </div>  
        <div className="w-[2px] bg-primary h-[110px]"/>
        <div className="h-[2px] bg-primary w-[16px] mr-3"/>
    </div>
)

const Bracket = ({championship, loser_bracket_finals, match_1, match_2, is_active, is_complete}) => {
  return (
    <div className="px-6 pb-6 overflow-auto">
        <div className="flex items-center gap-2">
            <h2 className='font-bold text-[20px]'>Bracket</h2>
            {is_active && <PriorityHighIcon className="text-primary"/>}
        </div>
        <h4 className="text-[12px] pb-2">Winners</h4>
        <div className="flex items-center w-[720px]">
            <BracketConnection
                match1={match_1}
                match2={match_2}
            />
            <BracketNode
                match={championship}
            />
            <div className="pr-3"/>
            <TeamNode name={championship.winner.name} img={championship.winner.img}/>
        </div>
        <h4 className="text-[12px] pb-2 pt-3">
            Losers
        </h4>
        <div className="flex items-center ">
            <BracketNode
                match={loser_bracket_finals}
            />
            <div className="pr-3"/>
            <TeamNode 
                name={loser_bracket_finals.winner.name} img={loser_bracket_finals.winner.img}
            />
        </div>
    </div>
  )
}

export default Bracket