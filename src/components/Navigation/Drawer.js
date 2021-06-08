import React, { useState } from 'react';
import clsx from 'clsx';
import {Link} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
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
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function MenuDrawer(props) {
  const[isOpen, setOpen] = useState()
  const classes = useStyles();
  const {logout} = useAuth()
  const[activeClassName, setActiveClassName] = useState('home');
  const [open, setOpenP] = useState(false);
  const anchorRef = React.useRef(null);

  const handleClick = (prop) => {
    console.log('sldafjaskldj')
    setActiveClassName(prop);
    setOpenP(false);
  }

  const handleToggle = () => {
    setOpenP((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenP(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenP(false);
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
        <React.Fragment>
           <div onClick={toggleDrawer()}  className={'navbar-icons'}>
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
                                <div 
                                className={activeClassName==='home'? 'active-nav-links nav-links' : 'nav-links'}
                                onClick={()=>handleClick('home')}>
                                  <Link to='/' >
                                 <AiFillHome className={'nav-icon'}/>   
                                  </Link>
                                 <text className={'nav-text'}>
                                  Home 
                                 </text>
                                </div>
                                <div
                               className={activeClassName==='network'? 'active-nav-links nav-links' : 'nav-links'} onClick={()=>handleClick('network')}>
                                    <Link to='/network'>

                                <BsFillPeopleFill href={'#'} className={'nav-icon'}/>   
                                    </Link>
                                <text className={'nav-text'}>
                                  Network
                                 </text> 
                               </div>
                               <div
                               className={activeClassName==='messages'? 'active-nav-links nav-links' : 'nav-links'} 
                               onClick={()=>handleClick('messages')}>
                                   <Link to='/messages'>
                               <BsFillChatDotsFill href={'#'} className={'nav-icon'}/>   
                                   </Link>
                               <text className={'nav-text'}>
                                  Messages
                                 </text>  
                              </div>
                              <div
                              className={activeClassName==='notification'? 'active-nav-links nav-links' : 'nav-links'} 
                              onClick={()=>handleClick('notification')}>
                                  <Link>
                              <MdNotifications href={'#'} className={'nav-icon'}/>   
                                  </Link>
                              <text className={'nav-text'}>
                                  Notification
                                 </text>  
                             </div>
                             {/* <div> */}
                             <img 
                                  ref={anchorRef}
                                  onClick={handleToggle}
                                 src={props.image} />
                             {/* </div>         */}
                </div>     
           </motion.nav>

           <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <Link to='/profile' style={{textDecorationLine:'none'}}>
                    <MenuItem onClick={()=>handleClick('')}>Profile</MenuItem>
                    </Link>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
    </div>
  );
}
