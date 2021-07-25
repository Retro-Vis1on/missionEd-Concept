import firebase from 'firebase'
import PostForm from '../UI/PostForm/PostForm';
import { useParams } from 'react-router-dom';
import { updateCountOnEdit, updatePost } from '../../apis/Post';
import { useDispatch } from 'react-redux';
import { CachingActions } from '../../redux/CachingSlice';
export default function CreatePost(props) {
  const postId = useParams().id
  const dispatch = useDispatch()
  const editHandler = async (data) => {
    data.lastUpdated = firebase.firestore.FieldValue.serverTimestamp()
    try {
      let oldTag = props.post.tag
      let newTag = data.tag
      await updatePost(postId, data);
      await updateCountOnEdit(oldTag, newTag)
      data.lastUpdated = (new Date()).getTime() + 1000
      if (props.isCached !== -1) {
        dispatch(CachingActions.postUpdate({ index: props.isCached, data: { ...props.post, ...data } }))
        dispatch(CachingActions.netPostsUpdater({ type: "updatePost", oldTag, newTag }))
      }
      props.postDispatcher({ type: "update", data })
    }
    catch (err) {
      throw err
    }
  }
  return <PostForm isOpen={props.isOpen} post={props.post} onClose={props.onClose} sendRequest={editHandler} />
}
