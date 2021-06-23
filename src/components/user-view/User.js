import './User.css'
import Default from './../../assets/default.jpg'
import {Button} from '@material-ui/core'
import { useEffect, useState } from 'react'
import {userdb, db} from './../../firebase'
import {useAuth} from './../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {BsChatDotsFill} from 'react-icons/bs'
import {RiUserFollowFill} from 'react-icons/ri'
import {UpdateCoins} from './../../apis/API'
import { Redirect } from 'react-router'
import {UpdateNotificationForFollowers} from './../../apis/NotificationApi'
const Main = (props) =>{
    const{currentUser} = useAuth();
    const[loading, setLoading] = useState(true);
    const[username, setUsername] = useState('someone')
    const[user,setUser] = useState(null);
    const[userId, setUserId] = useState(null);
    const[msgexist,setmsgexist] = useState(false);
    const[following, setFollowing] = useState(false);
    const[allFollowing, setAllFollowing] = useState(null);
   
    useEffect(()=>{
        const path = window.location.pathname;
        const id = path.substring(path.lastIndexOf('/')+1);
        GetUser(id);
        setUserId(id);
        messageExist(id);
        SetFollowing(id);
        // eslint-disable-next-line
    },[])
    async function SetFollowing(id){
        try{
            await db.collection('users').doc(currentUser.uid).onSnapshot(snap=>{
                setUsername(snap.data().username);
                if(snap.data().following!==null){
                    setAllFollowing(snap.data().following);
                    if(snap.data().following){
                        setFollowing(snap.data().following.includes(id))
                    }
                    else{
                        db.collection('users').doc(currentUser.uid).update({
                            following: []
                        })
                    }
                }
            })
        }catch{
           console.log('something went wrong with seting following')
        }
    }

    async function GetUser(id){
        try{
          userdb.doc(id).onSnapshot(snap=>{
              setUser(snap.data())
              console.log(snap.data().profile_image)
          })
        }catch{
            alert('something went wrong!')
        }
        setLoading(false)
    }

    async function messageExist(id){
        try{
             await db.collection('chats').where('users','array-contains-any',[currentUser.uid]).onSnapshot(snap=>{
                 // eslint-disable-next-line
                 snap.docs.map(data=>{ if(data.data().users.includes(id)){
                      setmsgexist(true)
                   }
               })})
           } catch{
               console.log('something went wrong')
           }
    }
    
    async function handleFollow(){
     if(following){
        let index = allFollowing.indexOf(userId)
        setAllFollowing(allFollowing.splice(index,1));
        try{
           await db.collection('users').doc(currentUser.uid).update({
               following: allFollowing
           })
           setFollowing(false);
        }catch{
            console.log('something went wrong')
        }
    }
    else{
        setAllFollowing(allFollowing.push(userId))
        try{
            await db.collection('users').doc(currentUser.uid).update({
                following: allFollowing
            })
            setFollowing(true);
        }
        catch{
            console.log('something went wrong!')
        }
        UpdateNotificationForFollowers(currentUser.uid, username, userId);
    }
}

    async function handleMessage(){
        if(!msgexist){
            try{
               await db.collection('chats').add({
                   users:[currentUser.uid,userId],
               })
               UpdateCoins(currentUser.uid,5)
            }catch{
                console.log('something went wrong!!')
             }
           }        
    }

    return(
        <div className={'user-view-page'}>
            {currentUser==null ? <Redirect to="/welcome"/> : null}
            {loading ? 
            <div className={'loading-box'}>
                <div className={'loader'}></div>
            </div>
            :
            <div>
            {user==null?
                 <div></div>
                 : 
            <div>
            <div className='user-card'>
                   <img src={user.profile_image===undefined ? Default : user.profile_image==='' ? Default : user.profile_image} alt='' />
                   <div className='user-card-user'>
                   <text>{user.username}</text>
                   <h4 style={{borderBottom:'solid 1px'}}>{user.name}</h4>
                   {/* <hr/> */}
                   <text>{user.bio}</text>
                   <text>{user.education}</text>
                   <div className={'profile-location'}><MdLocationOn style={{alignSelf:'center'}}/><text>{user.location}</text></div>
                   </div>
            </div>
            <div className='user-menucard'>
                       <div style={{display:currentUser.uid===userId?'none':'block'}} className='user-menucard-item'>
                          { /* eslint-disable-next-line*/}
                            <a>
                                <Button  size='small' endIcon={<RiUserFollowFill/>} onClick={()=>handleFollow()} variant='outlined' color='primary' >{following? 'following':'follow'}</Button>
                            </a>
                        </div>
                        <div style={{display:currentUser.uid===userId?'none':'block'}} className='user-menucard-item'>
                        { /* eslint-disable-next-line*/}
                            <a>
                            <Link to='/messages' style={{textDecorationLine:'none'}}>
                                <Button size='small' endIcon={<BsChatDotsFill/>} variant='outlined' onClick={()=>handleMessage()} color='primary' >Message</Button>
                             </Link>
                            </a>
                        </div>
            </div>
            </div>
            }
            </div>
            }
        </div>
    )
}
// const Container = styled.div`
//    padding-top: 100px;
//    padding-inline: 15%;
//    @media (max-width:768px){
//     padding-inline: 1%;
//     }
// `;
// const UserCard = styled.div`
//      background-color: white;
//      display: flex;
//      border-radius: 10px;
//      padding:5px;
//      box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
//      img{
//          width: 150px;
//          height: 150px;
//          border: solid 0.5px;
//          border-radius: 50%;
//          /* margin-left: 20px; */
//          margin-top: 20px;
//      }
    
//      @media (max-width:768px){
//          flex-direction: column;
//          img{
//              align-self: center;
//          }
//      }
// `;
// const User = styled.div`
//      align-self:flex-end;
//      width: 100%;
//      border-top:solid rgba(0,0,0,0.08);
//      h1{
//          font-size: 22px;
//      }
//      @media (max-width:768px){
//        text-align: center;
//    }
// `;
// const MessageButton = styled.a`
//    position: relative;
//    margin-top: 10px;
//    margin-right:10px ;
//    display: flex;
//    height: 28px;
//    button{
//        background-color: blueviolet;
//        color:white  ;
//        border-radius: 10px;
//        font-size: 15px;
//        outline: none;
//        border:none;
//        padding:5px;
//        border: solid 0.5px blueviolet;
//    }
//    img{
//          width: initial;
//          height: initial;
//          border: none;
//          /* background-color: blueviolet; */
//          margin-left: 0;
//          margin-top: 0;
//    }
//    img:hover{
//        background-color: rgba(0,0,0,0.1);
//    }
//    button:hover{
//        background-color: white;
//        color: blueviolet;
//    }
//    @media (max-width:768px){
//        display: none;
//    }
// `;
// const MenuCard = styled.div`
//      margin-top: 10px;
//      background-color: white;
//      display: flex;
//      justify-content: center;
//      border-radius: 10px;
//      padding:5px;
//      box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
// `;
// const Nav = styled.div`
   
//     display: block;
//     @media (max-width: 768px){
//         position: fixed;
//         left: 0; 
//         bottom:0;
//         background-color:white;
//         width: 100%
//     }
// `;
// const NavListWrap = styled.ul`
//    display:flex;
//    flex-wrap: nowrap;
//    list-style-type: none;
//    /* justify-content: space-between; */
//    .active{
//        span:after {
//            content: "";
//            transform: scaleX(1);
//            border-bottom: 2px solid var(--white, #fff);
//            position: absolute;
//            bottom: 0;
//            left: 0;
//            transition: transform 0.2s ease-in-out;
//            width: 100%;
//            border-color: rgba(0,0,0,0.9);
//        }
//    }
// `;
// const NavList = styled.li`
//    display: flex;
//    align-items: center;
//    a{
//        align-items:center;
//        background-color: transparent;
//        display: flex;
//        flex-direction: column;
//        font-size:12px;
//        font-weight:400;
//        justify-content: center;
//        min-height: 42px;
//        min-width: 80px;
//        position: relative;
//        text-decoration: none;
//       span{
//        color: rgba(0,0,0, 0.6);
//        display:flex;
//        align-items:center;
//        cursor: pointer;
//       }
//    }
//    @media (max-width: 760px){
//        min-width:70px;
//    }
//    &:hover,
//     &:active{
//        a{
//           span{
//               color: rgba(0,0,0,0.9);
//           }
//        }
//    }
// `;
// const mapStateToProps = (state) =>{
//     return{
//         user: state.userState.user,
//     }
// }
export default Main;