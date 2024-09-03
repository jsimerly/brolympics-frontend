const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;
import { deleteCookie, fetchWrapper, getCookie, setCookie } from "./cookies";

export async function fetchBrolympicsHome(uuid){
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/get-brolympics-home/${uuid}`)

        return response
        
    } catch (error) {
        throw error
    }
}

export async function fetchUpdateBrolympics(data){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/update-brolympics/`,
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

export async function fetchInCompetition(){
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/is-in-competition/`)

        return response
        
    } catch (error) {
        throw error
    }
}

export async function fetchDeleteBrolympics(uuid){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/delete-brolympics/${uuid}`,
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

export async function fetchCreateBrolympics(league, brolympics, h2h, ind, team){
    const data = {
        league_uuid: league,
        brolympics: brolympics,
        h2h_events: h2h,
        ind_events: ind,
        team_events: team,
    }
    console.log(data)
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/create-brolympics/`,
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