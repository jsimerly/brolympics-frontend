import {useState} from 'react'
import { useParams } from 'react-router-dom'
import InCompetitions_h2h from './inCompetitions/InCompetitions_h2h'
import InCompetition_ind from './inCompetitions/InCompetition_ind'
import InCompetition_team from './inCompetitions/InCompetition_team'


const InCompetition = ({activeComp}) => {

  const getCompComponent = (type, uuid) => {
    switch (type) {
      case 'h2h':
        return <InCompetitions_h2h/>
      case 'ind':
        return <InCompetition_ind />
      case 'team':
        return <InCompetition_team />
      default:
        return null
    }
  }

  return (
      getCompComponent(activeComp.type, activeComp.comp_uuid)
  )
}

export default InCompetition