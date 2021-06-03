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
export default function Rewards(){
      const{currentUser} = useAuth();
      const[coins ,setCoins] = useState(null);
      const [open, setOpen] = useState(false);
      
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


      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
      return(
      <div className={'profile-content'}>
       {coins==null?
         <div className={'loading-box'}>
             <div className={'loader'}></div>    
         </div>
                   :
        <div className={'reward-content'}>
          
          <div className={'coins-section'}>
                 <text>Your Coins</text>
                 <text className={'coins'}>
                 <RiCoinsLine/>= {coins}
                 </text>
          </div>
          </div>
        }
        <div className={'reward-content'}>
          <Button
           variant='contained'
           style={{fontWeight:'600',marginTop : '30px',color:'white',borderWidth:'4px',backgroundColor:'#ff7824',marginInline:'30%'}}
           disabled={false}
           fullWidth
           size='large'
           onClick={()=>handleClickOpen()}
           >
           Redeem
          </Button>
         
        </div>
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle style={{textAlign:'center'}} id="alert-dialog-title">Rewards will available soon!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            start collecting rewards you will be able to redeem them soon. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='contained' color="primary">
            OKAY
          </Button>
        </DialogActions>
        </Dialog>
        </div>
    );
  
}