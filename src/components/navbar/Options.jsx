import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import Info from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";

const Options = ({ user, setView }) => {
  const navigate = useNavigate();
  const clickAccount = () => {
    setView("account");
  };

  const clickButton = (to) => {
    navigate(to);
    location.reload();
  };

  const ButtonCard = ({ Icon, text, to }) => (
    <button
      onClick={() => clickButton(to)}
      className="flex flex-col items-center justify-center"
    >
      <Icon sx={{ fontSize: 35 }} />
      <span className="text-[10px] opacity-60 flex-wrap max-w-[60px] text-center">
        {text}
      </span>
    </button>
  );

  const AccountIcon = ({ img }) => (
    <div
      className="h-[100px] w-[100px] rounded-md absolute -bottom-[35px] flex items-center justify-center text-neutralDark bg-neutralLight overflow-hidden"
      onClick={clickAccount}
    >
      {img ? (
        <img src={img} alt="Profile" className="rounded-md h-100 w-100" />
      ) : (
        <PersonIcon sx={{ fontSize: 125, mt: 2 }} />
      )}
    </div>
  );

  return (
    <div className="fixed flex justify-between items-center bottom-0 w-full h-[100px] bg-gradient-to-b from-neutralDark to-neutralLight text-white p-6">
      {user !== null ? (
        <div className="relative">
          <AccountIcon img={user.img} />
        </div>
      ) : (
        <a className="text-[24px] underline" href="/auth">
          Sign In
        </a>
      )}

      <div className="flex items-start gap-7">
        <ButtonCard Icon={Info} text="About" to="/about" />
        <ButtonCard Icon={SettingsIcon} text="Settings" />
      </div>
    </div>
  );
};

export default Options;
