import React, {useState, useEffect, useMemo} from "react";
import './ChatWorkplace.css'
import {getAllChatMessages} from './ChatSystem'
import { useNotification } from "./NotificationSystem";



export default function ChatWorkplace({currentRoom, userId}){
    var [chathistory, updateChatHistory] = useState({}) 
    var className //help var to determine the room the current user is in
    const dispatch = useNotification();

    const dispatchNewNotification = (variant, contentType) =>{
        dispatch({
          variant: variant,
          contentType: contentType
        })
      }

    useEffect(()=>{ //initialize useEffect
        getAllChatMessages(currentRoom)
        .then(data => updateChatHistory(data)) 
        
    },[])  

    function displayChatHistory(){ //function to display all Rooms as idividual List elements
        var contentKeys = Object.keys(chathistory) //gets all keys of the chathistory json object (= messages)
        var allChats = contentKeys.map(  //maps an array of all first level keywords of json object
            (key) => chathistory[key].map( //gives the 2nd level keywords into a new array (= message)
                (property) => {     //3rd level keywords of room properties (name)

                    if(userId === property.userId){ //determines the users current room if given so the room can be highlighted
                        className = 'this-chatuser'
                    } else {
                        className = 'other-chatuser'
                    }
                    let date = new Date(property.time)
                    return (
                        <li className = {className} type='none' key={property.id}>
                            <p className="chat-user">User {property.userId}</p>
                            <p className="chat-text">{property.text}</p>
                            <p className="chat-timestamp">{date.toLocaleString('sv')}</p>
                        </li>
                    )
                }
                
            )
        )
  
      return allChats
    }

    useEffect(()=>{
        var intervall = setInterval(() => {
            getAllChatMessages(currentRoom)
            .then(data => {
                var lastIndex = data.messages.length - 1
                if (data.messages.length > chathistory.messages.length && data.messages[lastIndex].userId !== userId) { //if there is a new message and the id of the auther is someone else than the current user
                    dispatchNewNotification('info', 'ChatNew') //notify everyone
                }
                updateChatHistory(data)
            })
        },500)
    
        return () => clearInterval(intervall)
    },)  

    return(
        <div className="chat">
            <div className='chat-message-area'>
                <ul className="chat-history">
                    {displayChatHistory()}
                </ul>
            </div>
        </div>
    );

   
}


