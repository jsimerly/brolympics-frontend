import { useContext, useState, useEffect } from "react"
import { PasswordInput } from "../Util/Inputs"
import { useNavigate, useParams } from "react-router-dom"
import AccountValidator from "../Util/input_validation"
import { useNotification } from "../Util/Notification"
import { fetchResetPassword } from "../../api/fetchUser"
import { AuthContext } from "../../context/AuthContext"
import { setCookie } from "../../api/cookies"

const NewPassword = () => {
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState()
    const [errorMessages, setErrorMessages] = useState()
    const handlePasswordChange = (e) => setPassword(e.target.value)

    const navigate = useNavigate()
    const validator = new AccountValidator()

    const {showNotification} = useNotification()
    const {currentUser, setCurrentUser} = useContext(AuthContext)
    const {uid, token} = useParams()

    const handleResetClicked = async () => {
        validator.resetErrors()
        validator.validatePassword(password, setPasswordError)
        
        setErrorMessages(AccountValidator.errors)

        if (validator.errors.length > 0){
            return
        }

        const response = await fetchResetPassword(uid, token, password)
        if (response.ok){
            const data = await response.json()
            setCurrentUser(data.user)
            setCookie('access_token', data.access, 60);
            setCookie('refresh_token', data.refresh, 60 * 24 * 30);

            showNotification('You password has been reset.', '!border-primary')
        } else {
            showNotification('There way an error when attempting to reset your password.')
        }
    }

    useEffect(()=>{
        if (currentUser){
          const endPath = sessionStorage.getItem('returnPath') || '/';
    
          if (endPath){
            navigate(endPath)
            sessionStorage.setItem('returnPath', '/')
          } else {
              navigate('/')
          }
        }
      }, [currentUser])

  return (
    <div className="flex items-center justify-center w-full min-h-[calc(100vh-140px)] p-6 flex-col gap-3">
        <h2 className="text-semibold text-[20px]">Reset Your Password:</h2>
        <div className="w-full text-neutralDark">
            <PasswordInput
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
            />
        </div>

        <button
            className="w-full p-2 font-semibold text-white rounded-md bg-primary"
            onClick={handleResetClicked}
        >
            Reset Password
        </button>
    </div>
  )
}

export default NewPassword