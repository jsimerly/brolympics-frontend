const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;
import { deleteCookie, fetchWrapper, getCookie, setCookie } from "./cookies";

export async function fetchLeagueTeams(uuid) {
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/league-teams/${uuid}`)

        return response 
    } catch (error) {
        throw error
    }
}

export async function fetchCreateSingleTeam(name, brolympicsUUID, userJoin=false){
    const data = {
        name: name,
        brolympics_uuid: brolympicsUUID,
        user_join: userJoin,
    }
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/create-single-team/`,
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

export async function fetchDeleteTeam(team_uuid){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/delete-team/${team_uuid}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFTOKEN' : getCookie('csrftoken'),
            },
        })

        return response
    } catch (error) {
        throw (error)
    }
}

export async function fetchRemovePlayer(player_uuid, team_uuid){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/remove-player-team/${player_uuid}/${team_uuid}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFTOKEN' : getCookie('csrftoken'),
            },
        })

        return response
    } catch (error) {
        throw (error)
    }
}

export async function fetchUpdateTeamImage(img, team_uuid){
    const data = {
        uuid: team_uuid,
        img: img
    }
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/update-team-image/`,
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
