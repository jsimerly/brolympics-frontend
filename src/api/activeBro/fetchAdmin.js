const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;
import { deleteCookie, fetchWrapper, getCookie, setCookie } from "../cookies";

export async function fetchStartBrolympics(uuid){
    const data = {uuid: uuid}
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/start-brolympics/`,
        {
            method: 'PUT',
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

export async function fetchEventsUnstarted(uuid){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/events-unstarted/${uuid}`)
        return response
    } catch (error) {
        throw (error)
    }
}

export async function fetchStartEvent(uuid, type){
    const data = {uuid: uuid, type: type}
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/start-event/`,
        {
            method: 'PUT',
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

export async function fetchUpdateIndComp(data){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/update-comp-ind/`,
        {
            method: 'PUT',
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

export async function fetchUpdateH2hComp(data){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/update-comp-h2h/`,
        {
            method: 'PUT',
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

export async function fetchUpdateTeamComp(data){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/update-comp-team/`,
        {
            method: 'PUT',
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

export async function fetchAllCompData(bro_uuid){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/all-comp-data/${bro_uuid}`)

        return response

    } catch (error) {
        throw (error)
    }
}

export async function fetchBracketData(bro_uuid){
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/bracket-data/${bro_uuid}`)

        return response
    } catch (error) {
        throw (error)
    }
}

export async function fetchUpdateBracketMatch(data){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/update-bracket-comp/`,
        {
            method: 'PUT',
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