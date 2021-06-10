import React,{useEffect,useState} from 'react'
import './Network.css'
// import {FaPlusSquare} from 'react-icons/fa'
// import {GiThreeFriends} from 'react-icons/gi'
// import Profile from './Profile'
// import {FaInbox} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import Tab from './Tab'
import Profile from './Profile'
import {userdb} from './../../firebase'
import {useAuth} from './../../contexts/AuthContext'


export default function Network(){
     const[activeTab,setActiveTab] = useState('followers');
     const{currentUser}  = useAuth();
     const [value, setValue] = React.useState(0);
     const[allFollowing, setAllFollowing] = useState([]);
     const[allFollower, setAllFollwer] = useState(null);
     const[allUsers, setAllUsers] = useState([]);
     useEffect(()=>{
       GetFollower();
       GetAllFollowing();
      },[])

   async function GetFollower(){
    try{
      await userdb.where('following','array-contains-any',[currentUser.uid]).onSnapshot(snap=>{
         setAllFollwer(snap.docs.map(data=>{return data.id}));
        })
    } catch{
      console.log('something went wrong')
    }
   }
   async function GetAllFollowing(){
    try{
      userdb.doc(currentUser.uid).onSnapshot(snap=>{
        if(snap.exists){
          setAllFollowing(snap.data().following)
          AllUsers(snap.data().following);
        }
      })
    } catch{
      console.log('something went wrong!')
    }
   }
   async function AllUsers(array){
     try{
      userdb.doc(currentUser.uid).get().then(data=>{
           let a = data.data().following;
           userdb.where('following','array-contains-any',[currentUser.uid]).get().then(data=>{
             let b = data.docs.map((data)=>{return data.data().username})    
            userdb.onSnapshot(snap=>{
                setAllUsers(snap.docs.map(data=>{return data.id}));
               })      
           })
      })
     }catch{
       console.log('something went wrong!')
     }
   }
    return(
      <div className={'network-page'}>
        <div className='network-category-box'>
          <div>
            <button onClick={()=>setActiveTab('followers')} className={activeTab==='followers' ? 'network-category-button network-category-button-active' : 'network-category-button'}>Followers</button>
            <button onClick={()=>setActiveTab('following')} className={activeTab==='following' ? 'network-category-button network-category-button-active' : 'network-category-button'}>Following</button>
            <button onClick={()=>setActiveTab('recomended')} className={activeTab==='recomended' ? 'network-category-button network-category-button-active' : 'network-category-button'}>Recomended</button>
          </div>
        </div>
        <div style={{height:'5px'}}>
        </div>
        <div className='network-tabs'>
        <div style={{display:activeTab=='followers'? null:'none'}}>
          {allFollower==null ?
              <div className='loading-box'>
              <p>No one is following you!</p>
             </div>
              :
              <div>
          {!allFollower.length?
               <div className='loading-box'>
               <p>No one is following you!</p>
              </div>
              :<div>
                {allFollower.map(data=>{
                  return(
                    <Link style={{textDecorationLine:'none'}} to={`/user/${data}`}>
                    <Profile data={data}/>
                    </Link>
                  ) 
                })}
              </div>
              }
              </div>
           }
        </div>
        <div style={{display:activeTab=='following'? null:'none'}}>
              {allFollowing==null ?
                      <div className='loading-box'>
                        <p>you are not following anyone!</p>
                       </div>
                :
                <div>
                {allFollowing.length==0 ? 
                   <div className='loading-box'>
                   <p>you are not following anyone!</p>
                  </div>
                :<div>
                  {allFollowing.map(data=>{
                    return(
                      <Link style={{textDecorationLine:'none'}} to={`/user/${data}`}>
                      <Profile data={data}/>
                      </Link>
                    ) 
                  })}
                </div>
                }
                 </div>}
          </div>    
          <div style={{display:activeTab=='recomended'? null:'none'}}>
              {!allUsers.length ?
                      <div className='loading-box'>
                        <div className='loader'></div>
                       </div>
                :
                <div>
                  {allUsers.map(data=>{
                    return(
                      <Link style={{textDecorationLine:'none'}} to={`/user/${data}`}>
                      <Profile data={data}/>
                      </Link>
                    ) 
                  })}
                 </div>}
          </div> 
          </div>   
        </div>
    );
  
}