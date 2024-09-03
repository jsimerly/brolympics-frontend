import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

const ToggleButton = ({on, size}) => {
  return (
    on ?
        <ToggleOnIcon sx={{fontSize:size}}/>
        :
        <ToggleOffOutlinedIcon sx={{fontSize:size}}/>
  )
}

export default ToggleButton