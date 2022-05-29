import DefaultProfilePic from "../../helpers/DefaultProfilePic"
import classes from './Messages.module.css'
const User = (props) => {
    return <li onClick={props.onClick} className={`${classes.user} ${props.isActive ? classes.active : ''}`}>
        <img src={props.partner.userData.profile_image ? props.partner.userData.profile_image : DefaultProfilePic(props.partner.userData.username)} alt={props.partner.userData.username} />
        <p>{props.partner.userData.username}</p>
    </li>
}
export default User