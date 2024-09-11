import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Slideout from "./Slideout";
import brologo from "../../assets/imgs/brologo.webp";

const Navbar = ({ leagues }) => {
  const [slideOpen, setSlideOpen] = useState(false);
  const navigate = useNavigate();

  const menuClick = () => {
    setSlideOpen((prevState) => !prevState);
  };

  const logoClick = () => {
    navigate("/");
    setSlideOpen(false);
  };

  return (
    <>
      <div className="fixed h-[60px] z-20 w-full flex justify-between items-center px-3 border-b bg-white">
        <div className="" onClick={menuClick}>
          {slideOpen ? (
            <CloseIcon sx={{ fontSize: 35 }} />
          ) : (
            <MenuIcon sx={{ fontSize: 35 }} />
          )}
        </div>
        <button onClick={logoClick}>
          <img src={brologo} className=" h-[40px]" />
        </button>
      </div>
      <div className="h-[60px]" />
      <Slideout leagues={leagues} setOpen={setSlideOpen} open={slideOpen} />
    </>
  );
};

export default Navbar;
