import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createNewPost } from "../../apis/Feed"
import { CachingActions } from "../../redux/CachingSlice"
import PostForm from "../UI/PostForm/PostForm"
import Alert from '../UI/Alert/Alert'
import { auth } from "../../firebase"
import { UpdateCoins } from "../../apis/API"
import { UpdateNotificationForCoins } from "../../apis/NotificationApi"
const CreatePost = (props) => {
    const [error, errorStateUpdater] = useState(null)
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const createPost = async (data) => {
        try {
            const date = new Date()
            data.timestamp = date
            data.liked = []
            data.user = auth.currentUser.uid
            const id = await createNewPost(data)
            data.timestamp = (data.timestamp).getTime()
            UpdateCoins(auth.currentUser.uid, 10);
            UpdateNotificationForCoins(auth.currentUser.uid, 10, 'creating post !!');
            dispatch(CachingActions.newPost({ data, id, user }))
            dispatch(CachingActions.netPostsUpdater({ type: "newPost", tag: data.tag }))
        }
        catch (err) {
            errorStateUpdater(err.message)
        }
    }
    return <>
        <Alert error={error} onClose={errorStateUpdater.bind(this, null)} />
        <PostForm isOpen={props.isOpen} onClose={props.onClose} sendRequest={createPost} />
    </>
}
export default CreatePost