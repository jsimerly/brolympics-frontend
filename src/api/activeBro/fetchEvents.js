const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;
import { deleteCookie, fetchWrapper, getCookie, setCookie } from "../cookies";


export async function fetchEventInfo(uuid, type){
    try {
        const response = await fetchWrapper(`${SERVER_ADDRESS}/api/brolympics/get-event-info/${uuid}/${type}`)

        return response

    } catch (error) {
        throw error
    }
}

