import React from 'react'
import './Welcome.css'
import {useAuth} from '../../contexts/AuthContext'
import {Redirect} from 'react-router-dom'
import {db} from './../../firebase'
const Welcome = () =>{
     const {currentUser} = useAuth()
     
     return(
         <div>
            {console.log(currentUser)}
           {currentUser && <Redirect to='/'/>}
            <h2>hello world I am the welcome page</h2>
         </div>
     );
}

export default Welcome;