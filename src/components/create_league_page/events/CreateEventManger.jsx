import { useNotification } from '../../Util/Notification';
import CreateEvent from './CreateEvent';

const CreateEventManger = ({setAddedEvents ,setH2hEvents, setIndEvents, setTeamEvents}) => {
    const {showNotification} = useNotification()

    const handleEventAdded = (eventName, selectedType) => {
      if (eventName){
        let newEvent = {'name': eventName};
        if (selectedType === 'ind'){
          setIndEvents(prevEvents => [...prevEvents, newEvent])
        }
        if (selectedType === 'h2h'){
          setH2hEvents(prevEvents => [...prevEvents, newEvent])
        }
        if (selectedType == 'team'){
          setTeamEvents(prevEvents => [...prevEvents, newEvent])
        }
      } else {
        showNotification("You must enter an event name.")
      }
      
    }
  return (
    <div className="w-full">
        <CreateEvent handleEventAdded={handleEventAdded}/>
    </div>
  )
}

export default CreateEventManger