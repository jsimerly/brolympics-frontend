const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;
const FRONTEND_ADDRESS = import.meta.env.VITE_FRONTEND_ADDRESS;
import { deleteCookie, fetchWrapper, getCookie, setCookie } from "./cookies";

export const getInviteLinkLeague = (uuid) => {
    return `${FRONTEND_ADDRESS}/invite/league/${uuid}`
}
export const getInviteLinkBrolympics = (uuid) => {
    return `${FRONTEND_ADDRESS}/invite/brolympics/${uuid}`
}
export const getInviteLinkTeam = (uuid) => {
    return `${FRONTEND_ADDRESS}/invite/team/${uuid}`
}

export async function fetchLeagueInviteInfo(uuid){
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/league-invite/${uuid}`)

        return response

    } catch (error) {
        throw error
    }
}

export async function fetchJoinLeague(uuid){

    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/join-league/${uuid}`,
        {
            method: 'POST',
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

export async function fetchBrolympicsInvite(uuid){
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/brolympics-invite/${uuid}`)

        return response

    } catch (error) {
        throw error
    }
}

export async function fetchJoinBrolympics(uuid){

    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/join-brolympics/${uuid}`,
        {
            method: 'POST',
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

export async function fetchTeamInvite(uuid){
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/team-invite/${uuid}`)

        return response

    } catch (error) {
        throw error
    }
}

export async function fetchJoinTeam(uuid){

    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/join-team/${uuid}`,
        {
            method: 'POST',
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