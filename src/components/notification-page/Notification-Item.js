import React,{ useState, useEffect, useRef} from 'react'
import {animate, motion} from 'framer-motion'
import {userdb, db} from './../../firebase';
import CoinLogo from './../../assets/coin.svg' 
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {useAuth} from './../../contexts/AuthContext'
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

export default function NotificationItem(props) {
    const {currentUser} = useAuth();

    const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemove = () => {
    try{
        db.collection(`users/${currentUser.uid}/notifications`).doc(props.id).delete();
    }
    catch{
        console.log('error while deleting !')
    }
    setAnchorEl(null);
  };

    return (
        <div>
            <motion.div 
            initial={{x:-300,opacity:0}}
            animate={{x:0, opacity:1}}
            transition={{duration:0.5,}}
            
            style={{backgroundColor: props.data.seen? 'teal':'#ff7824', color: props.data.seen? 'white':'#222222', cursor:'pointer',display:'flex',flexDirection:'row'}} className={'notification-section-item'}>
            <div>

            {props.data.coins?
                <img src={CoinLogo} width='30px' height='30px'/>
                :
                null
            } 
                <text>{props.data.msg}</text>
            </div>
                <IconButton
                    aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}
                >
                <MoreVertIcon />
                </IconButton>
               <Menu
                    id="fade-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}

                >
                    <MenuItem onClick={handleRemove}
                    style={{fontSize:'12px'}}
                     >
                    <DeleteIcon style={{fontSize:'20px'}}/>Remove from List
                    </MenuItem>
                </Menu>
            </motion.div>
        </div>
    )
}
