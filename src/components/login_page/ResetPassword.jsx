import { Route, Routes } from "react-router-dom"
import ResetInfo from "./ResetInfo"
import ResetPasswordVerify from "./ResetPasswordVerify"
import { useState } from "react"
import NewPassword from "./NewPassword"


const ResetPassword = () => {
  const [cleanPhoneNumber, setCleanPhoneNumber] = useState()
  
  return (
    <div>
      <div className="flex items-center justify-center w-full h-full">
        <Routes>
          <Route path='/' element={<ResetInfo setCleanPhoneNumber={setCleanPhoneNumber}/>}/>
          <Route path='/verify' element={<ResetPasswordVerify phoneNumber={cleanPhoneNumber}/>}/>
          <Route path='/:uid/:token' element={<NewPassword/>}/>
        </Routes>
      </div>        
    </div>
  )
}

export default ResetPassword