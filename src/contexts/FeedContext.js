import React,{useContext, useEffect, useState} from 'react'
import {db} from './../firebase'
const FeedContext = React.createContext() 

export function useFeedContext(){
    return useContext(FeedContext);
}

export function FeedProvider({children}){
    const [allPosts,setAllPosts] = useState(null);
    const [posts,setPosts] = useState(null);
    
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
      GetPosts();
    },[]);

    async function GetPosts(){
            try{
                await db.collection('posts').orderBy('timestamp','desc').limit(20).onSnapshot(snap=>{
                    setPosts(snap.docs.map(doc=>({id:doc.id,data:doc.data()})));
                    setAllPosts(snap.docs.map(doc=>({id:doc.id,data:doc.data()})));
                })
            }catch{
                alert('something went wrong')
            }
            setLoading(false);
    }  
    
    async function TagPosts(tag){
        console.log(tag);
        if(tag==='alltag'){
            return setPosts(allPosts);
        }
        try{
            await db.collection('posts').where('tag','==',tag).get().then(snap=>{
                setPosts(snap.docs.map(doc=>({id:doc.id,data:doc.data()})));
            })
            
        }catch{
            alert('something went wrong')
        }
      }  
   
    const value = {
        posts,
        loading,
        TagPosts,
    }

    return(
        <FeedContext.Provider value={value}>
            {!loading && children}
        </FeedContext.Provider>
    );
}