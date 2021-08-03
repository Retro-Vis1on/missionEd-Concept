import React from 'react'
import classes from './Banner.module.css';
import { motion } from 'framer-motion';
const Banner = () => {
    return (
        <a href="https://missioned-msat.web.app/" target='blank'>
        <motion.div className={classes.banner}
            whileHover={{ scale: 1.02 ,transition: { duration: 0.2 } }}
        >
            <img className={classes.banner__image} src='Appti.png' alt='apti-holic'/>
        </motion.div>
        </a>
    )
}

export default Banner
