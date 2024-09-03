const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;
import { deleteCookie, fetchWrapper, getCookie, setCookie } from "../cookies";

export async function fetchHome(uuid){
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/get-active-home/${uuid}`)

        return response
        
    } catch (error) {
        throw error
    }
}

export async function fetchStartComp(uuid, type){
    const data = {uuid: uuid, type: type}
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/start-competition/`,
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

export async function fetchActiveComp_h2h(uuid){
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/get-comp-h2h/${uuid}`)

        return response
        
    } catch (error) {
        throw error
    }
}

export async function fetchSubmitComp_h2h(uuid, team_1_score, team_2_score){
    const data = {
        uuid: uuid, 
        team_1_score: team_1_score,
        team_2_score: team_2_score,
    }
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/end-competition-h2h/`,
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

export async function fetchCancelComp_h2h(uuid){
    const data = {uuid: uuid}
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/cancel-competition-h2h/`,
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

export async function fetchActiveComp_ind(uuid){
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/get-comp-ind/${uuid}`)

        return response
        
    } catch (error) {
        throw error
    }
}

export async function fetchSubmitComp_ind(uuid, player_1_score, player_2_score){
    const data = {
        uuid: uuid, 
        player_1_score: player_1_score,
        player_2_score: player_2_score
    }
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/end-competition-ind/`,
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

export async function fetchCancelComp_ind(uuid){
    const data = {uuid: uuid}
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/cancel-competition-ind/`,
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

export async function fetchActiveComp_team(uuid){
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/get-comp-team/${uuid}`)

        return response
        
    } catch (error) {
        throw error
    }
}

export async function fetchSubmitComp_team(uuid, team_score){
    const data = {
        uuid: uuid, 
        team_score: team_score
    }
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/end-competition-team/`,
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

export async function fetchCancelComp_team(uuid){
    const data = {uuid: uuid}
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/cancel-competition-team/`,
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
