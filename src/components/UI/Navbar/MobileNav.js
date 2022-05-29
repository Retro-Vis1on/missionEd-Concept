import { NavLink } from 'react-router-dom'
import DefaultProfilePic from '../../../helpers/DefaultProfilePic'
import classes from './MobileNav.module.css'
const MobileNav = (props) => {
    return <nav className={classes.nav}>
        <NavLink to="/network" exact className={`${classes.link} `} activeClassName={`${classes.activeLink} `}>
            <i className="fas fa-user-friends"></i>
        </NavLink>
        <NavLink to="/messages" exact className={`${classes.link} `} activeClassName={`${classes.activeLink} `}>
            <i className="fas fa-comment-alt"></i>
        </NavLink>
        <NavLink to="/" exact className={`${classes.link}`} activeClassName={`${classes.activeLink} `}>
            <i className="fas fa-home" />
        </NavLink>
        <NavLink className={`${classes.link}  ${classes.notifications}`} to="/notifications" activeClassName={`${classes.activeLink} `}>
            <i className={`fas fa-bell ${props.hasNotifi ? classes.hasNotifi : ''}`}></i>
        </NavLink>
        <NavLink to="/profile" className={`${classes.link} `} exact activeClassName={`${classes.activeLink} `}>
            <div className={classes.profilePic}>
                {props.username && <img src={props.profile_image ? props.profile_image : DefaultProfilePic(props.username)} alt={props.username} />}
            </div>
        </NavLink>
    </nav>
}
export default MobileNav