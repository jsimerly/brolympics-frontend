import {useEffect, useState, useContext} from 'react'
import { useSwipeable } from 'react-swipeable';
import CreateAccount from './CreateAccount';
import LogIn from './LogIn';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';




const SignUp = ({endPath}) => {
    const [currentPage, setCurrentPage] = useState('createAccount')
    const { currentUser } = useContext(AuthContext)
    const navigate = useNavigate()
    
    if (endPath){
      sessionStorage.setItem('returnPath', endPath)
    }

    
    useEffect(()=>{
      if (currentUser){
        navigate('/')
      }
    },[currentUser])

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const userState = { 
        firstName, setFirstName, 
        lastName, setLastName, 
        email, setEmail, 
        password, setPassword, 
        phoneNumber, setPhoneNumber 
    };
      

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handlePageChange('signIn'),
        onSwipedRight: () => handlePageChange('createAccount'),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
      });

  return (
    <div className='flex flex-col h-[calc(100vh-60px)] py-3 overflow-hidden bg-offWhite text-neutralDark' {...swipeHandlers}>
      <div className='flex items-center justify-center w-full gap-6 p-3'>
        <button
          className={`w-1/2 text-end outline-none ${currentPage === 'createAccount' ? 'font-bold' : ''}`}
          onClick={() => handlePageChange('createAccount')}
        >
          Create Account
        </button>
        |
        <button
          className={`w-1/2 text-start ${currentPage === 'signIn' ? 'font-bold' : ''}`}
          onClick={() => handlePageChange('signIn')}
        >
          Sign-In
        </button>
      </div>
      <div className={`transition ease-in-out duration-200 flex relative
      ${currentPage === 'createAccount' ? 'translate-x-0' : 'transform -translate-x-full'}`}>
            <CreateAccount {...userState}/>
            <LogIn {...userState}/> 
      </div>
    </div>
  );
};

export default SignUp;