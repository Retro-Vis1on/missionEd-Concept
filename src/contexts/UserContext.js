import React, { useContext, useEffect, useState } from 'react'
import { db } from './../firebase'
const userContext = React.createContext()

export function useUserContext() {
    return useContext(userContext);
}

export function userProvider({ children }) {
   const[user,setUser] = useState(null);
   const[profile, setProfile] = useState([]);
  
    const value = {
      user,
      setUser,
    }

    return (
        <userContext.Provider value={value}>
            {children}
        </userContext.Provider>
    );
}