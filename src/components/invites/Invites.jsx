import { useContext, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Route, Routes,  useLocation } from "react-router-dom"
import LeagueInvite from "./LeagueInvite"
import BrolympicsInvite from "./BrolympicsInvite"
import TeamInvite from "./TeamInvite"
import SignUp from "../login_page/SignUp"
import { fetchCreateUser } from "../../api/fetchUser"

const Invites = () => {
    const {currentUser, setCurrentUser} = useContext(AuthContext)
    const urlLocation = useLocation()
    const returnPath = urlLocation.pathname

    useEffect(() => {
      const getUser = async () => {
        try {
          const response = await fetchUserInformation();
          if (response.ok) {
            const data = await response.json();
            setCurrentUser(data);
          } else {
            setCurrentUser(null);
            navigate('/sign-up')
          }
        } catch (error) {
          setCurrentUser(null);
          navigate('/sign-up')
        }
      }
        
      if (!currentUser){
        getUser()
      }
    },[])
  
  return (
    <div className="bg-offWhite text-neutralDark">
      {currentUser ? 
          <Routes>
            <Route path='league/:uuid' element={<LeagueInvite/>}/>
            <Route path='brolympics/:uuid' element={<BrolympicsInvite/>}/>
            <Route path='team/:uuid' element={<TeamInvite/>}/>
          </Routes>
        :
        <SignUp endPath={returnPath}/>
      }

    </div>
  )
}

export default Invites