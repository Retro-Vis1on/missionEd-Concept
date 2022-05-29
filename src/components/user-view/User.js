import { useCallback, useEffect, useReducer, useState } from "react"
import { useSelector } from "react-redux"
import { followingUpdater, getFollowers, getUserData, getUserPosts } from "../../apis/User"
import { auth } from "../../firebase"
import ObjCpy from "../../helpers/ObjCpy"
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner"
import { Redirect, useHistory, useParams } from 'react-router-dom'
import UserView from "../UI/User/UserView"
const initialState = {
    bio: null,
    coins: 0,
    education: null,
    email: null,
    following: [],
    follower: [],
    location: null,
    name: null,
    profile_image: null,
    username: null,
    isFollowing: false
}
const reducer = (state, action) => {
    const updatedState = ObjCpy(state)
    if (action.type === "mount") {
        for (let field in action.data)
            updatedState[field] = action.data[field]
    }
    else if (action.type === "followerUpdate") {
        updatedState.follower = action.followers
        updatedState.isFollowing = action.isfollowing
    }
    return updatedState
}
const User = (props) => {
    const uid = useParams().uid
    const history = useHistory()
    const [profile, profileDispatcher] = useReducer(reducer, ObjCpy(initialState))
    const [isLoading, loadingStateUpdater] = useState(false)
    const [error, errorUpdater] = useState(null)
    const user = useSelector(state => state.user)
    const followingHandler = async () => {
        const curUser = auth.currentUser.uid
        let followers = ObjCpy(profile.follower)
        let isfollowing = ObjCpy(profile.isFollowing)
        if (isfollowing) {
            followers.splice(followers.findIndex(user => user.id === curUser), 1)
            isfollowing = false
        }
        else {
            followers.push({ data: user, id: curUser })
            isfollowing = true
        }
        try {
            const newFollowing = ObjCpy(user.following)
            if (isfollowing)
                newFollowing.push(uid)
            else newFollowing.splice(newFollowing.findIndex(user => user === uid), 1)
            await followingUpdater(newFollowing)
            profileDispatcher({ type: "followerUpdate", followers, isfollowing })
        }
        catch (err) {
            console.log(err)
        }
    }
    const messageHandler = () => {
        history.push({
            pathname: "/messages",
            state: {
                partner: {
                    userData: { ...profile },
                    id: uid
                }
            }
        })

    }
    const cacheAuthors = useSelector(state => state.cache).authorData
    const getProfile = useCallback(async () => {
        loadingStateUpdater(true)
        try {
            let userProfile = null
            if (props.location.state && props.location.state.user)
                userProfile = ObjCpy(props.location.state.user)
            else
                userProfile = await getUserData(uid)
            if (!userProfile)
                throw new Error('User not found!')
            if (userProfile.following) {
                let followings = ObjCpy(userProfile.following)
                let followingList = []
                for (let following of followings) {
                    let user = cacheAuthors.find(author => author.id === following)
                    if (!user) {
                        user = await getUserData(following)
                        if (!user)
                            continue;
                    }
                    else user = user.author
                    followingList.push({ data: user, id: following })
                }
                userProfile.following = followingList
            }
            userProfile.follower = []
            userProfile.isFollowing = false
            const followers = await getFollowers(uid)
            for (let follower of followers) {
                if (follower.id === auth.currentUser.uid)
                    userProfile.isFollowing = true
                userProfile.follower.push({ data: follower.data(), id: follower.id })
            }
            userProfile.posts = []
            const posts = await getUserPosts(uid)
            for (let post of posts) {
                userProfile.posts.push({ data: post.data(), id: post.id })
            }

            profileDispatcher({ type: "mount", data: userProfile })
        }
        catch (err) {
            errorUpdater(err.message)
        }
        finally {
            loadingStateUpdater(false)
        }
    }, [uid, props.location.state, cacheAuthors])
    useEffect(() => {
        if (uid !== auth.currentUser.uid)
            getProfile()
    }, [getProfile, uid])
    if (uid === auth.currentUser.uid)
        return <Redirect to="/profile" />
    if (error)
        return <p style={{ color: "darkgray", textAlign: "center", fontWeight: "600", fontSize: "1.7rem" }}>{error}</p>
    if (!profile.username || isLoading)
        return <div style={{ textAlign: "center" }}><LoadingSpinner /></div>
    return <UserView
        {...profile}
        btn1={
            {
                text: profile.isFollowing ? <><i className="fas fa-user-check"></i> Following</> : <><i className="fas fa-user-plus"></i> Follow</>,
                onClick: followingHandler
            }
        }
        btn2={{
            text: <><i className="fas fa-comment-alt"></i> Message</>,
            onClick: messageHandler
        }}
    />
}
export default User