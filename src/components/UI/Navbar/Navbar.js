import React, { useState, } from 'react';
import { Link, NavLink } from "react-router-dom";
import classes from './Navbar.module.css';
import { useSelector } from 'react-redux';
import DefaultProfilePic from '../../../helpers/DefaultProfilePic';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import MobileNav from './MobileNav';
import { markAsSeen } from '../../../apis/User';
function Navbar() {
  const [active, setActive] = useState(false); // for changing background color on scroll
  const { width } = useWindowDimensions()
  const user = useSelector(state => state.user)
  const notifications = useSelector(state => state.notifications).unseen
  const changeBackground = () => {
    if (window.scrollY >= 40) {
      setActive(true);
    }
    else {
      setActive(false);
    }
  }
  window.addEventListener('scroll', changeBackground);
  if (user.isLoggedIn !== true)
    return null
  if (width <= 670)
    return <MobileNav username={user.username} profile_image={user.profile_image} hasNotifi={notifications.length} />

  const notificationList = <ul className={classes.filters}>
    {notifications.length ? notifications.map((notification) => {
      let message = <span className={classes.message}>{notification.data.msg}</span>
      if (notification.data.follower) {
        message = <>
          <span className={classes.message}>
            <Link to={`/user/${notification.data.follower.uid}`}>
              <img src={notification.data.follower.user.profile_image ? notification.data.follower.user.profile_image : DefaultProfilePic(notification.data.follower.user.username)} alt={notification.data.follower.user.username} />
            </Link>
            <span>
              <Link to={`/user/${notification.data.follower.uid}`}>
                {notification.data.follower.user.username}</Link> {notification.data.msg}</span>
          </span>
        </>
      }
      return <li key={notification.id}>
        {message}
        <button className={classes.seen} onClick={() => markAsSeen([notification])}>
          Mark as seen
        </button>
      </li>
    }
    ) : <li style={{ color: "darkgray" }}>No new Notifications</li>}
  </ul>
  return (
    <nav className={`${classes.nav} ${active ? classes.active : ''}`} >
      <div className={classes.brand}>
        <img src="/images/MissionEd_logo.svg" alt="MissionEd Logo" />
        <h1>MissionEd</h1>
      </div>
      <div className={classes.links}>
        <NavLink to="/" exact className={`${classes.link} ${active ? classes.active : ''}`} activeClassName={`${classes.activeLink} ${active ? classes.active : ''}`}>
          <i className="fas fa-home" />
          <p>Home</p>
        </NavLink>
        <NavLink to="/network" exact className={`${classes.link} ${active ? classes.active : ''}`} activeClassName={`${classes.activeLink} ${active ? classes.active : ''}`}>
          <i className="fas fa-user-friends"></i>
          <p>Network</p>
        </NavLink>
        <NavLink to="/messages" exact className={`${classes.link} ${active ? classes.active : ''}`} activeClassName={`${classes.activeLink} ${active ? classes.active : ''}`}>
          <i className="fas fa-comment-alt"></i>
          <p>Messages</p>
        </NavLink>
        <>
          <NavLink to="/notifications" className={`${classes.link} ${active ? classes.active : ''} ${classes.notifications}`} activeClassName={`${classes.activeLink} ${active ? classes.active : ''}`}>
            <i className={`fas fa-bell ${notifications.length ? classes.hasNotifi : ''}`}></i>
            <p>Notifications</p>
          </NavLink>
          {notificationList}
        </>
        <NavLink to="/profile" className={`${classes.link} ${active ? classes.active : ''}`} exact activeClassName={`${classes.activeLink} ${active ? classes.active : ''}`}>
          <div className={classes.profilePic}>
            {user.username && <img src={user.profile_image ? user.profile_image : DefaultProfilePic(user.username)} alt={user.username} />}
          </div>
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar;
