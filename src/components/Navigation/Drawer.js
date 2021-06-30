import React, { useState, useEffect, useRef} from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import clsx from 'clsx';
import {Link} from 'react-router-dom'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MessageIcon from '@material-ui/icons/Message';
import MailIcon from '@material-ui/icons/Mail';
import SaveIcon from '@material-ui/icons/Save';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import TurnedInIcon from '@material-ui/icons/TurnedIn';
import BookIcon from '@material-ui/icons/Book';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import PeopleIcon from '@material-ui/icons/People';
import {useAuth} from './../../contexts/AuthContext'
import {animate, motion} from 'framer-motion'
import {BsPersonFill,BsFillPeopleFill,BsFillChatDotsFill,BsEnvelopeFill,BsFillAwardFill,BsBriefcaseFill,BsFillPieChartFill} from 'react-icons/bs'
import {AiFillHome} from 'react-icons/ai'
import {MdNotifications} from 'react-icons/md'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Menu from '@material-ui/core/Menu';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import Badge from '@material-ui/core/Badge';
import {userdb, db} from './../../firebase';
import {RiCoinsLine} from 'react-icons/ri'
import CoinLogo from './../../assets/coin.svg' 
import { Redirect } from 'react-router';
import { withRouter } from 'react-router';
import NotificationItem from './NotificationItem'
const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

 function MenuDrawer(props) {
  const {currentUser} = useAuth();
  const [numberNote, setNumberNote] = useState(0);
  const [notifications, setNotifications] = useState(null);
  const[isOpen, setOpen] = useState()
  const classes = useStyles();
  const {logout} = useAuth()
  const[activeClassName, setActiveClassName] = useState('home');
  const [open, setOpenP] = useState(false);
  const [notopen, setopennot] = useState(false);
  const anchorRef = useRef(null);
  const notRef = useRef(null);
  

  useEffect(()=>{
    GetNotificationCount();
    GetNotification();

    // console.log(window.screen.width);

    // Tutorial for large screen size
    if(window.screen.width > 760 && localStorage.getItem('introNavState') != 'shown'){
      introJs().setOptions({
        disableInteraction: true,
        steps: [{
          title: 'Welcome',
          intro: '<p>Welcome to MissionEd Forum! 👋</p>'
        },
        {
          title: 'Network',  
          element: document.querySelector('.network-intro '),
          intro: '<p>Connect with potential recruiters. Collabrate with your friends.</p>'
        },
        {
          title: 'Message',
          element: document.querySelector('.messages-intro '),
          intro: '<p>Keeps you connected with your friends and potential recruiters.</p>'
        },
        {
          title: 'Notification',
          element: document.querySelector('.notification-intro '),
          intro: '<p>Check all new notifications. Use coins to get exciting offers.</p>'
        },
        {
          title: 'Profile',
          element: document.querySelector('.profile-intro '),
          intro: '<p>Manage and update your profile.</p>'
        }]
      }).start().oncomplete(()=>{
        localStorage.setItem('introNavState','shown');
      }).onexit(()=>{
        localStorage.setItem('introNavState','shown');
      });
      

    // Tutorial for small screen size
    }
    if(window.screen.width <= 760 && localStorage.getItem('introNavSmallState') != 'shown'){
      introJs().setOptions({
        disableInteraction: true,
        steps: [{
          title: 'Welcome',
          intro: '<p>Welcome to MissionEd Forum! 👋</p>'
        },
        {
          title: 'Notification',
          element: document.querySelector('.notification-intro-2 '),
          intro: 'Check all new notifications. Use coins to get exciting offers.'
        },
        {
          title: 'Network',  
          element: document.querySelector('.dropdown-intro '),
          intro: 'Connect with potential recruiters. Collabrate with your friends.'
        },
        {
          title: 'Message',
          element: document.querySelector('.dropdown-intro '),
          intro: 'Keeps you connected with your friends and potential recruiters.'
        },
        {
          title: 'Profile',
          element: document.querySelector('.dropdown-intro '),
          intro: 'Manage and update your profile.'
        }]
      }).start().oncomplete(()=>{
        localStorage.setItem('introNavSmallState','shown');
      }).onexit(()=>{
        localStorage.setItem('introNavSmallState','shown');
      });
      

    }
 

  },[])
  
  async function GetNotificationCount(){
    try{
        db.collection(`users/${currentUser.uid}/notifications`).where('seen','==', false).onSnapshot(snap=>{
           setNumberNote(snap.docs.length);
        })
    }catch{
      console.log('something went wrong!')
    }
  }


  async function GetNotification(){
    try{
        db.collection(`users/${currentUser.uid}/notifications`).orderBy('timestamp','desc').limit(6).onSnapshot(snap=>{
           setNotifications(snap.docs.map((data)=>{return data.data()}));
        })
    }catch{
      console.log('something went wrong!')
    }
  }

  const handleClick = (prop) => {
    setActiveClassName(prop);
    setOpenP(false);
  }

  const handleToggle = () => {
    setOpenP(!open);
  };
  const handleToggleNot = () => {
    setopennot(!notopen);
  };

  const handleCloseNot = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpenP(false);
  };
  const handleClose = (event) => {
    if (notRef.current && notRef.current.contains(event.target)) {
      return;
    }
    setopennot(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenP(false);
    }
  }
  function handleListKeyDownNot(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setopennot(false);
    }
  }

  // return focus to the button when we transitioned
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  async function handleLogout(){
    try{
        await logout();
        props.history.push("/welcome") 
    }catch{
        alert('Please check your internet connection!')
    }
    handleClose();
   }

  const toggleDrawer = (anchor, open) => (event) => {
     setOpen(!isOpen)
  };
  
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer()}
      onKeyDown={toggleDrawer()}
    >
      <List>
        <ListItem>
        <ListItemIcon><ChevronRightOutlinedIcon/></ListItemIcon>
        </ListItem>
      </List>
      <Divider />
        <List>
            <Link style={{textDecorationLine:'none',color:'#444753'}} to='/'>
            <ListItem button >
              <ListItemIcon><HomeIcon style={{color:'#444753'}}/></ListItemIcon>
              <ListItemText primary={'Home'} />
            </ListItem>
            </Link>
            <Link style={{textDecorationLine:'none',color:'#444753'}} to='/network'>
            <ListItem button >
              <ListItemIcon><PeopleIcon style={{color:'#444753'}}/></ListItemIcon>
              <ListItemText primary={'Network'} />
            </ListItem>
            </Link>
            <Link style={{textDecorationLine:'none',color:'#444753'}} to='/messages'>
            <ListItem button >
              <ListItemIcon><MessageIcon style={{color:'#444753'}}/></ListItemIcon>
              <ListItemText primary={'Messages'} />
            </ListItem>
            </Link>
            <Link style={{textDecorationLine:'none',color:'#444753'}} to='/profile'>
            <ListItem button >
              <ListItemIcon><AccountCircleIcon style={{color:'#444753'}}/></ListItemIcon>
              <ListItemText primary={'Profile'} />
            </ListItem>
            </Link>
        </List>
      <Divider />
      <div onClick={()=>handleLogout()}>
      <List>
          <ListItem button >
            <ListItemIcon ><ExitToAppIcon style={{color:'#444753'}}/></ListItemIcon>
            <ListItemText primary={'Logout'} />
          </ListItem>
      </List>
      </div>
    </div>
  );

  return (
    <div>
      <div className={'drawer-class'}>
              <div className={'notification-intro-2'}
              ref={notRef}
              onClick={handleToggleNot}>
              <Badge badgeContent={numberNote} color="secondary" style={{position:'absolute',marginLeft:'50px',marginTop:'5px'}}>
              </Badge>
              <MdNotifications href={'#'} className={'nav-icon'}/>    
            </div>
        <React.Fragment>
           <div onClick={toggleDrawer()}  className={'navbar-icons dropdown-intro'}>
             <MenuOpenIcon style={{ fontSize: 40, color:'#E3E3E3' }}/>
            </div> 
          <Drawer anchor={'right'} open={isOpen} onClose={toggleDrawer()}>
            {list('right')}
          </Drawer>
        </React.Fragment>
      </div>
        <motion.nav
              initial={{x:-300,opacity:0}}
              animate={{x:0, opacity:1}}
               transition={{duration:1,}}
              >
               
                <div className={'list'}>       
                                <Link to='/' >
                                <div 
                                className={activeClassName==='home'? 'active-nav-links nav-links' : 'nav-links'}
                                onClick={()=>handleClick('home')}>
                                 <AiFillHome className={'nav-icon'}/>   
                                 <text className={'nav-text'}>
                                  Home 
                                 </text>
                                </div>
                                  </Link>
                                <Link to='/network'>
                                  <div
                                  className={activeClassName==='network'? 'active-nav-links nav-links network-intro' : 'nav-links network-intro'} onClick={()=>handleClick('network')}>

                                  <BsFillPeopleFill href={'#'} className={'nav-icon'}/>   
                                  <text className={'nav-text'}>
                                    Network
                                  </text> 
                                </div>
                                </Link>
                                <Link to='/messages'>
                                    <div
                                    className={activeClassName==='messages'? 'active-nav-links nav-links messages-intro' : 'nav-links messages-intro'} 
                                    onClick={()=>handleClick('messages')}>
                                    <BsFillChatDotsFill href={'#'} className={'nav-icon'}/>   
                                    <text className={'nav-text'}>
                                        Messages
                                      </text>  
                                    </div>
                              </Link>
                              <Link
                                 ref={notRef}
                                 onClick={handleToggleNot}
                              >
                                  <div
                                  className={'nav-links notification-intro'} 
                                
                                  >
                                  <Badge badgeContent={numberNote} color="secondary" style={{position:'absolute',marginLeft:'50px',marginTop:'5px'}}>
                                  </Badge>
                                  <MdNotifications href={'#'} className={'nav-icon'}/>   
                                  <text className={'nav-text'}>
                                      Notification
                                    </text>  
                                </div>
                              </Link>
                             <div className={'profile-intro'}>
                             <img 
                                 style={{marginLeft:'30px'}}
                                 ref={anchorRef}
                                 onClick={handleToggle}
                                 src={props.image} />
                              </div>
                </div>     
           </motion.nav>

           <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper style={{backgroundColor:'#575b6d',boxShadow:'4px 4px 15px 0px rgba(0,0,0,0.72)'}}>
                <ClickAwayListener onClickAway={handleCloseNot}>
                  <MenuList autoFocusItem={open}  onKeyDown={handleListKeyDown}>
                    <Link to='/profile' style={{textDecorationLine:'none'}}>
                    <MenuItem  onClick={()=>handleClick('')} 
                     style={{color:'white',backgroundColor:'#ff7824',borderRadius:'10px',marginInline:'3px'}}> 
                      <img  src={props.image}/>
                      <div style={{display:'flex',flexDirection:'column'}}>
                      <text style={{fontSize:'12px'}}>{props.username}</text>
                      <text>{props.name}</text>
                      <text style={{fontSize:'12px'}}>Profile</text>
                      </div>
                    </MenuItem>
                    </Link>
                    <MenuItem className='drawerpopup' onClick={handleLogout} style={{color:'white',fontSize:'18px'}}>
                      <ExitToAppIcon style={{fontSize:'30px'}}/>
                      <text style={{marginLeft:'22px'}}>Log out</text>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <div className='notification-popup'>
        <Popper open={notopen} anchorEl={notRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper style={{backgroundColor:'#575b6d',width:'240px',maxHeight:'450px',boxShadow:'4px 4px 15px 0px rgba(0,0,0,0.72)'}}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={notopen}  onKeyDown={handleListKeyDownNot}>
                    {notifications==null?
                        <div></div>
                        :
                        <div>
                        {notifications.map((data)=>{
                          return(
                            <Link to='/notifications' onClick={handleClose} style={{textDecorationLine:'none',}}>
                            <div style={{backgroundColor: data.seen? 'teal':'#ff7824', color: data.seen? 'white':'black', cursor:'pointer',display:'flex',flexDirection:'row'}} className={'notification-item'}>
                            {data.coins?
                              <img src={CoinLogo} style={{alignSelf:'center'}}/>
                              :
                              null
                            } 
                             <NotificationItem data={data}/>
                            </div>
                            </Link>
                          );
                        })}
                      </div>
                    }
                    <div style={{textAlign:'center'}}>
                  <Link to='/notifications' onClick={handleClose} style={{color:'white'}}>
                  <text>View All</text>
                  </Link>
                    </div>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}

export default withRouter(MenuDrawer);