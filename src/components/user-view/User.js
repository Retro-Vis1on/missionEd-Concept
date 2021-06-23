import './User.css'
import More from './../../assets/more.svg'
import followIcon from './../../assets/connect.svg'
import message from './../../assets/messenger.svg'
import friends from './../../assets/friends.svg'
import dots from './../../assets/dots-verticle.svg'
import Default from './../../assets/default.jpg'
import {Button} from '@material-ui/core'
import { useEffect, useState } from 'react'
import {userdb, db} from './../../firebase'
import {useAuth} from './../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import Icon from '@material-ui/core/Icon';
import {MdLocationOn} from 'react-icons/md'
import {BsChatDotsFill} from 'react-icons/bs'
import {RiUserFollowFill} from 'react-icons/ri'
import {UpdateCoins} from './../../apis/API'
import { Redirect } from 'react-router'
import styled from 'styled-components';
import FeedItem from './../Feed/Feed-item';
import {useFeedContext} from './../../contexts/FeedContext';
import {UpdateNotificationForFollowers} from './../../apis/NotificationApi'
const Main = (props) =>{
    const{currentUser} = useAuth();
    const[buttonvarient, setButtonVarient] = useState('outlined')
    const[follow, setFollow] = useState('follow')
    const[loading, setLoading] = useState(true);
    const[username, setUsername] = useState('someone')
    const[user,setUser] = useState(null);
    const[userId, setUserId] = useState(null);
    const[msgexist,setmsgexist] = useState(false);
    const[following, setFollowing] = useState(false);
    const[allFollowing, setAllFollowing] = useState(null);
    const {posts}  = useFeedContext();
   
    useEffect(()=>{
        const path = window.location.pathname;
        const id = path.substring(path.lastIndexOf('/')+1);
        GetUser(id);
        setUserId(id);
        messageExist(id);
        SetFollowing(id);
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
          })
        }catch{
            alert('something went wrong!')
        }
        setLoading(false)
    }

    async function messageExist(id){
        try{
             await db.collection('chats').where('users','array-contains-any',[currentUser.uid]).onSnapshot(snap=>{
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
            <Container>
                <Background>

                </Background>
                <MainPage>
                    <UserInfo>
                        <UserTop>
                            <img src={user.profile_image==null ? Default : user.profile_image=='' ? Default : user.profile_image} alt=''/>
                            <p>{user.name}</p>
                            <span>{user.username}</span>
                            <div>
                                <MdLocationOn style={{alignSelf:'center'}}/>
                                <text>{user.location}</text>
                            </div>
                        </UserTop>
                        <Details>
                            <Email>
                                <h5>Email</h5>
                                <p>{user.email}</p>
                            </Email>
                            <Bio>
                                <h5>Bio</h5>
                                <p>{user.bio}</p>
                            </Bio>
                            <Education>
                                <h5>Education</h5>
                                <p>{user.education}</p>
                            </Education>
                            <Coins>
                                <h5>Coins</h5>
                                <p>{user.coins}</p>
                            </Coins>
                        </Details>
                    </UserInfo>
                    <Post>
                        <Top>
                            <PostNumber>
                                <span>Posts</span>
                                <h4>00</h4>
                            </PostNumber>
                            <FollowerNumber>
                                <span>Followers</span>
                                <h4>00</h4>
                            </FollowerNumber>
                            <FollowingNumber>
                                <span>Following</span>
                                <h4>{user.following ? user.following.length : '00'}</h4>
                            </FollowingNumber>
                        </Top>
                        <Buttons>
                            <div style={{display:currentUser.uid===userId?'none':'block'}} className='user-menucard-item'>
                                <a>
                                <Button   endIcon={<RiUserFollowFill/>} onClick={()=>handleFollow()} variant="contained" style={{backgroundColor : '#ff471a'}}  >{following? 'following':'follow'}</Button>
                                </a>
                            </div>
                            <div style={{display:currentUser.uid===userId?'none':'block'}} className='user-menucard-item'>
                                <a>
                                <Link to='/messages' style={{textDecorationLine:'none'}}>
                                    <Button  endIcon={<BsChatDotsFill/>}  onClick={()=>handleMessage()} variant="contained" style={{backgroundColor : '#ff471a'}} >Message</Button>
                                </Link>
                                </a>
                            </div>
                        </Buttons>   
                        <Activity>
                            <Title>
                                Recent Activity
                            </Title>
                            <Feed>
                                <h4>Posts</h4>
                                <hr style={{height:'3px',backgroundColor:'#7C7E7F',marginTop : '1px'}}/>
                                {posts.map(data=>{
                                 return <FeedItem id={data.id} data={data.data}/>
                                    })
                                }
                            </Feed>
                        </Activity>
                    </Post>
                </MainPage>
            </Container>
            }
            </div>
            }
        </div>
    )
}
const Container = styled.div`
    max-width: 1200px;
    margin-left : auto;
    margin-right: auto;
    
`;
const Background = styled.div`
    height : 170px;
    background-color: #ff471a;
`;
const MainPage = styled.div`
    display: grid;
    grid-template-columns: 3fr 7fr;
    @media (max-width : 860px) {
        grid-template-columns: 12fr;
    }
`;
const UserInfo = styled.div`
    padding : 10px;
    background-color: #f2f2f2;
    @media (max-width : 860px) {
        text-align : center;
    }
`;
const Post = styled.div`
    height : 60px;
    padding-left : 15px;
    margin-top : 15px;
`;
const UserTop = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top : -60px;
    img {
        width : 170px;
        border-radius: 50%;
    }   
    p {
        margin-top : 10px;
        font-size: x-large;
    }
    span {
        margin-top : -20px;
    }
    div {
        margin-top : -5px;
    }
`;
const Details = styled.div`
    @media (max-width : 768px) {
        display : none;
    }
`;
const Bio = styled.div`
`;
const Education = styled.div``;
const Email=styled.div`
    margin-top : 15px;
`;
const Coins=styled.div``;

const Top = styled.div`
    display: flex;
    justify-content: space-between;
`;
const PostNumber = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size : 24px;
    font-weight: 500;
    h4 {
        color : #ff471a;
    }
    @media (max-width : 450px) {
        
    }
`;
const FollowerNumber = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size : 24px;
    font-weight: 500;
    h4 {
        color : #ff471a;
    }
`;
const FollowingNumber = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size : 24px;
    font-weight: 500;
    h4 {
        color : #ff471a;
    }
`;
const Buttons = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top : 10px;
`;
const Activity = styled.div`
    margin-top : 40px;
`;
const Title = styled.h2``;

const Feed = styled.div`
    margin-top: 30px;
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
    h4 {
        margin-left: 15px;
        padding-top : 10px;
    }
`;
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
export default Main;