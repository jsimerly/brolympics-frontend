import React, { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchVerifyPhone } from '../../api/fetchUser.js'
import { AuthContext } from '../../context/AuthContext.jsx';
import { useNotification } from '../Util/Notification.jsx';
import { setCookie } from '../../api/cookies.js';

const VerifyPhone = ({route, navigation}) => {
  const initialState = Array(6).fill(''); 
  const [code, setCode] = useState(initialState);
  const inputRefs = Array.from({length: 6}, () => useRef(null)); 
  const {setCurrentUser, currentUser} = useContext(AuthContext)
  const {showNotification} = useNotification()

  const [displayHelpText, setDisplayHelpText] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayHelpText(true)
    }, 7000)

    return () => clearTimeout(timer)
  })

  const navigate = useNavigate()

  const handleChange = (value, slot) => {
    if (/^[0-9\b]+$/.test(value) || value === "") { 
      const newCode = [...code]; 
      newCode[slot] = value;
      setCode(newCode); 
    }

    if (value && slot < 5) inputRefs[slot + 1].current.focus();
  }

  const location = useLocation()
  const {phoneNumber, firstName, lastName, password} = location.state
  
  const verifyCode = async () => {
    const response = await fetchVerifyPhone(phoneNumber, firstName, lastName, password, code.join(''))
    
    if (response.status === 201){
      const data = await response.json()
      setCurrentUser(data.user)
      setCookie('access_token', data.access, 60);
      setCookie('refresh_token', data.refresh, 60 * 24 * 30);
      console.log(data.access)
      console.log(data.refresh)
      console.log(data.user)
      

      showNotification('You account has been created.', '!border-primary')
    } else {
      showNotification("We ran into an issue while trying to authenticate.")
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
            {displayHelpText && 
                <div className='flex items-center justify-center w-full gap-3 mt-6'>
                    <HelpOutlineIcon/> I never received a text.
                </div>
            }
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

export default VerifyPhone
