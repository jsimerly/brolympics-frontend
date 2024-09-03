import HomeActive from './HomeActive'
import HomePost from './HomePost'
import HomePre from './HomePre'
import HomeAdminPre from './HomeAdminPre'

import { useState, useEffect } from 'react'


const Home = ({brolympics, status, setStatus}) => {
  const componentMap = {
    'active': HomeActive,
    'pre_admin': HomeAdminPre,
    'pre': HomePre,
    'post': HomePost,
  }

  const Component = componentMap[status] || HomeActive
    
  return (
    <div>
        <Component {...brolympics} setStatus={setStatus}/>
    </div>
  )
}

export default Home