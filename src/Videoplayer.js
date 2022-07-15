/*
Author: Dustin Rischke
*/

import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react'
import './Videoplayer.css'
import ReactPlayer from 'react-player/lazy'
import {getRoomVideo, setRoomVideo, getRoomTime, setRoomTime, getRoomStatus, setRoomStatus} from './RoomSystem'

export default function Videoplayer({roomname, userId, reactwidth, reactheight}) {
  /* const roomname = props.roomname
  const userId = props.userId */
  const Player = () => {
    const playerRef = useRef(null);
    const inputRef = useRef(null)
    const [playerConfig, changePlayerConfig] = useState({     //current solution to batch updating all the idividual states
      video:'https://www.youtube.com/watch?v=SBxpeuxUiOA',    //video of the current room
      status: 'paused',                                       //status of current room
      progress: 0,                                            //videoprogress of current room / progress of the video in seconds
    })
    const [looping, isLooping] = useState (true) // useState for Looping video. True = Looping video
    //def search tearm so inputbar doesn't loose text while typing in rerender
    //console.log("Playerconfig: " + [playerConfig.video, playerConfig.status, playerConfig.progress])
    
    const handleKeyDown = async(event) => {    //handles video link inputbar
      if (event.key === 'Enter') {        //on Enter do...
        await setRoomStatus(roomname,userId,"paused")
        await setRoomVideo(roomname, userId, event.target.value)
        await setRoomTime(roomname, userId, 0)
        changePlayerConfig({video: event.target.value, status: playerConfig.status, progress: 0})
        isLooping(false);
      }
    }   
    
    function stripData(newdata){ //function to strip the data from promise object
      return newdata
    }

    let init = useCallback(() => {    //initializing function to update new users in room to current config
      let initialize = async() => {
        let serverData
        await getServerData().then((data) => {serverData = stripData(data)}) //gets the data saved on server back as promise and assignes value with stripData
        playerRef.current?.seekTo(serverData.progress)  //then the player gets set the current progress of the server
        changePlayerConfig(serverData)  //intern state of player is brought to server data
      }
     
    },[])
    
    useEffect(()=>{ // (near) real time sync
      var intervall = setInterval(async() => {  //every 2 seconds (see l. 71) the following is done...
        let serverData
        await getServerData().then((data) => {serverData = stripData(data)})  //gets current state of the server
        

        if (playerConfig.video !== serverData.video || playerConfig.status !== serverData.status || Math.abs( playerConfig.progress - serverData.progress) > 1.5){ 
          //if the current video or status of the room or if the time diffrence between server and client is greater then 1.5 seconds,
          //config update and the player adjust its own time to the one of the server
          
          playerRef.current?.seekTo(serverData.progress)
          changePlayerConfig(serverData)
        }
      },1000)
    
      return () => clearInterval(intervall) //resets the intervall so the function starts and ends every ~second, otherwise it would only start every second
      
    },)   

    async function getServerData(){ //gets the data concering the playerConfig and returns it as new state in a promise
      let videoServerData = await getRoomVideo(roomname)   
      let statusServerData = await getRoomStatus(roomname)
      let progressServerData = await getRoomTime(roomname)

      return {
        video: videoServerData['url'],
        status: statusServerData['status'],
        progress: progressServerData['position'],
      }
    } 


    const TestControls =() => { 
      //developer tools for sync testing
      //DONT RENDER IS STABLE BUILD
      return (
        <div>
          <h1> TEST CONTROLS</h1>
          <button onClick={() =>{setRoomStatus(roomname, userId, "playing")}}>set room {roomname} to playing</button>
          <button onClick={() =>{setRoomStatus(roomname, userId, "paused")}}>set room {roomname} to paused</button>
          <button onClick={() =>{setRoomTime(roomname, userId, 10 )}}>set the Room time to 10 sec</button>
          <button onClick={() =>{playerRef.current?.seekTo(playerRef.current?.getCurrentTime() +10,"seconds")}}>set the Room time to +10 sec</button>
          <button onClick={() =>{playerRef.current?.seekTo(playerRef.current?.getCurrentTime() - 10,"seconds")}}>set the Room time to +10 sec</button>
        </div>
      )
    }

    const isPlaying = useMemo(() => { 
      //function to turn string status into boolean status for reactplayer 
      //only changes when the status changed to for render optimizations
      if(playerConfig.status === 'playing'){
        return true
      } else {
        return false
      }
    },[playerConfig.status])

    return (
      <div id='player-wrapper' className="player-wrapper">
        <a className="hiddenNavs" aria-label='to video input (link)' href='#linkinput'>Navigate to the video input </a>
        <a className="hiddenNavs" aria-label='to video player | We are very sorry but currently its not possible to immediately focus on the video player,
         this will be fixed in then ext update when able player is integrated, we apologize for the inconvenience' >navigate to video player </a>
        <input id='linkinput' aria-label='Enter your links for new videos here' ref={inputRef} className = "Inputbar" type="text" onKeyDown={handleKeyDown}  />  
        {/* <TestControls/> */}
        
          <ReactPlayer
            className = "ReactPlayer" 
            width={reactwidth + "px"}
            height={reactheight + "px"} 
            ref={playerRef}
            url = {playerConfig.video} 
            loop = {looping} 
            playing = {isPlaying}
            controls = {true} 
            onBuffer = {() => {setRoomStatus(roomname, userId, 'paused')}}
            onBufferEnd = {() => {setRoomStatus(roomname, userId, 'playing')}}
            onPause = {() => {
              setRoomStatus(roomname, userId, 'paused')
              changePlayerConfig({
              video:playerConfig.video,
              status: 'paused',
              progress: playerConfig.progress,
              })
            }}
            onPlay= {() => {
              setRoomStatus(roomname, userId, 'playing')
              changePlayerConfig({
              video:playerConfig.video,
              status: 'playing',
              progress: playerConfig.progress,
              })
            }}
            onProgress = {() => {
              setRoomTime(roomname, userId, playerRef.current?.getCurrentTime())
              changePlayerConfig(
                {
                video:playerConfig.video,
                status: playerConfig.status,
                progress: playerRef.current?.getCurrentTime(),
                }
              )
            }}
          />
      </div>
    )
  }

  return (
    <Player />
  )
}