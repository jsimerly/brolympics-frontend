import ManageEventWrapper from "./ManageEventWrapper"
import {useState, useEffect} from 'react'
import ScoringSettings from "./ScoringSettings"
import {fetchDeleteInd, fetchUpdateEvent} from '../../../../api/fetchEvents.js'
import ToggleButton from "../../../Util/ToggleButton"
import PopupContinue from "../../../Util/PopupContinue"
import { useNotification } from "../../../Util/Notification"

const ManageEvent_ind = ({event}) => {
    const [formValues, setFormValues] = useState({});
    const { showNotification } = useNotification()

    useEffect(() => {
        if (event) {
            setFormValues({...event});
        }
    }, [event]);
        
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevFormValues => ({
            ...prevFormValues,
            [name]: value
        }));
    };    
    
    const displayAvgToggle = () => {
        setFormValues({
            ...formValues,
            display_avg_scores: !formValues.display_avg_scores
        })
    }

    const handleUpdateClicked = async () => {
        const response = await fetchUpdateEvent(formValues)

        if (response.ok){
            showNotification(`${event.name} has been updated.`, '!border-primary')
        } else {
            showNotification('There was an issue when attemping to update this event.')
        }
    }

    const [deleteOpen, setDeleteOpen] = useState(false)
    
    const handleDeleteClicked = () => {
        setDeleteOpen(true)
    }

    const deleteEventFunc = async () => {
        const response = await fetchDeleteInd(event.uuid)
        if (response.ok){
            showNotification(`Successfully deleted ${event.name}`, '!border-primary')
            location.reload()
        } else {
            showNotification('There was an error when attemping to delete this event.')
        }
    }

  return (
    <ManageEventWrapper name={event.name}>
        <PopupContinue
            open={deleteOpen}
            setOpen={setDeleteOpen}
            header={`Do you want to delete ${event.name}?`}
            desc={'Delete this event will remove it from your brolympics. You will be able to recreate the event, but will lose all of your current settings.'}
            continueText={'Delete'}
            continueFunc={deleteEventFunc}
        />
        <h2 className="py-2">Competition Settings</h2>
        <div className="flex items-center justify-between min-h-[50px]">
            <div>
                <h3 className="font-semibold">Number of Competitions</h3>
                <p className="text-[10px]">The number of times each team will complete this event. Ex: Completing 2 relay races.</p>
            </div>
            <input 
                value={formValues.n_competitions || ''}
                name='n_competitions'
                onChange={handleInputChange}
                className="p-1 border rounded-md border-primary h-[40px] w-[60px] bg-white text-center"
                type='number'
            />
        </div>
        <div className="flex items-center justify-between min-h-[50px]">
            <div>
                <h3 className="font-semibold">Max Concurrent Competitions</h3>
                <p className="text-[10px]">The number of max possible simulatnious competitions. <br/> Ex: 2 relay race courses. Leave blank for no max.</p>
            </div>
            <input 
                value={formValues.n_active_limit || ''}
                name='n_active_limit'
                onChange={handleInputChange}
                className="p-1 border rounded-md border-primary h-[40px] w-[60px] bg-white text-center"
                type='number'
            />
        </div>
        <div className="flex items-center justify-between min-h-[50px]">
            <div>
                <h3 className="font-semibold">Display Average Scores</h3>
                <p className="text-[10px]"> Do you want to display average scores or combined scores? <br/> Currently set to: <span className="font-bold">{formValues.display_avg_scores ? 'Average Score' : 'Combined Score'}</span></p>
            </div>
            <button
                onClick={displayAvgToggle}
                className="text-primary w-[60px]"
            >
                <ToggleButton size={50} on={formValues.display_avg_scores}/>
            </button>
        </div>
        <ScoringSettings
            formValues={formValues}
            setFormValues={setFormValues}
            handleInputChange={handleInputChange}
        />
        <button 
            className="w-full p-2 mt-3 font-semibold text-white rounded-md bg-primary"
            onClick={handleUpdateClicked}
        >
            Update {event.name}
        </button>
        <button 
            className="w-full p-2 mt-3 font-semibold text-white rounded-md bg-errorRed"
            onClick={handleDeleteClicked}
        >
            Delete
        </button>
    </ManageEventWrapper>
  )
}

export default ManageEvent_ind