import {getToken} from '#auth'
import {EventHandlerRequest, H3Event} from "h3";

export default eventHandler(async (event: H3Event ) => {
    const token = await getToken({event})

    return token || 'no token present'
})