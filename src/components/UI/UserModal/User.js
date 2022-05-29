import { useSelector } from "react-redux"
import { Link, useHistory } from "react-router-dom"
import { followingUpdater } from "../../../apis/User"
import { auth } from "../../../firebase"
import DefaultProfilePic from "../../../helpers/DefaultProfilePic"
import ObjCpy from "../../../helpers/ObjCpy"
import Button from "../Button/Button"
import classes from './User.module.css'
const User = (props) => {
    const following = useSelector(state => state.user).following
    const history = useHistory()
    const messageHandler = () => {
        history.push({
            pathname: "/messages",
            state: {
                partner: {
                    userData: { ...props.data },
                    id: props.id
                }
            }
        })
    }
    const followingHandler = async () => {
        const newFollowing = ObjCpy(following)
        if (!newFollowing.includes(props.id)) {
            newFollowing.push(props.id)
            followingUpdater(newFollowing)
        }
    }
    return <li className={classes.user}>
        <Link
            to={
                {
                    pathname: `/user/${props.id}`,
                    state: {
                        user: props.user.isDeleted ? null : props.user
                    }
                }
            }
            onClick={props.onClose}>
            <img src={props.user.profile_image ? props.user.profile_image : DefaultProfilePic(props.user.username)} alt={props.user.username} />
            <p>{props.user.username}</p>
        </Link>
        {(props.id !== auth.currentUser.uid) && (
            following.includes(props.id) ? <Button className={classes.btn} onClick={messageHandler}>Message</Button> : <Button className={classes.btn} onClick={followingHandler}>Follow</Button>)
        }
    </li>
}
export default User