/*
Author: Dustin Rischke
*/

import React, { useState } from 'react';
import ChatWorkplace from './ChatWorkplace';
import {Button} from 'react-bootstrap';
import { putChatMessage} from './ChatSystem'
import './ChatBox.css'

export default function ChatBox({currentRoom, userId})  {
    const [message, setMessage] = useState("") //holds message
    const [open, setOpen] = useState(false); //handles the status if the chat is open or not

    const update = event => {
        setMessage(event.target.value)
    }
    console.log(userId)
    return (
        <div id="chatbox" className='chatbox'>
            <div className="chatbox-header">
                {open === true && <button id="closechat" className='chatbox-button' onClick={()=>setOpen(!open)}>Close Chat</button>} {/*toggles chat*/}
                {open === false && <button id="openchat" className='chatbox-button' onClick={()=>setOpen(!open)}>Open Chat</button>}
            </div>
            {open === true && <div id='chatboxmain'  className='chatbox-main'>
                <ChatWorkplace currentRoom = {currentRoom} userId={userId}/> {/*Chat history*/}
                <input id = "chatinput" type='text' className='message-input' placeholder='message' onChange={update}/>
                <Button className='send-button' onClick={async() => await putChatMessage(currentRoom, userId, message)}>Send</Button>
            </div>}
        </div>
    )
}