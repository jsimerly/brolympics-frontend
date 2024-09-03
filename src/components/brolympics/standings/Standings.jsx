import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import Gold from '../../../assets/svgs/gold.svg'
import Silver from '../../../assets/svgs/silver.svg'
import Bronze from '../../../assets/svgs/bronze.svg'

import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { fetchStandings } from '../../../api/activeBro/fetchStandings.js'

const Standings = () => {
  const {uuid} = useParams()
  const [standingData, setStandingData] = useState()

  useEffect(()=>{
    const getStandingsInfo = async () => {
      const response = await fetchStandings(uuid)
      if (response.ok){
        const data = await response.json()
        setStandingData(data)
      }
    }
    getStandingsInfo()
  },[])
  

  const getFontSize = (name) => {
    if (name){
      if (name.length <= 12){
        return '20px'
      } else if (name.length <= 16){
        return '18px'
      } else if (name.length <= 20){
        return '16px'
      } else {
        return '14px'
      }
    }
  }
    
  return (
    <div className='px-6 py-3'>
      <div>
        <h2 className='text-[20px] font-bold pb-2'>Overall Standings</h2>
        <table className='w-full border border-neutralLight'>
          <thead>
            <tr className='border text-primary border-neutralLight'>
              <th className='border border-neutralLight w-[60px] p-2'><NumbersOutlinedIcon/></th>
              <th className='pl-6 border border-neutralLight text-start text-[20px]'>Team</th>
              <th className='border border-neutralLight w-[80px]'><DiamondOutlinedIcon/>
              </th>
            </tr>
          </thead>
          <tbody>
            {standingData &&
              standingData.standings
              .sort((a, b) => a.rank - b.rank)
              .map((ranking, i) => (
                <tr key={i+'_row'}>
                <td className='p-3 font-semibold text-center text-[18px] border-r border-neutralLight'>{ranking.rank}</td>
                <td className='pl-3 text-start text-[20px] border-r border-neutralLight'>
                  <div className='flex items-center gap-2'>
                    <img src={ranking.team.img} className='w-[30px] h-[30px] rounded-md'/>
                    <span className={`text-[${getFontSize(ranking.team.name)}]`}>
                      {ranking.team?.name}
                    </span>

                  </div>
                </td>
                <td className='p-2 text-center border-r text-[18px] border-neutralLight'>
                {Number.isInteger(ranking?.total_points) ? ranking.total_points : ranking.total_points.toFixed(1)}</td>
              </tr>
            ))
            
            }
          </tbody>
        </table>
      </div>
      {standingData?.podiums &&
      <div className='py-6'>
        <h2 className='text-[20px] font-bold pb-2'>Event Podiums</h2>
          {standingData?.podiums.length === 0 && 'No events have been completed yet.'}
          <ul className='flex flex-col gap-6'>
          {standingData?.podiums.map((event, i) => (
            <div key={i+"_podium"}>
              <h3 className='font-semibold'>{event.event}</h3>
              <div className='flex flex-col justify-center gap-2 px-2 pt-2'>
                {event.first.map((team, i) => (
                  <div className='flex gap-2' key={`first_`+i}>
                    <img src={Gold} className='h-[20px]'/>
                      {team.name}
                  </div>
                ))}
                {event.second.map((team, i) => (
                  <div className='flex gap-2' key={`second_`+i}>
                    <img src={Silver} className='h-[20px]'/>
                    {team.name}
                  </div>
                ))}
                {event.third.map((team,i) => (
                  <div className='flex gap-2' key={`third_`+i}>
                    <img src={Bronze} className='h-[20px]'/>
                    {team.name}
                  </div>
                ))}

                </div>
            </div>
          ))}
          </ul>
        </div>
      }
      
  </div>
  )
}

export default Standings