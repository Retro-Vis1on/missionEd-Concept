import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { deletePost } from '../../../apis/Post'
import { CachingActions } from '../../../redux/CachingSlice'
import ReactGa from 'react-ga'
import { auth } from '../../../firebase'
import DeleteModal from './DeleteModal'
const DeletePost = (props) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const postId = useParams().id
    const saved = (useSelector(state => state.user)).saved
    console.log(saved)
    useEffect(() => {
        if (props.isOpen)
            ReactGa.modalview(`${postId}:Delete`)
    }, [postId, props.isOpen])
    const deleteHandler = async () => {
        try {
            await deletePost(postId, props.tag)
            ReactGa.event({
                category: 'Post',
                action: 'Deleted Post',
                value: {
                    uid: auth.currentUser.uid,
                    postId
                }
            })
            if (saved.includes(postId))
                await props.saveHandler()
            if (props.isCached !== -1) {
                dispatch(CachingActions.deletePost({ index: props.isCached }))
                dispatch(CachingActions.netPostsUpdater({ type: "delPost", tag: props.tag }))
            }
            history.replace('/')
        }
        catch (err) {
            throw err
        }
    }
    return <DeleteModal type="post" deleteHandler={deleteHandler} onClose={props.onClose} open={props.open} />

}
export default DeletePost