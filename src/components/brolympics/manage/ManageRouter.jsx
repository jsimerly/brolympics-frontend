import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams} from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditBracket from "./EditBracket"
import EditComp from "./EditComp"
import EditEvent from "./EditEvent"
import EditOverall from "./EditOverall"
import ManageBro from "./ManageBro"
import ManageEvents from "./ManageEvents"
import ManageTeams from "./ManageTeams"
import Manage from './Manage';

const ManageRouter = ({brolympics}) => {
  const navigate = useNavigate();
  const {pathname} = useLocation()
  const pathAfterManage= pathname.split("/")[4];
  const {uuid} = useParams()
  
  const handleGoBack = () => {
    navigate(`/b/${uuid}/manage`)
  }  
  
  return (
    <div className='min-h-[calc(100vh-220px)] h-full bg-offWhite text-neutralDark px-6 py-3'>
      {pathAfterManage &&
        <div className='pb-3'>
          <button 
            className='flex' onClick={handleGoBack}
          >
            <ArrowBackIcon/> Back
          </button>
        </div>
      }
      <Routes>
          <Route path='/' element={<Manage/>}/>
          <Route path='edit-bracket' element={<EditBracket/>}/>
          <Route path='edit-competition' element={<EditComp/>}/>
          <Route path='edit-event' element={<EditEvent/>}/>
          <Route path='edit-overall' element={<EditOverall/>}/>
          <Route path='manage-brolympics' element={<ManageBro {...brolympics}/>}/>
          <Route path='manage-teams' element={<ManageTeams teams={brolympics?.teams} broUUID={brolympics?.uuid}/>}/>
          <Route path='manage-events' element={<ManageEvents events={brolympics?.events}/>}/>
      </Routes>
    </div>
  )
}

export default ManageRouter