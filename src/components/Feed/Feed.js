
import classes from './Feed.module.css'
import { useAuth } from './../../contexts/AuthContext'
import Feedback from './../Navigation/FeedBack'
import { useCallback, useEffect, useRef, useState } from 'react';
import { getFeed, getNetCount } from '../../apis/Feed';
import { useHistory } from 'react-router-dom';
import CenteredSpinner from '../UI/LoadingSpinner/CenteredLoader'
import FeedItem from './FeedItem';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import { useDispatch, useSelector } from 'react-redux'
import Dropdown from '../UI/Dropdown/Dropdown';
import useWindowDimensions from '../../hooks/useWindowDimensions'
let firstRun = true
let isSent = false
let isSwitch = false
export default function Feed() {
  const history = useHistory()
  const { width } = useWindowDimensions()
  const { currentUser } = useAuth();
  const dispatch = useDispatch()
  const [isLoading, loadingStateUpdater] = useState(false)
  const [tag, tagUpdater] = useState('all')
  const cache = useSelector(state => state.cache)
  const loader = useRef(null)
  const netCount = useCallback(async () => {
    try {
      await getNetCount(dispatch)
    }
    catch (err) {
      console.log(err)
    }
  }, [dispatch])
  const getPageData = useCallback(async (changeFilter = false, tag = 'all') => {
    isSwitch = changeFilter;
    loadingStateUpdater(true)
    try {
      if (!cache.netPosts)
        await netCount();
      await getFeed(tag, changeFilter, dispatch, cache)

    }
    catch (err) { console.log(err) }
    finally {
      isSwitch = false
      loadingStateUpdater(false)
    }
  }, [netCount, dispatch, cache])
  useEffect(() => {
    if (firstRun) {
      getPageData()
      firstRun = false
    }
  }, [getPageData])
  const tagUpdaterHandler = async (newTag) => {
    if (newTag === 'Show All')
      newTag = 'all'
    tagUpdater(newTag)
    await getPageData(true, newTag)
  }
  const handleObserver = useCallback(async (entities) => {
    const target = entities[0];
    if (target.isIntersecting && (cache.posts.length < cache.netPosts[tag]) && !isSent) {
      isSent = true
      await getPageData(false, tag)
      isSent = false
    }
  }, [getPageData, cache.posts.length, cache.netPosts, tag])
  let observerSpan = null
  if (!isLoading && cache.posts.length < cache.netPosts[tag] && !firstRun)
    observerSpan = <span
      id="observer"
      ref={loader}
    />
  else {
    observerSpan = null
    loader.current = null
  }
  useEffect(() => {
    let options = {
      root: null,
      rootMargin: "20px",
      threshold: 1
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current)
    }
  }, [handleObserver, observerSpan, isLoading]);
  if (!currentUser)
    history.replace('/welcome')
  if (firstRun)
    return <CenteredSpinner />
  return (
    <>
      <div className={classes.feedControls}>
        <Dropdown text="Filter by Categ." filters={["Show All", "General", "Internship", "Experience", "Placement", "Question"]} onClick={tagUpdaterHandler} />
        <button className={classes.createBtn} >
          <div className={classes.Create}>
            <div className={classes.add}>+</div>
            {width > 670 ? "Create" : ""} New Post
          </div>
        </button>
      </div>
      {isLoading && isSwitch ? <div style={{ textAlign: "center", padding: "10px 0" }}><LoadingSpinner /></div> : <>
        {
          cache.posts.length ?
            <ul className={classes.posts}>
              {
                cache.posts.map((post, index) => <FeedItem postData={post} authorData={cache.authorData[post.authorIndex]} key={post.id} />)
              }
            </ul> : !firstRun && !isLoading && <p className={classes.noPosts}>There are no posts available</p>
        }
        {isLoading ? <div style={{ textAlign: "center", padding: "10px 0" }}><LoadingSpinner /></div> : observerSpan}
      </>
      }
      {/* <Feedback /> */}
    </>
  );
}