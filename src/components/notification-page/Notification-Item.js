import React,{ useState, useEffect, useRef} from 'react'
import {animate, motion} from 'framer-motion'
import {userdb, db} from './../../firebase';
import CoinLogo from './../../assets/coin.svg' 

export default function NotificationItem(props) {
    return (
        <div>
            <motion.div 
            initial={{x:-300,opacity:0}}
            animate={{x:0, opacity:1}}
            transition={{duration:0.5,}}
            
            style={{backgroundColor: props.data.seen? 'teal':'#ff7824', color: props.data.seen? 'white':'#222222', cursor:'pointer',display:'flex',flexDirection:'row'}} className={'notification-section-item'}>
            {props.data.coins?
                <img src={CoinLogo} width='30px' height='30px'/>
                :
                null
            } 
                <text>{props.data.msg}</text>
            </motion.div>
        </div>
    )
}
