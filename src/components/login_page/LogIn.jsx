
import { AuthContext } from '../../context/AuthContext'
import { useState, useContext } from "react"
import { useNavigate } from 'react-router-dom';
import { PasswordInput, PhoneNumberInput } from "../Util/Inputs"
import AccountValidator from '../Util/input_validation.js';
import ErrorMessages from "./ErrorMessages.jsx";
import loginImg from '../../assets/imgs/login_image.webp'
import { useNotification } from '../Util/Notification';
import { setCookie } from '../../api/cookies.js'


const LogIn = ({password, setPassword, phoneNumber, setPhoneNumber}) => {
    const {login, setCurrentUser} = useContext(AuthContext)
    const { showNotification } = useNotification()

    const [passwordError, setPasswordError] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(false);

    const [errorMessages, setErrorMessages] = useState([])

    const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const navigate = useNavigate()
    const validator = new AccountValidator()    

    const handleSignIn = async () => {
        validator.resetErrors()

        validator.validatePassword(password, setPasswordError)
        validator.validatePhoneNumber(phoneNumber, setPhoneNumberError)

        setErrorMessages(AccountValidator.errors)
        
        if (validator.errors.lenght > 0){
            return
        }

        const cleanedPhoneNumber = validator.cleanPhoneNumber(phoneNumber)
        const response = await login(cleanedPhoneNumber, password)

        if (response.ok){
            const data = await response.json()
            console.log(data)
            setCurrentUser(data)
            setCookie('access_token', data.access, 60);
            setCookie('refresh_token', data.refresh, 60 * 24 * 30);
            const endPath = sessionStorage.getItem('returnPath')

            if (endPath){
                navigate(endPath)
                sessionStorage.setItem('returnPath', '/')
            } else {
                navigate('/')
            }
        } else if (response.status === 401) {    
            showNotification("The phone number or password entered is incorrect.")
        } else {
            showNotification("We ran into an issue while trying to authenticate.")
        }
    }
    
  return (
        <div className="flex flex-col items-center justify-end h-[calc
(100vh-140px)] px-6 absolute translate-x-[100%] w-full">
            <div className="flex items-center flex-1">
                <img src={loginImg} className='max-h-[600px] max-w-screen'/>
            </div>
            <h2 className="text-[20px] font-bold">Sign-In</h2>
            <div className='max-w-[580px] w-full'>
                <div className="flex flex-col w-full gap-4 py-4">
                    <div className="w-full">
                        <PhoneNumberInput 
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            error={phoneNumberError}
                        />
                    </div>
                    <div className="relative">
                        <PasswordInput
                            value={password}
                            onChange={handlePasswordChange}
                            error={passwordError}
                        />
                    </div>
                </div>
                <ErrorMessages errorMessages={errorMessages}/>
                <button 
                    className="w-full p-3 font-bold text-white rounded-md bg-primary"
                    onClick={handleSignIn}
                >
                    Login
                </button>
                <button 
                    className='w-full text-center'
                    onClick={()=> navigate('/reset-password')}>
                    <p className="underline text-[12px] pt-5 pb-7">I've Forgotten My Password</p>
                </button>
            </div>
        </div>
  )
}

export default LogIn