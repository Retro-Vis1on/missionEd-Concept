import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { getFollowers, getUserData, getUserPosts } from '../../apis/User'
import { auth } from '../../firebase'
import { GetPost } from '../../apis/Post'
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner'
import UserView from '../UI/User/UserView'
import { useHistory } from 'react-router-dom'
import CustomModal from '../UI/Modal/Modal'
import Button from '../UI/Button/Button'
import classes from './Forms.module.css'
export default function Profile() {
    const user = useSelector(state => state.user)
    const cache = useSelector(state => state.cache)
    const history = useHistory()
    const [data, dataUpdater] = useState(null)
    const [postState, postStateUpdater] = useState(0)
    const [isLoading, loadingStateUpdater] = useState(true)
    const [isSignOut, signOutStateUpdater] = useState(false)
    const getData = useCallback(async () => {
        let following = []
        for (let uid of user.following) {
            let user = cache.authorData.find(user => user.id === uid)
            if (!user) {
                user = await getUserData(uid)
                if (!user)
                    continue
            } else user = user.author
            following.push({ data: user, id: uid })
        }
        let follower = []
        if (!auth.currentUser)
            return
        const followerData = await getFollowers(auth.currentUser.uid)
        for (let data of followerData) {
            follower.push({ data: data.data(), id: data.id })
        }
        if (!auth.currentUser)
            return
        const recentActivity = await getUserPosts(auth.currentUser.uid)
        let posts = []
        for (let post of recentActivity) {
            posts.push({ data: post.data(), id: post.id })
        }
        let saved = []
        for (let post of user.saved) {
            const postData = await GetPost(post)
            if (!post)
                continue;
            saved.push({ data: postData, id: post })

        }
        let applied = []
        for (let post of user.applied) {
            const postData = await GetPost(post)
            if (!post)
                continue;
            applied.push({ data: postData, id: post })

        }
        dataUpdater({ follower, following, saved, posts, applied })
        loadingStateUpdater(false)
    }, [cache, user])
    useEffect(() => {
        getData()
    }, [getData])
    if (isLoading)
        return <div style={{ textAlign: "center" }}><LoadingSpinner /></div>
    return <><UserView
        {...user}
        {...data}
        setRecent={postStateUpdater.bind(this, 0)}
        setSaved={postStateUpdater.bind(this, 1)}
        setApplication={postStateUpdater.bind(this, 2)}
        postState={postState}
        posts={
            postState === 0 ? data.posts : postState === 1 ? data.saved : data.applied
        }
        btn1={
            {
                text: "Settings",
                onClick: () => history.push('/profile/settings')
            }
        }
        btn2={{
            text: "Sign Out",
            onClick: signOutStateUpdater.bind(this, true)
        }}
    />
        <CustomModal isOpen={isSignOut} className={classes.modal}>
            <h2 className={classes.title}>Are you sure you want to <span>sign out?</span></h2>
            <div className={classes.formActions}>
                <Button onClick={signOutStateUpdater.bind(this, false)}>
                    Cancel
                </Button>
                <Button onClick={() => auth.signOut()}>
                    Sign Out
                </Button>
            </div>
        </CustomModal>

    </>
}
