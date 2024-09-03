import {useState, useContext} from 'react'
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthContext } from '../../context/AuthContext'



const Account = ({setView}) => {
    const {currentUser, logout} = useContext(AuthContext)
    const [userInfo, setUserInfo] = useState(currentUser)
    const handleFirstNameChange = (e) => {
        setUserInfo(prevState => ({
          ...prevState,
          first_name: e.target.value
        }));
      };
    const handleLastNameChange = (e) => {
        setUserInfo(prevState => ({
            ...prevState,
            last_name: e.target.value
        }));
    };
    const handleEmailChange = (e) => {
        setUserInfo(prevState => ({
            ...prevState,
            email: e.target.value
        }));
    }

    const handleSave = () => {
        console.log(userInfo)
        setOpenName(false)
    }

    const handleLogout = () => {
        console.log('logout')
        logout()
    }

    const [openName, setOpenName] = useState(false)
    const handleEditClick = () => {
        setOpenName(true)
    }
    

    const goBack = () => {
        setView('leagues')
    }
 
  return (
    <div className='flex flex-col h-[calc(100vh-80px)] bg-neutral text-white opacity-[99%] px-6 py-3 gap-3'>
        <div onClick={goBack}> <ArrowBackIcon/> Back </div>
        <div 
            className='flex flex-wrap items-center justify-center w-full p-6 border rounded-md border-primary'
        >
            { openName ?
                <div className='flex items-center gap-3'>
                    <input
                        className='w-1/2 p-1 rounded-md bg-neutralLight'
                        value={userInfo.first_name}
                        placeholder='First Name'
                        onChange={handleFirstNameChange}
                    />
                    <input
                        className='w-1/2 p-1 rounded-md bg-neutralLight'
                        value={userInfo.last_name}
                        placeholder='Last Name'
                        onChange={handleLastNameChange}
                    />
                    <div onClick={handleSave}>
                        <SaveIcon className='text-primary'/>
                    </div>
                    
                </div>
                :
                <div className='w-full'>
                    <h2 className='font-bold text-[26px] flex leading-none items-center justify-start gap-3' >
                        {userInfo.first_name} {userInfo.last_name} 
                        <EditIcon 
                            sx={{fontSize: 20}}
                            onClick={handleEditClick}
                        />
                    </h2>
                    
                </div>
            }
            <span className='text-[14px] w-full text-start pt-2'>Account Owner</span>
        </div>
        <h1 className='text-[20px] font-bold'>
                Account Information
        </h1>
        <div>
            <h3>Phone</h3>
            <div className='text-[20px] flex gap-2 items-end'>
                {userInfo.phone}
                <span className='text-[10px] p-1 text-primary flex items-center gap-1'>
                    <TaskAltIcon sx={{fontSize: 15}}/>
                    Verified
                </span>
            </div>
        </div>
        <div className='flex flex-col gap-2'>
            <h3>Email</h3>
            <div className='flex items-end gap-2'>
                <input
                    className='p-1 rounded-md bg-neutralLight'
                    value={userInfo.email || ''}
                    placeholder='Email'
                    onChange={handleEmailChange}
                />
                <SaveIcon 
                    className='text-primary'
                    onClick={handleSave}
                />
                {!currentUser &&
                    <div>
                        {userInfo.email_verified ? 
                        <span className='text-[10px] p-1 text-primary flex items-center gap-1'>
                            <TaskAltIcon sx={{fontSize: 15}}/>
                            Verified
                        </span>
                        :
                        <span className='text-[10px] p-1 text-errorRedLight flex items-center gap-1'>
                            <HighlightOffIcon sx={{fontSize: 15}}/>
                            Not Verified
                        </span>
                        }
                    </div>
                }

            </div>
            <div className='underline text-[12px]'>Send Verification Email</div>
        </div>
        <button 
            className='flex items-center justify-between w-full p-2 mt-6 font-bold text-white rounded-md bg-errorRed'
            onClick={handleLogout}
        >
            <div/>
            Logout
            <LogoutIcon/>
        </button>
    </div>
  )
}

export default Account