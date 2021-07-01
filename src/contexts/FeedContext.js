import React, { useContext, useEffect, useState } from 'react'
import { db } from './../firebase'
const FeedContext = React.createContext()

export function useFeedContext() {
    return useContext(FeedContext);
}

export function FeedProvider({ children }) {
    const [allPosts, setAllPosts] = useState(null);
    const [posts, setPosts] = useState(null);
    const feedSize = 20;
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [PageData,setPageData] = useState([]);
    const [currentTag, setTag] = useState('alltag');

    useEffect(() => {
        GetPosts();
        GetCount('all');
    }, []);
     
    async function GetCount(){
        try{
          await db.collection('counts').doc('posts').onSnapshot(snap=>{
              let total = snap.data()['all'];
              if(total/feedSize >1){
                  let pages = parseInt(total/feedSize)
                  pages += total%feedSize ? 1:0;
                  setPageCount(pages)
              }
              else {
                  setPageCount(1)
              }
          });
        }
        catch{console.log('something went wrong')}
    }
    async function GetPosts() {
        try {
            
            await db.collection('posts').orderBy('timestamp', 'desc').limit(feedSize).onSnapshot(snap => {
                let posts = snap.docs.map(doc => ({ id: doc.id, data: doc.data() }));
                setPosts(snap.docs.map(doc => ({ id: doc.id, data: doc.data() })));
                setAllPosts(snap.docs.map(doc => ({ id: doc.id, data: doc.data() })));
                setPageData(PageData.concat({posts}))
            })
        } catch {
            alert('something went wrong')
        }
        setLoading(false);
    }

    async function TagPosts(tag) {
        setCurrentPage(1);
        if (tag === 'alltag') {
            return setPosts(allPosts);
        }
        try {
            await db.collection('posts').where('tag','==',tag).limit(10).get().then(snap => {
                setPosts(snap.docs.map(doc => { return ({ id: doc.id, data: doc.data() }) }));
            }).catch(error => console.log(error))
        } catch {
            alert('something went wrong')
        }
        // GetCount(tag);
    }

    const SetPageNo = (num) =>{
        console.log('clicked page'+num);
        console.log('prev page'+currentPage);
        SetPagePost(currentPage,num);
        setCurrentPage(num);
    }

    async function SetPagePost(prev,curr){
        console.log('sdljfklsdj')
        console.log(PageData);
       if(prev<curr){
           if(PageData.length<curr){
           try {
               await db.collection('posts').orderBy('timestamp', 'desc').startAfter(posts[posts.length-1].data.timestamp).limit(feedSize).onSnapshot(snap => {
                   let posts = snap.docs.map(doc => ({ id: doc.id, data: doc.data() }));
                   setPosts(snap.docs.map(doc => ({ id: doc.id, data: doc.data() })));
                   setPageData(PageData.concat({posts}));
                })
            } catch {
                alert('something went wrong')
            }
           }
           else{
               setPosts(PageData[curr-1].posts);
           }
        }
        else{
            setPosts(PageData[curr-1].posts)
        }
    }
    const value = {
        posts,
        loading,
        TagPosts,
        pageCount,
        GetCount,
        currentPage,
        SetPageNo,
        currentTag,
        setTag
    }

    return (
        <FeedContext.Provider value={value}>
            {!loading && children}
        </FeedContext.Provider>
    );
}