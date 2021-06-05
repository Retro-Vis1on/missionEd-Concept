import React,{useContext, useState, useEffect} from 'react'
import {auth, provider} from '../firebase'
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
        return auth.signInWithPopup(provider).catch((error)=>{alert(error.message)})
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
