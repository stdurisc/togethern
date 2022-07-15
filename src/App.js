import React from "react";
import NavigationBar from './NavigationBar'
import './App.css';
import Login from "./Login";
import {deleteUser} from './UserSystem';
import Videoplayer from './Videoplayer';
import { useState, useEffect, useMemo }  from'react';
import UserList from './UserList';
import { leaveRoom } from "./RoomSystem";
import RoomSystemTest from './RoomSystemTest';
import RoomList from './RoomList';
import Cleanup from "./Cleanup";

 function getWindowDimensions() { //Function to get the height and width of the window
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}


function App() {
  
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions()); //state of window dimensions
  const [user, changeUser] = useState() //state of users
  const [currentRoom, changeRoom] = useState() //state of current room
  const isMobile = window.innerWidth <= 697; //boolean if used on mobile device
  
  const roomChanger = (roomName)=>{
    changeRoom(roomName)
  }

  useEffect(() => { //when ever the window changes dimensionsm this useEffect updates the windowDims
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  })
  
  
   window.addEventListener("beforeunload", (ev) =>  //asking user if they are sure to close everything bc
  {  
    ev.preventDefault();
    return ev.returnValue = 'Are you sure you want to close?';
  }) 

  window.addEventListener("unload", (ev) => //when closing window/tab user gets deleted and removed from the current room
  {  
    ev.preventDefault();
    if (currentRoom !== undefined){
      leaveRoom(currentRoom, user.id)
    }
    deleteUser(user.id)
  }) 

  function MainDesktopPage() { //function to render app in desktop mode
    let w = useMemo(() => {
      return Math.round(windowDimensions.width * 45 /100)
    }, [windowDimensions])

    let h = useMemo(() => {
      return Math.round((windowDimensions.width * 45 /100)/1.777)
    }, [windowDimensions])

    return (
      <div className="content-container">
        <a className="hiddenNavs" aria-label="to Memberlist" href='#memberlist-box'>Navigate to Memberlist </a>
        <a className="hiddenNavs" aria-label="to Video area" href='#video-box'>Navigate to Video area </a>
        <a className="hiddenNavs" aria-label="to Roomlist" href='#roomlist-box'>Navigate to Roomlist </a>
        <div className="row">
          <div id="memberlist-box" className="memberlist-box">
            <UserList currentRoom = {currentRoom} userId = {user.id} /> 
            <a className="hiddenNavs" aria-label="to Video area" href='#video-box'>Navigate to Video area </a>
            <a className="hiddenNavs" aria-label="to Roomlist" href='#roomlist-box'>Navigate to Roomlist </a>
          </div>
          <div id="video-box" className="video-box">
            {currentRoom !== undefined && <Videoplayer roomname = {currentRoom} userId={user.id} reactwidth = {w} reactheight = {h}/>}
            <a className="hiddenNavs" aria-label="to Memberlist" href='#memberlist-box'>Navigate to Memberlist </a>
            <a className="hiddenNavs" aria-label="to Roomlist" href='#roomlist-box'>Navigate to Roomlist </a>
          </div>
          <div id="roomlist-box" className="roomlist-box">
            <RoomList currentRoom = {currentRoom} userId = {user.id} changeRoom={roomChanger} /> 
            <a className="hiddenNavs" aria-label="to Memberlist" href='#memberlist-box'>Navigate to Memberlist </a>
            <a className="hiddenNavs" aria-label="to Video area" href='#video-box'>Navigate to Video area </a>
          </div>
        </div>
      </div>
    )
  }

  function MainMobilePage() { //function to render app in mobile mode

    let w = useMemo(() => {
      return Math.round(windowDimensions.width * 95 /100)
    }, [windowDimensions])

    let h = useMemo(() => {
      return Math.round((windowDimensions.width * 95 /100)/1.777)
    }, [windowDimensions])

    return (
        <div className="coloumn">
          <a className="hiddenNavs" aria-label="to Memberlist" href='#memberlist-box'>Navigate to Memberlist </a>
          <a className="hiddenNavs" aria-label="to Video area" href='#video-box'>Navigate to Video area </a>
          <a className="hiddenNavs" aria-label="to Roomlist" href='#roomlist-box'>Navigate to Roomlist </a>
          <div id="video-box" className="video-box">
            {currentRoom !== undefined && <Videoplayer roomname = {currentRoom} userId={user.id} reactwidth = {w} reactheight = {h}/>}
            <a className="hiddenNavs" aria-label="to Memberlist" href='#memberlist-box'>Navigate to Memberlist </a>
            <a className="hiddenNavs" aria-label="to Roomlist" href='#roomlist-box'>Navigate to Roomlist </a>
          </div>
          <div id="roomlist-box" className="roomlist-box">
            <RoomList currentRoom = {currentRoom} userId = {user.id} changeRoom={roomChanger} /> 
            <a className="hiddenNavs" aria-label="to Memberlist" href='#memberlist-box'>Navigate to Memberlist </a>
            <a className="hiddenNavs" aria-label="to Roomlist" href='#roomlist-box'>Navigate to Roomlist </a>
          </div>
          <div id="memberlist-box" className="memberlist-box">
            <UserList currentRoom = {currentRoom} userId = {user.id} /> 
            <a className="hiddenNavs" aria-label="to Video area" href='#video-box'>Navigate to Video area </a>
            <a className="hiddenNavs" aria-label="to Roomlist" href='#roomlist-box'>Navigate to Roomlist </a>
          </div>
        </div>
    )
  }

  
  return (
    <div id="top">
      <NavigationBar/>
      {user === undefined && <Login changeUser={changeUser}/>}
      {user !== undefined && !isMobile && <MainDesktopPage/>}  
      {user !== undefined && isMobile && <MainMobilePage/>}      
      <a className="hiddenNavs" aria-label="to top of page" href='#top'>Navigate to the Top </a>
    </div>
  )
}

export default App;




