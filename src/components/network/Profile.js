import { Link, useHistory } from "react-router-dom"
import DefaultProfilePic from "../../helpers/DefaultProfilePic"
import classes from './Profile.module.css'
import Button from '../UI/Button/Button'
import { useSelector } from "react-redux"
import ObjCpy from "../../helpers/ObjCpy"
import { followingUpdater } from "../../apis/User"
const Profile = (props) => {
    const userUrl = `/user/${props.id}`
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
        if (!newFollowing.includes(props.id))
            newFollowing.push(props.id)
        followingUpdater(newFollowing)
    }
    return <li className={classes.profile}>
        <Link to={userUrl} className={classes.user}>
            <img src={props.data.profile_image ? props.data.profile_image : DefaultProfilePic(props.data.username)} alt={props.data.username} />
            <div className={classes.data}>
                <h2>{props.data.username}</h2>
                <p>{props.data.bio}</p>
            </div>
        </Link>
        {following.includes(props.id) ? <Button className={classes.btn} onClick={messageHandler}>Message</Button> : <Button className={classes.btn} onClick={followingHandler}>Follow</Button>
        }
    </li>
}
export default Profile