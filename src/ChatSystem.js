//api readme here: https://gitlab.hs-anhalt.de/barth_to/watch2gether

const fetchUrl = 'https://gruppe11.toni-barth.com/'

//alle (oder nur alle neuen) Nachrichten abfragen
async function getAllChatMessages(roomName) {
    return await fetch(fetchUrl + 'rooms/' + roomName + '/chat')
        .then(res => {
            console.log(res.status)
            if (!res.ok) {
                throw Error('Fetch Fail')
            }
            return res.json()
        })

        .catch(error => {
            console.log(error)
            return error
        })
}

//Nachricht senden
async function putChatMessage(roomName, userID, message) {
    return await fetch(fetchUrl + 'rooms/' + roomName + '/chat', {
        method: 'PUT',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            user: userID,
            message: message
        })
    })
        .then(res => {
            if(!res.ok){
                throw Error('The message: "' + message + '" from "' + userID + '" couldn\'t be sent. Room: ' + roomName)
            }
            else{
                console.log(userID + ': ' + message)
            }
        })
        .catch(error => {console.log(error)
            return error}
        )
}

export {getAllChatMessages, putChatMessage}

