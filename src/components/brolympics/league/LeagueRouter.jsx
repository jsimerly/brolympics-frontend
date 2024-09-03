import Gold from '../../../assets/svgs/gold.svg'
import Silver from '../../../assets/svgs/silver.svg'
import Bronze from '../../../assets/svgs/bronze.svg'
import { Routes, Route} from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {fetchLeagueInfo} from '../../../api/fetchLeague.js'
import CreateBrolympicsManager from './CreateBrolympicsManager'
import LeagueSettings from './LeagueSettings'
import League from './League'



const LeagueRouter = () => {
    const [leagueInfo, setLeagueInfo] = useState()
    const navigate = useNavigate()
    const {uuid} = useParams()
    
    useEffect(() => {
       const getLeagueInfo = async () => {
        const response = await fetchLeagueInfo(uuid)
        
        if (response.ok){
            const data = await response.json()
            setLeagueInfo(data)
        } else {
            const data = await response.json()
            console.log('error')
        }
       } 
       getLeagueInfo()
    },[uuid])

  return (
    <div className='min-h-[calc(100vh-80px)]'>
        <Routes>
            <Route path='/' element={<League/>}/>
            <Route path='/league-settings' element={<LeagueSettings/>}/>
            <Route path='/create-brolympics' element={<CreateBrolympicsManager/>}/>
        </Routes>
    </div>
  )
}

export default LeagueRouter