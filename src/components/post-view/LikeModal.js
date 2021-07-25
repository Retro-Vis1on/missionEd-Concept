import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getLikeUsers } from "../../apis/Post"
import UsersList from "../UI/UserModal/UsersList"

const LikeModal = (props) => {
    const [likers, likersStateUpdater] = useState(null)
    const [isLoading, loadingStateUpdater] = useState(true)
    const cacheUsers = useSelector(state => state.cache).authorData

    const dispatch = useDispatch()
    const getLikers = useCallback(async () => {
        await getLikeUsers(props.likes, dispatch, cacheUsers, likersStateUpdater)
        loadingStateUpdater(false)
    }, [props.likes, cacheUsers, dispatch])
    useEffect(() => {
        if (!likers && props.isOpen)
            getLikers()
    }, [props.isOpen, getLikers, likers])
    return <UsersList list={likers ? likers : []} isLoading={isLoading} isOpen={props.isOpen} onClose={props.onClose} isLikes={true} />
}
export default LikeModal