import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { deletePost } from '../../../apis/Post'
import { CachingActions } from '../../../redux/CachingSlice'
import Button from '../../UI/Button/Button'
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner'
import CustomModal from '../../UI/Modal/Modal'
import classes from './DeletePost.module.css'
import ReactGa from 'react-ga'
import { auth } from '../../../firebase'
import Alert from '../../UI/Alert/Alert'
const DeletePost = (props) => {
    const [isLoading, loadingStateUpdater] = useState(false)
    const [error, errorStateUpdater] = useState(null)
    const dispatch = useDispatch()
    const history = useHistory()
    const postId = useParams().id
    const saved = (useSelector(state => state.user)).saved
    useEffect(() => {
        if (props.isOpen)
            ReactGa.modalview(`${postId}:Delete`)
    }, [postId, props.isOpen])
    const deleteHandler = async () => {
        try {
            loadingStateUpdater(true)
            await deletePost(postId, props.tag)
            ReactGa.event({
                category: 'Post',
                action: 'Deleted Post',
                value: {
                    uid: auth.currentUser.uid,
                    postId
                }
            })
            if (saved.saved.includes(postId))
                await props.saveHandler()
            if (props.isCached !== -1) {
                dispatch(CachingActions.deletePost({ index: props.isCached }))
                dispatch(CachingActions.netPostsUpdater({ type: "delPost", tag: props.tag }))
            }
            history.replace('/')
        }
        catch (err) {
            loadingStateUpdater(false)
            errorStateUpdater("Something went wrong on our end!")
        }
    }
    return <>
        <Alert error={error} onClose={errorStateUpdater.bind(this, null)} />
        <CustomModal isOpen={props.open} className={classes.modal}>
            <h2 className={classes.title}>
                Are you sure you want to delete this post?
            </h2>
            {isLoading ?
                <div style={{ textAlign: "center", marginTop: "10px" }}><LoadingSpinner /></div> :
                <div className={classes.modalActions}>
                    <Button onClick={props.onClose}>Cancel</Button>
                    <Button onClick={deleteHandler}>Delete</Button>
                </div>
            }

        </CustomModal>
    </>
}
export default DeletePost