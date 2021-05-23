import './User.css'
import More from './../../assets/more.svg'
import heart from './../../assets/heart-outline.svg'
import message from './../../assets/messenger.svg'
import friends from './../../assets/friends.svg'
import dots from './../../assets/dots-verticle.svg'
import Default from './../../assets/default.jpg'
import {Button} from '@material-ui/core'
import { useEffect, useState } from 'react'
import {userdb} from './../../firebase'
const Main = (props) =>{
    const[buttonvarient, setButtonVarient] = useState('outlined')
    const[follow, setFollow] = useState('follow')
    const[loading, setLoading] = useState(true);
    const[user,setUser] = useState(null);
    async function handleFollow(){
        if(follow==='follow'){
            setButtonVarient('contained')
            setFollow('following')
        }
        else{
            setButtonVarient('outlined')
            setFollow('follow')
        }
    }
    useEffect(()=>{
        const path = window.location.pathname;
        const id = path.substring(path.lastIndexOf('/')+1);
        GetUser(id);
    },[])

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
    return(
        <div className={'user-view-page'}>
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
                   <img src={Default} alt='' />
                   <div className='user-card-user'>
                   <h5>{user.username}</h5>
                   <h1>{user.name}<span>(21)</span></h1>
                   <Button size='small' onClick={()=>handleFollow()} color='primary' variant={buttonvarient}>{follow}</Button>
                   </div>
            </div>
            <div className='user-menucard'>
                      <div className='user-menucard-item'>
                          <a>
                              <img src={heart} alt=''/>
                              <span>Like</span>
                          </a>
                      </div>
                      <div className='user-menucard-item'>
                          <a>
                              <img src={friends} alt=''/>
                              <span>Friends</span>
                          </a>
                      </div>
                      <div className='user-menucard-item'>
                          <a>
                              <img src={message} alt=''/>
                              <span>Message</span>
                          </a>
                      </div>
                      <div className='user-menucard-item'>
                          <a>
                              <img src={dots} alt=''/>
                              <span>Notification</span>
                          </a>
                      </div>
                
                
            </div>
            </div>}
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