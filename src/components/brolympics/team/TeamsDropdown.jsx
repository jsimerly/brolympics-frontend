import{useState} from 'react'
import { Routes, Route, useNavigate, useParams} from "react-router-dom"
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import {useDropdown} from '../../../hooks'

const TeamsDropdown = ({teams, selectedTeam, setSelectedTeam}) => {
    const navigate = useNavigate()

    const {uuid} = useParams()
  
    const handleSelect = (team) => {
      setSelectedTeam(team)
      setIsOpen(false)
      navigate(`/b/${uuid}/team/${team.uuid}`);
    }
  
    const [isOpen, setIsOpen, handleDropdownClicked, dropdownNode] = useDropdown()

  return (
    <div className='relative flex flex-col items-center justify-center w-full py-3 '>
        <div>
          <div 
            className=' flex justify-between items-center w-[200px] text-[20px] font-semibold  border-neutralLight'
            onClick={handleDropdownClicked}
          >
            <h2 className='flex items-center justify-center w-full text-center'>
              {selectedTeam ? selectedTeam.name : 'Select a Team'}
            </h2> 
              <ExpandMoreOutlinedIcon/>
          </div>
          {isOpen && (
            <ul 
              className='absolute top-[50px] border p-2 rounded-md shadow-lg w-[200px] z-10 bg-neutral'
              ref={dropdownNode}
            >
              {teams
                .map((team, index) => (
                  <div key={index+"_dropdown"}>
                    {index !== 0 && 
                    <div key={index+'_divider'} className='w-full bg-gray-200 h-[1px]'/>}           
                    <li 
                      key={index+'_team'} 
                      className='text-[16px] py-2'
                      onClick={() => handleSelect(team)}
                    >
                      {team.name}
                    </li>

                  </div>
                ))}
            </ul>
          )}
        </div>
      </div>
  )
}

export default TeamsDropdown