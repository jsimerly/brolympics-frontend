import SettingsIcon from '@mui/icons-material/Settings';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import CookieIcon from '@mui/icons-material/Cookie';
import PersonIcon from '@mui/icons-material/Person';

const Options = ({currentUser, setView}) => {
    const clickAccount = () =>{
      setView('account')
    }

    const ButtonCard = ({ Icon, text }) => (
        <div className='flex flex-col items-center justify-center'>
          <Icon sx={{fontSize:35}}/>
          <span className='text-[10px] opacity-60 flex-wrap'>{text}</span>
        </div>
      );

    const AccountIcon = ({img}) => (
        <div 
          className='h-[100px] w-[100px] rounded-full absolute -bottom-[30px] flex items-center justify-center text-neutralDark bg-neutralLight overflow-hidden'
          onClick={clickAccount}
        >
           { img ? <img src={img} alt="Profile" className='rounded-full h-100 w-100'/> : <PersonIcon sx={{fontSize:125, mt:2}} /> }
        </div>
    )
    
  return (
    <div className='fixed flex justify-between items-center bottom-0 w-full h-[80px] bg-gradient-to-b from-neutralDark to-neutralLight text-white p-6'>
      {currentUser !== null ?
          <div className='relative'>
              <AccountIcon img={currentUser.img}/>
          </div>
          :
          <a
            className='text-[24px] underline'
            href='/sign-up'
          >
            Sign In
          </a>  
      }

        <div className='flex gap-10'>
            <ButtonCard Icon={CookieIcon} text="Policies"/>
            <ButtonCard Icon={HelpCenterIcon} text="Support"/>
            <ButtonCard Icon={SettingsIcon} text="Settings"/>
        </div>
    </div>
  )
}

export default Options