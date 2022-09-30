import React, { useState, useEffect, useReducer, createContext, useContext } from 'react'
import { v4 } from 'uuid';
import Notification from './Notification';

const NotificationContext = createContext();

export default function NotificationSystem(props) {
    const [notification, dispatch] = useReducer((state, action)=>{ //typical useReducer, a state and action to change said state. state = array of notifications
        switch (action.type) {
          case "ADD_NOTIFICATION":
            return [...state, {...action.payload}]; //return array of all notifications (new included) with payload
          case "REMOVE_NOTIFICATION":
            return state.filter(el => el.id !== action.id) //filters state for all notifications with said id and deletes them (removes divs of notification)
          default: 
            return state
        }
      },[])
      
      return (
        <NotificationContext.Provider value={dispatch}> {/*provides every child with function(value) dispatch to change state of notifications system */}
          <div className= {"notification-wrapper"}>
            {notification.map((note)=>{
              return <Notification dispatch = {dispatch}  key={note.id} id={note.id} className = {note.variant} contentType={note.contentType}  />
            })}
          </div>
          {props.children}
        </NotificationContext.Provider>
      )
}

export const useNotification = () =>{ //function that provides every consumer (importer) to use dispatch to create a notification
    const dispatch = useContext(NotificationContext);
    return (props)=>{
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                id: v4(),
                ...props
            }
        })
    }
}
