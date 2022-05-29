import React, { useEffect, useState } from 'react'
import classes from './Welcome.module.css'
import Typewriter from "typewriter-effect";
import { userdb } from '../../firebase';
import SignIn from './forms/SignIn'
import SignUp from './forms/SignUp'
import ForgotPassword from './forms/ForgotPassword'
import Button from '../UI/Button/Button';
import CompleteSignUp from './forms/CompleteSignUp';
import CustomModal from '../UI/Modal/Modal';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ReactGa from 'react-ga'
let form;
const Welcome = () => {
  const [digits, digitsUpdater] = useState(null);
  const [openModal, modalStateUpdater] = useState(-1)
  const isLoggedIn = useSelector(state => state.user).isLoggedIn
  if (openModal === 0)
    form = <SignIn onClose={modalStateUpdater.bind(this, -1)} changeState={modalStateUpdater} isOpen={openModal !== -1} />
  else if (openModal === 1)
    form = <SignUp onClose={modalStateUpdater.bind(this, -1)} changeState={modalStateUpdater} isOpen={openModal !== -1} />
  else if (openModal === 2)
    form = <ForgotPassword onClose={modalStateUpdater.bind(this, -1)} changeState={modalStateUpdater} isOpen={openModal !== -1} />
  else if (openModal === 3)
    form = <CompleteSignUp isOpen={openModal !== -1} />
  useEffect(() => {
    GetCount();
    ReactGa.pageview(window.location.pathname)
  }, [])
  const dynamicText = <Typewriter

    options={{
      autoStart: true,
      loop: true,
      wrapperClassName: classes.typewriter,
      cursorClassName: classes.typewriter
    }}
    onInit={(typewriter) => {
      typewriter
        .typeString("Experts")
        .pauseFor(700)
        .deleteAll()
        .typeString("Friends")
        .pauseFor(700)
        .deleteAll()
        .start();
    }}
  />

  async function GetCount() {
    try {
      let count = (await userdb.get()).docs.length
      let newDigits = []
      while (count) {
        const digit = count % 10
        const element = <div className={classes.digitContainer} key={digit}>
          <span className={classes.digit}>{digit}</span>
          <div className={classes.line} />
        </div>
        newDigits.unshift(element)
        count = Number.parseInt(count / 10);
      }
      digitsUpdater(newDigits)
    }
    catch {
      console.log('error getting counts')
    }
  }
  if (isLoggedIn && openModal === -1)
    return <Redirect to="/" />
  return <>
    <CustomModal isOpen={openModal !== -1} className={classes.modal}>
      {form}
    </CustomModal>
    <div className={classes.welcome}>
      <div className={classes.banner}>
        <h1>Welcome to <span>MissionEd Forum</span></h1>
        <div className={classes.dynamicText}>
          <h3>Learn and Discuss with</h3>
          {dynamicText}

        </div>
        <h3>Win Exciting Rewards</h3>

      </div>
      <div className={classes.btn}>
        <Button onClick={modalStateUpdater.bind(this, 0)}>Login</Button>
        <Button onClick={modalStateUpdater.bind(this, 1)}>Join Now</Button>
      </div>
      <div className={classes.counter}>
        <h3>Connect with friends and meet new people and opportunities</h3>
        <div className={classes.digits}>
          {digits}
        </div>
        <h3>Users &#38; Rising....</h3>
      </div>
      <div className={classes.testimonials}>
        <div className={classes.partners}>
          <h3>Our trusted partners</h3>
          <div>
            <img src="/images/partners/BIET.png" alt="BIET" />
            <img src="/images/partners/Delhi-University.png" alt="Delhi University" />
            <img src="/images/partners/Fampay.png" alt="Fampay" />
            <img src="/images/partners/hyperXchange.png" alt="hyperXchange" />
          </div>
        </div>
        <div className={classes.numbers}>
          <h3>We Catered To</h3>
          <div>
            <div>
              <i className="fas fa-university"></i>
              <p>50+ Colleges</p>
            </div>
            <div>
              <i className="fas fa-school"></i>
              <p>30+ Schools</p>
            </div>
            <div>
              <i className="fas fa-chart-line"></i>
              <p>2+ Startups</p>
            </div>
            <div>
              <i className="fas fa-user-graduate"></i>
              <p>5000+ Students</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}
export default Welcome;