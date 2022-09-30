import React, {useState, useEffect} from 'react'
import './Notification.css'

export default function Notification(props) {
    const [exit, setExit] = useState(false);
    const [width, setWidth] = useState(0);
    const [intervalID, setIntervalID] = useState(null);
  
    const handleStartTimer = () => { //handles timer of notification, "loadingbar"
      const id = setInterval(() => {
        setWidth(prev => {
          if (prev < 100) {
            return prev + 0.5;
          }
  
          clearInterval(id);
          return prev;
        });
      }, 20);
  
      setIntervalID(id);
    };
  
    const handlePauseTimer = () => { //pauses timer of notification
      clearInterval(intervalID);
    };
  
    const handleCloseNotification = () => { //deletes notification (div included)
      handlePauseTimer();
      setExit(true);
      setTimeout(() => {
        props.dispatch({
          type: "REMOVE_NOTIFICATION",
          id: props.id
        })
      }, 400)
    };
  
    useEffect(() => {
      if (width === 100) {
        // Close notification
        handleCloseNotification()
      }
    }, [width])
  
    useEffect(() => {
      handleStartTimer();
    }, []);
    
    const contentTypes={ //notification texts
      RoomJoin: "You joined a Room",
      RoomLeave: "You left a Room",
      VideoPause: "The video has been paused",
      VideoResume:"The video resumed playing",
      VideoChange:"The video has been changed",
      UserDelete:"Your Account has been deleted",
      ChatNew:"You received a new message"
    }

    return (
      <div
        onMouseEnter={handlePauseTimer}
        onMouseLeave={handleStartTimer}
        className={`notification-item ${props.variant} ${exit ? "exit" : ""}`}>
        <p>{contentTypes[props.contentType]}</p>
        <div className={"bar"} style={{ width: `${width}%` }} />
      </div>
    );
};
