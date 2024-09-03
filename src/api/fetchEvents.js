const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;
import { deleteCookie, fetchWrapper, getCookie, setCookie } from "./cookies";

export async function fetchUpdateEvent(event){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/update-event/`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFTOKEN' : getCookie('csrftoken'),
            },
            body: JSON.stringify(event),
        })

        return response

    } catch (error) {
        throw (error)
    }
}

export async function fetchCreateEvent(event, type, uuid){
    const data = {'event_name' : event, 'type': type, 'uuid':uuid}
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/create-event/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFTOKEN' : getCookie('csrftoken'),
            },
            body: JSON.stringify(data),
        })

        return response

    } catch (error) {
        throw (error)
    }
}


export async function fetchDeleteInd(uuid){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/delete-event-ind/${uuid}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFTOKEN' : getCookie('csrftoken'),
            },
        })
        
        return response
    } catch (error) {
        throw error
    }
}

export async function fetchDeleteH2h(uuid){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/delete-event-ind/${uuid}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFTOKEN' : getCookie('csrftoken'),
            },
        })
        
        return response
    } catch (error) {
        throw error
    }
}

export async function fetchDeleteTeam(uuid){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/delete-event-ind/${uuid}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFTOKEN' : getCookie('csrftoken'),
            },
        })
        
        return response
    } catch (error) {
        throw error
    }
}