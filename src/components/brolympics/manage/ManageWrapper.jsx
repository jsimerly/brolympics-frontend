import { useNavigate } from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ManageWrapper = ({children, brolympicsUUID}) => {
  const navigate = useNavigate()
  const goBack = () => {
    navigate(`/b/${brolympicsUUID}/manage`)
  }
  return (
    <div>
      <div className="p-3">
        <button className="flex" onClick={goBack}>
          <ArrowBackIcon/> Back
        </button>
      </div>
      <div className="px-6">
        {children}
      </div>

    </div>
  )
}

export default ManageWrapper