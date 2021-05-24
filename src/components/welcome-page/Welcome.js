import React from 'react'
import './Welcome.css'
import {useAuth} from '../../contexts/AuthContext'
import {Redirect} from 'react-router-dom'
import {db} from './../../firebase'
const Welcome = () =>{
     const {currentUser} = useAuth()
     async function click(){
       db.collection('chats').where('users','array-contains-any',['vsjCtTM86TTUtt9CPoNhrdxyFi43']).onSnapshot(snap=>{
           snap.docs.map(data=>{
             let b = data.data().users
             let id = currentUser.id === b[0] ? data.users[1] : data.users[0];
             console.log(id)
            })
       })
     }
     return(
         <div>
            {console.log(currentUser)}
           {currentUser && <Redirect to='/'/>}
            <h2>hello world I am the welcome page</h2>
            <h2>lsdjflsa</h2>
            <button onClick={()=>click()}>ok click here</button>
         </div>
     );
}

export default Welcome;