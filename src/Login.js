/* Author: Leonie Anna Maria Schulte*/
//WCAG 2 Edits: Dustin Rischke

import React, {useRef} from 'react'
import {createNewUser} from './UserSystem'
import logo from "./material/logo_dark.png"
import './Login.css'
import reactStringReplace from 'react-string-replace'

export default function Login({changeUser}) { //function that handles login by providing a field for the user name and changing it in parent "App.js"
    const inputRef = useRef()
    const handleSubmit = async(e) => {
      if (inputRef.current.value !== undefined || reactStringReplace(inputRef.current.value, String.fromCharCode(32), ""  ) !== '' ) {
        e.preventDefault();
        console.log('You clicked submit.')
        let response = await createNewUser(inputRef.current?.value) 
        changeUser ( {
          id: response['id'],
          name: response['name'],
        })
      } else {
        inputRef.focus()
      }
    }
  
    return(
      <div className="login-wrapper">
        <a className="hiddenNavs" aria-label='Skip to username input' href='#username_input'>skip to the username input</a>
        <form onSubmit={handleSubmit}>
          <div className="centered">
            <img className="loginLogo" alt = "Logo of Togethern" src={logo}/>
          </div>
          <h1 className="login-title"> Login Page</h1>
          <h2 className="login-subtitle">Please choose a username to continue!</h2>
          <label className="centered">
            <input id="username_input" ref={inputRef} type="text" required/>
          </label>
          <div className="centered">
            <button className="submit-button" aria-label={"creates a new user with your desired username"} type="submit"><b>Submit</b></button>
          </div>
        </form>
      </div>
    )
}
