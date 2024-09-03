const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;
import { deleteCookie, fetchWrapper, getCookie, setCookie } from "./cookies";

export async function fetchLeagues(){
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/all-leagues`)

        return response

    } catch (error) {
        throw error
    }
}

export async function fetchLeagueInfo(uuid){
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/league-info/${uuid}`)

        return response
    } catch (error) {
        throw error
    }
}

export async function createAllLeague(league, brolympics, h2h, ind, team){
    const data = {
        league: league,
        brolympics: brolympics,
        h2h_events: h2h,
        ind_events: ind,
        team_events: team,
    }
    console.log(data)
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/create-all-league/`,
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

export async function fetchUpcoming(){
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/upcoming`)

        return response
    } catch (error) {
        throw error
    }
}