import { useState } from "react"
import { PhoneNumberInput } from "../Util/Inputs"
import { fetchResetPassword, fetchResetPasswordVerify, fetchResetPasswordInfo } from "../../api/fetchUser"
import { useNotification } from "../Util/Notification"
import { useNavigate } from "react-router-dom"
import AccountValidator from "../Util/input_validation"

const ResetInfo = ({setCleanPhoneNumber}) => {
    const [phoneNumber, setPhoneNumber] = useState()
    const {showNotification} = useNotification()
    const navigate = useNavigate()

    const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value)

    const validator = new AccountValidator()
    
    
    const onResetClicked = async () => {
        const cleanedPhoneNumber = validator.cleanPhoneNumber(phoneNumber)
        setCleanPhoneNumber(cleanedPhoneNumber)
        const response = await fetchResetPasswordInfo(cleanedPhoneNumber)
        
        if (response.ok){
            navigate('/reset-password/verify')
        } else if (response.status == 404){
            showNotification(
            <p>
                We did not find a user with this phone number. If you're certain this is the correct phone number, 
                <a className='ml-1 font-semibold underline' onClick={()=>navigate('/sign-up')}>please create an account.</a>
            </p>
            )
        } 
        
        else {
            showNotification('There was an issue attempting to reset your password, please check back shortly.')
        }
    }

  return (
    <div className='flex h-[calc(100vh-80px)] bg-offWhite text-neutralDark flex-col items-center justify-center gap-6 p-6'>
        <h2 className="text-[18px] text-center">Enter your phone number to reset your password:</h2>
        <PhoneNumberInput
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
        />
        <button 
            onClick={onResetClicked}
            className="w-3/4 p-2 font-semibold text-white rounded-md bg-primary">
            Reset Password
        </button>
    </div>
  )
}

export default ResetInfo