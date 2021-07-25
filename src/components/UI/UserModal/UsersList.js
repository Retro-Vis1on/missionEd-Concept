import { useLocation } from "react-use"
import Button from "../Button/Button"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"
import CustomModal from "../Modal/Modal"
import User from "./User"
import classes from './UsersList.module.css'
const UsersList = (props) => {
    const isCurUser = useLocation().pathname === "/profile"
    const emptyList = props.isLikes ? <p className={classes.empty}>Be the first one to like the post</p> : (props.isFollower ? <p className={classes.empty}>{isCurUser ? "You don't" : `${props.username} doesn't`} have any followers</p> : <p className={classes.empty}>{isCurUser ? "You are" : `${props.username} is`} not following anyone</p>)
    if (props.isLoading)
        return <CustomModal isOpen={props.isOpen} className={classes.modal}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}><LoadingSpinner /></div>
        </CustomModal>
    return <CustomModal isOpen={props.isOpen} className={classes.modal}>
        {props.list.length ? <ul className={classes.list}>
            {props.list.map(user => <User user={user.data} id={user.id} key={user.id} onClose={props.onClose} />)}
        </ul> : emptyList}
        <header className={classes.btn}>
            <Button onClick={props.onClose}>Close</Button>
        </header>

    </CustomModal>
}
export default UsersList