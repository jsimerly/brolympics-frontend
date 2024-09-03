const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;
import { deleteCookie, fetchWrapper, getCookie, setCookie } from "../cookies";

export async function fetchTeamInfo(uuid){
    try{
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/get-team-info/${uuid}`)
        return response
    } catch (error) {
        throw (error)
    }
}