import  {useEffect, useState, useContext} from 'react'
import { Routes, Route } from 'react-router-dom';

import SignUp from './components/login_page/SignUp.jsx';
import Navbar from './components/navbar/Navbar.jsx';
import StartLeague from './components/create_league_page/StartLeague.jsx';
import Brolympics from './components/brolympics/Brolympics.jsx';
import League from './components/brolympics/league/League.jsx';
import Leagues from './components/brolympics/league/Leagues.jsx';
import VerifyPhone from './components/login_page/VerifyPhone.jsx';
import Invites from './components/invites/Invites.jsx';
import {fetchLeagues} from './api/fetchLeague.js'
import Notification, { useNotification } from './components/Util/Notification.jsx';
import { AuthContext } from './context/AuthContext.jsx';
import LeagueRouter from './components/brolympics/league/LeagueRouter.jsx';
import ResetPassword from './components/login_page/ResetPassword.jsx';

function App() {
    const [leagues, setLeagues] = useState([])
    const { notification, showNotification } = useNotification()
    const { currentUser } = useContext(AuthContext)

    useEffect(()=> {
      const getLeagues = async () => {
          const response = await fetchLeagues()
          if (response.ok){
              const data = await response.json()
              setLeagues(data)
          } 
      }

      if(currentUser){
        getLeagues()
      }
    },[currentUser])

  return (
    <div className='min-h-screen text-white bg-neutral'>
      <Navbar leagues={leagues}/>
      {notification.show &&
        <Notification
          message={notification.message}
          className={notification.className}
          onClose={() => showNotification('', '', false)}
        />
      }
      <Routes>
        <Route path='/sign-up/*' element={<SignUp/>}/>
        <Route path='/sign-up/verify' element={<VerifyPhone/>}/>
        <Route path='/start-league' element={<StartLeague/>}/>
        <Route path='/reset-password/*' element={<ResetPassword/>}/>
        <Route path='/' element={<Leagues leagues={leagues}/>}/>
        <Route path='/league/:uuid/*' element={<LeagueRouter/>}/>
        <Route path='/b/:uuid/*' element={<Brolympics/>}></Route>
        <Route path='/invite/*' element={<Invites/>}/>
      </Routes>
    </div>
  )
}

export default App
