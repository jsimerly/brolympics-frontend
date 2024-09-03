import { fetchResetPasswordVerify } from '../../api/fetchUser'
import React, { useState, useRef, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNotification } from '../Util/Notification.jsx';

const ResetPasswordVerify = ({phoneNumber}) => {
    const initialState = Array(6).fill(''); 
    const [code, setCode] = useState(initialState);
    const inputRefs = Array.from({length: 6}, () => useRef(null)); 
    const {showNotification} = useNotification()
    const navigate = useNavigate()

    const handleChange = (value, slot) => {
        if (/^[0-9\b]+$/.test(value) || value === "") { 
          const newCode = [...code]; 
          newCode[slot] = value;
          setCode(newCode); 
        }
    
        if (value && slot < 5) inputRefs[slot + 1].current.focus();
    }
    

    const verifyCode = async () => {
        console.log(code)
        const response = await fetchResetPasswordVerify(phoneNumber, code.join(''))
        
        if (response.ok){
          const data = await response.json()
          navigate(`/reset-password/${data.uid}/${data.token}`)
        } else {
          showNotification("We ran into an issue while trying to authenticate.")
        }
      }
    
    const handleKeyDown = (e, slot) => {
        if (e.key === "Backspace" && !code[slot] && slot > 0) {
            inputRefs[slot - 1].current.focus();
        }
        if (e.key === "Enter") {
            e.preventDefault()
            verifyCode()
        }
    }
    
    const goBack = () => {
        navigate('/sign-up')
    }

    useEffect(() => {
    inputRefs[0].current.focus(); 
    }, []);

    
  return (
    <div
        className='flex flex-col items-center justify-between min-h-[calc(100vh-80px)] p-6 w-screen'
    >
        <div className='fixed w-full pl-6' onClick={goBack}> <ArrowBackIcon/> Back </div>
        <div/>
        <div className='h-[200px]'>
            <h2 className='w-full text-center text-[20px]'> Verify Your Phone Number</h2>
            <div className='flex justify-center gap-4 mt-4'>
                {code.map((digit, index) => (
                    <div className='flex flex-col' key={index}>
                        <input 
                            type="number" 
                            value={digit} 
                            onChange={(e) => handleChange(e.target.value, index)} 
                            maxLength="1"
                            className='w-10 h-16 text-center rounded outline-none bg-neutralLight text-[20px] font-bold'
                            ref={inputRefs[index]}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    </div>

                ))}
            </div>
        </div>
        <button 
          className='w-full p-3 mt-4 text-white rounded-md bg-primary'
          onClick={verifyCode}
          disabled={code.includes('')}
        >
            Verify
        </button>
    </div>
  )
}

export default ResetPasswordVerify