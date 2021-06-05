import React,{useContext, useState, useEffect} from 'react'
import {auth, provider, userdb} from '../firebase'
const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const[loading,setLoading] = useState(true)
    const [currentUser,setCurrentUser] = useState();
    
    function signup(email, password){
        return auth.createUserWithEmailAndPassword(email,password)
    }
    function login(email, password){
        return auth.signInWithEmailAndPassword(email,password)
    }
    function loginWithGoogle(){
        return auth.signInWithPopup(provider).then(data=>{
            userdb.doc(data.user.uid).onSnapshot(snap=>{
                  if(!snap.exists){
                      userdb.doc(data.user.uid).set({
                          username:data.user.email.substring(0,data.user.email.length-9),
                          email : data.user.email,
                          name : data.user.displayName,
                          profile_image: data.user.photoURL,
                          coins: 20,
                      })
                  }
            }) 
            }).catch((error)=>{alert(error.message)})
    }
    function logout(){
        return auth.signOut()
    }
    useEffect(()=>{
       const unsubscribe = auth.onAuthStateChanged(user =>{
           setCurrentUser(user)
           setLoading(false)   
       })
       return unsubscribe
    },[])
    
    const value = {
        currentUser,
        signup,
        login,
        logout,
        loginWithGoogle
    }
    
    return (
       <AuthContext.Provider value={value}>
         {!loading && children}
       </AuthContext.Provider>
    )
}
