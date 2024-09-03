import React, { useEffect, useState } from "react";
import { json, useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../Util/Notification";

const InviteWrapper = ({fetchInfo, fetchJoin, joinText, children}) => {
    const {uuid} = useParams()
    const [info, setInfo] = useState()
    const { showNotification } = useNotification()
    const navigate = useNavigate()
    
    useEffect(() => {
      const getinfo = async () => {
        const response = await fetchInfo(uuid)

        if (response.ok) {
          const data = await response.json()
          setInfo(data)
          console.log(data)
        } else if (response.status == 404){
          showNotification("We could not find this invite. We're rerouting you to the leagues page now.")
          
          setTimeout(() => {
            navigate('/')
          }, 3000)
        } else {
          showNotification("There was an error attempting to retrieve this invite.")
        }
      }
      getinfo()
    },[uuid])

    const joinClick = async () => {
      const response = await fetchJoin(uuid)

      if (response.ok){
        const data = await response.json()
        if ('league_uuid' in data){
          navigate(`/league/${data.league_uuid}`)
        }
        if ('bro_uuid' in data){
          navigate(`/b/${data.bro_uuid}/home`)
        }
        showNotification(data.welcome_message, '!border-primary')
      } else if (response.status == 409){
        const data = await response.json()
        showNotification(data.detail)
      } else {
        showNotification('There was an error while attempting to accept this invite.')
      }
    }

  return (
    <div className="flex flex-col items-center justify-between w-full h-[calc(100vh-80px)] p-6">
        {info &&
          React.cloneElement(children, { info })
        }
        <button 
              className="w-full p-3 font-bold text-white rounded-md bg-primary"
              onClick={joinClick}
            >
              {joinText}
        </button>

    </div>
  )
}

export default InviteWrapper