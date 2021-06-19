import React,{useContext, useEffect, useState} from 'react'
import {db} from './../firebase'
const FeedContext = React.createContext() 

export function useFeedContext(){
    return useContext(FeedContext);
}

export function FeedProvider({children}){
    const [posts,setPosts] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
      GetPosts();
    },[]);

    async function GetPosts(){
            try{
                await db.collection('posts').orderBy('timestamp','desc').onSnapshot(snap=>{
                    setPosts(snap.docs.map(doc=>({id:doc.id,data:doc.data()})))
                    console.log('aklsdjflksdajlj')
                })
            }catch{
                alert('something went wrong')
            }
            setLoading(false);
    }  

    const value = {
        posts,
        loading,
    }

    return(
        <FeedContext.Provider value={value}>
            {!loading && children}
        </FeedContext.Provider>
    );
}