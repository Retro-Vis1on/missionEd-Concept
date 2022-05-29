import { useCallback, useEffect, useReducer, useState } from 'react'
import { useSelector } from 'react-redux'
import { getFollowers, getUserData, updateProfile } from '../../apis/User'
import { auth } from '../../firebase'
import ObjCpy from '../../helpers/ObjCpy'
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner'
import classes from './Network.module.css'
import Profile from './Profile'
import ReactGa from 'react-ga'
const initialState = {
  following: [],
  follower: [],
  recommended: []
}

const reducer = (state, action) => {
  const updatedState = ObjCpy(state)
  if (action.type === "update") {
    updatedState[action.field] = action.value
  }
  return updatedState
}
let isFirstRun = true
const Network = () => {
  useEffect(() => {
    ReactGa.pageview(window.location.pathname)
    return () => isFirstRun = true
  }, [])
  const followingIds = useSelector(state => state.user).following
  const username = useSelector(state => state.user).username
  const [network, dispatcher] = useReducer(reducer, ObjCpy(initialState))
  const [isLoadingState, loadingStateUpdater] = useState(true)
  const [networkState, networkStateUpdater] = useState(0)
  const getNetwork = useCallback(async () => {
    try {
      let followingData = []
      let filter = [username]
      let updatedFollowing = []
      for (let id of followingIds) {
        const data = await getUserData(id)
        if (!data) continue;
        updatedFollowing.push(id);
        filter.push(data.username)
        followingData.push({ data, id })
      }
      dispatcher({ type: "update", field: "following", value: followingData })
      const followers = await getFollowers(auth.currentUser.uid)
      const recommends = []
      const followersData = []
      for (let follower of followers) {
        followersData.push({ data: follower.data(), id: follower.id })
        if (!followingIds.includes(follower.id))
          recommends.push({ data: follower.data(), id: follower.id })
        filter.push(follower.data().username)
      }
      dispatcher({ type: "update", field: "follower", value: followersData })
      // const extraRecommendations = 10 - recommends.length
      // const newRecommends = await getRecommentdations(filter, extraRecommendations)
      // for (let newRecommend of newRecommends) {
      //   recommends.push({ data: newRecommend.data(), id: newRecommend.id })
      // }
      if (updatedFollowing.length < followingIds.length)
        updateProfile({ following: updatedFollowing })
      dispatcher({ type: "update", field: "recommended", value: recommends })
    }
    catch (err) {
      console.log(err)
    }
    finally {
      loadingStateUpdater(false)
    }
  }, [followingIds, username])
  useEffect(() => {
    if (isFirstRun)
      getNetwork()
    isFirstRun = false
  }, [getNetwork])
  let mode = null
  if (networkState === 0) {
    if (network.follower.length)
      mode = network.follower.map(follower => <Profile data={follower.data} id={follower.id} key={follower.id} />)
    else mode = <p className={classes.empty}>You don't have any followers</p>
  }
  else if (networkState === 1) {
    if (network.following.length)
      mode = network.following.map(following => <Profile data={following.data} id={following.id} key={following.id} />)
    else mode = <p className={classes.empty}>You're not following anyone</p>
  }
  else if (networkState === 2) {
    if (network.recommended.length)
      mode = network.recommended.map(recommended => <Profile data={recommended.data} id={recommended.id} key={recommended.id} />)
    else mode = <p className={classes.empty}>We don't have any recommendations at the moment</p>
  }
  return <><div className={classes.networkControls}>
    <button onClick={networkStateUpdater.bind(this, 0)} className={`${classes.btn} ${networkState === 0 ? classes.activeBtn : ''}`}>Followers</button>
    <button onClick={networkStateUpdater.bind(this, 1)} className={`${classes.btn} ${networkState === 1 ? classes.activeBtn : ''}`}>Following</button>
    <button onClick={networkStateUpdater.bind(this, 2)} className={`${classes.btn} ${networkState === 2 ? classes.activeBtn : ''}`}>Discover</button>
  </div>
    {isLoadingState ? <div style={{ textAlign: "center" }}><LoadingSpinner /></div> : <ul className={classes.network}>
      {mode}
    </ul>}
  </>

}
export default Network