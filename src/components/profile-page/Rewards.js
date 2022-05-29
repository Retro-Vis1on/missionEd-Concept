import React,{Component, useState,useEffect} from 'react'
import { TextField } from "@material-ui/core";
import {RiCoinsLine} from 'react-icons/ri'
import {Button} from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useAuth} from './../../contexts/AuthContext'
import {db, userdb} from './../../firebase'
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import Confetti from 'react-confetti'
import {useWindowSize} from 'react-use';
import {Link} from 'react-router-dom'
import Store from './Store'


export default function Rewards(){
      const{currentUser} = useAuth();
      const[coins ,setCoins] = useState(null);
      const [open, setOpen] = useState(false);
      const { width, height } = useWindowSize();
      const message=()=>{
        console.log("Redeem starts at 500 coins.")
      }

      useEffect(()=>{
         GetCoins();
      },[])
    
      
      useEffect(()=>{
         GetCoins();
      },[])

      async function GetCoins(){
        try{
            await userdb.doc(currentUser.uid).onSnapshot(snap=>{
              setCoins(snap.data().coins)
            })
        }catch{
            console.log('error');
        }
    }
 /*    const message = () => {
 console.log("Hello World!") 
}
useEffect(()=>{
        GetConfetti();
     },[])

     async function GetConfetti()  {  
      try {
      await userdb.doc(currentUser.uid).onSnapshot(snap=>{
        setCoins(snap.data().coins)
        if((snap.data().coins)>=15){
          <Confetti
          width={width}
          height={height}/>
        }}
      )}
      catch{
        console.log('error');
    
        }    
 }*/
  



      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    
      return(
        <div className={'golden'}>

      <div className={'profile-content'}>
       {coins==null?
         <div className={'loading-box'}>
             <div className={'loader'}></div>    
         </div>
                   :
                   <div className={'reward-content'}>
          
          <div className={'coins-section'}   style={{fontWeight:'600',marginTop : '2px',color:'black'}}>
                 <text>My Coins</text>
                 <text className={'coins'}  style={{fontWeight:'600',paddingTop : '2px'}}>
                 <RiCoinsLine/>= {coins}
                 </text>
          </div>
          </div>
        }
        <div className={'reward-content'}>
        { coins>=500?
          <Button
           variant='contained'
           style={{fontWeight:'600',marginTop : '30px',color:'white',borderWidth:'4px',backgroundColor:'#ff7824',marginInline:'30%'}}
           disabled={false}
           fullWidth
           size='large'
           //onClick={()=>handleClickOpen()}
           >
          <Link to='/store'  style={{ color:"white" , textDecoration: 'none'}}> Redeem</Link>
          </Button>
          :
          <Button
           variant='contained'
           style={{fontWeight:'600',marginTop : '30px',color:'white',borderWidth:'4px',backgroundColor:'#ff7824',marginInline:'30%'}}
           disabled={false}
           fullWidth
           size='large'
           onClick={()=>handleClickOpen()}
           >
          <Link to='#'  style={{ color:"white" , textDecoration: 'none'}}> Redeem</Link>
             
          </Button>}
          <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{  textAlign: "center"}} >{"Earn Coins"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Collect 500 coins to unlock amazing gifts!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} 
            style={{ backgroundColor:'#ff7824', color:"white" }}autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
        </div>
     {       
      /*userdb.doc(currentUser.uid).onSnapshot(snap=>{
        setCoins(snap.data().coins)
        snap.data().coins>=15 ?*/
        coins>=500?
           <Confetti
          width={width}
          height={height}/>
          
          
          :
          <div></div>}
          </div>
          </div>

    );
  
}
/*
background: linear-gradient(-45deg, #ee7752, #e7cd3c, #d59723, #fffb04);
	
animation: gradients 15s ease infinite;


@keyframes gradients {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}*/