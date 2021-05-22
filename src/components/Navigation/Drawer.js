import React, { useState } from 'react';
import clsx from 'clsx';
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
const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function MenuDrawer() {
  const[isOpen, setOpen] = useState()
  const classes = useStyles();
  const {logout} = useAuth()

  async function handleLogout(){
    try{
        await logout()
    }catch{
        alert('Please check your internet connection!')
    }
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
          <ListItem button >
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary={'Home'} />
          </ListItem>
          <ListItem button >
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary={'Friends'} />
          </ListItem>
          <ListItem button >
            <ListItemIcon><MessageIcon /></ListItemIcon>
            <ListItemText primary={'Messages'} />
          </ListItem>
          <ListItem button >
            <ListItemIcon><TurnedInIcon /></ListItemIcon>
            <ListItemText primary={'Saved Post'} />
          </ListItem>
          <ListItem button >
            <ListItemIcon><BookIcon dir="rtl"/></ListItemIcon>
            <ListItemText primary={'My Posts'} />
          </ListItem>
          <ListItem button >
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary={'Profile'} />
          </ListItem>
      </List>
      <Divider />
      <div onClick={()=>handleLogout()}>
      <List>
          <ListItem button >
            <ListItemIcon ><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary={'Logout'} />
          </ListItem>
      </List>
      </div>
    </div>
  );

  return (
    <div>
        <React.Fragment>
           <div onClick={toggleDrawer()}  className={'navbar-icons'}>
             <MenuOpenIcon style={{ fontSize: 40 }}/>
            </div> 
          {/* <Button onClick={toggleDrawer()}>{'right'}</Button> */}
          <Drawer anchor={'right'} open={isOpen} onClose={toggleDrawer()}>
            {list('right')}
          </Drawer>
        </React.Fragment>
      
    </div>
  );
}
