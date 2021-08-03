import PostForm from '../../UI/PostForm/PostForm';
import { useParams } from 'react-router-dom';
import { updateCountOnEdit, updatePost } from '../../../apis/Post';
import { useDispatch } from 'react-redux';
import { CachingActions } from '../../../redux/CachingSlice';
import { useEffect } from 'react';
import ReactGa from 'react-ga'
import { auth } from '../../../firebase';
export default function CreatePost(props) {
  const postId = useParams().id
  const dispatch = useDispatch()
  useEffect(() => {
    if (props.isOpen)
      ReactGa.modalview(`${postId}:Edit`)
  }, [postId, props.isOpen])
  const editHandler = async (data) => {
    try {
      let oldTag = props.post.tag
      let newTag = data.tag
      data.lastUpdated = (new Date()).getTime()
      await updatePost(postId, data);
      ReactGa.event({
        category: 'Post',
        action: 'Deleted Post',
        value: {
          uid: auth.currentUser.uid,
          postId
        }
      })
      await updateCountOnEdit(oldTag, newTag)
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
