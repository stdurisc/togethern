/*
Author: Dustin Rischke
*/

import React, {useState, useEffect} from 'react'
import { useNotification } from './NotificationSystem'
import './RoomList.css'
import { getAllRooms, enterRoom, leaveRoom, createNewRoom, setRoomVideo, setRoomStatus } from './RoomSystem'


export default function RoomList({currentRoom, userId, changeRoom}) {
    var [roomlist, updateRoomlist] = useState({}) //list of all available rooms
    var className //help var to determine the room the current user is in
    const dispatch = useNotification();

    const dispatchNewNotification = (variant, contentType) =>{
        dispatch({
        variant: variant,
        contentType: contentType
        })
    }
    
    useEffect(()=>{ //initialize useEffect
        getAllRooms()
        .then(data => updateRoomlist(data)) 
        
    },[])   


    function displayRooms(){ //function to display all Rooms as idividual List elements
        var contentKeys = Object.keys(roomlist) //gets all keys of the roomlist json object (= rooms)
        var allRooms = contentKeys.map(  //maps an array of all first level keywords of json object
            (key) => roomlist[key].map( //gives the 2nd level keywords into a new array (= room)
                (property) => {     //3rd level keywords of room properties (name)

                    if(currentRoom !== undefined && currentRoom === property.name){ //determines the users current room if given so the room can be highlighted
                        className = 'current-Room'
                    } else {
                        className = 'other-Room'
                    }
                    return (
                        <li className = {className} key={property.name}> 
                        <button aria-label={"enter room: " + property.name} className={"room-button-" +className} onClick={() =>
                            {
                            enterRoom(property.name, userId)
                            changeRoom(property.name)
                            }
                        }> {property.name} </button>   
                        </li>
                    )
                }
                
            )
        )
  
      return allRooms


    }
    
    
    
  
    useEffect(()=>{
      var intervall = setInterval(() => {
        getAllRooms()
        .then(data => updateRoomlist(data))
      },1000)
  
      return () => clearInterval(intervall)
    },)  

    // host = localhost:3000
    // der link zum raum
    const url = window.location.host + "/" + currentRoom

    // Link in zwischenablage packen
    function copy() {
        // erstellt input element
        const el = document.createElement('input');
        // packt url in input
        el.value = url;
        document.body.appendChild(el);
        // markiert url in input
        el.select();
        // fuerht kopieren aus
        document.execCommand('copy');
        // entfernt input wieder
        document.body.removeChild(el);
    }
      
    return (
        <div id='roomlist-wrapper' className="roomlist-wrapper"> 
            <a className="hiddenNavs" aria-label="to 'create a new room'" href='#newroombutton'>Navigate to create new room </a>
            {currentRoom !== undefined && <a className="hiddenNavs" aria-label="to 'leave room'" href='#leaveroombutton'>Navigate to leave room </a> }
            <h1 id='roomheader' className="room-header">Room List</h1>
            <ul className="room-list">
                {displayRooms()}
            </ul>
            <a className="hiddenNavs" aria-label="to top of the list" href='#roomheader'>Navigate to top of the list </a>
            
            <button id='newroombutton' aria-label="Create New Room"  className="create" onClick={async() => 
                {
                    let response = await createNewRoom()
                    setRoomVideo(response['name'], userId, 'https://www.youtube.com/watch?v=SBxpeuxUiOA' )
                    setRoomStatus(response['name'], userId, 'paused' )
                    changeRoom(response['name'])
                    enterRoom(response['name'], userId)
                }
            }>Create New Room</button>
            {currentRoom !== undefined && <button id='leaveroombutton' aria-label="Leave Room" className="delete" onClick={() =>
                {
                changeRoom()
                leaveRoom(currentRoom, userId)
                dispatchNewNotification('info', 'RoomLeave')
                }
            }> Leave Room</button>} {/* renders a button to leave the room if user is in a room */}

            {/* wenn in raum dann link und button anzeigen */}
            { currentRoom && (<div> <p className='roomlink-text'>Roomlink: <br/> {url}</p> <button className="create" onClick={ copy }>Copy URL</button></div>)}
            
            
            
        </div>
      
    )
}
