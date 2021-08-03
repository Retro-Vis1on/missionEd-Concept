
import classes from './Feed.module.css'
import { useCallback, useEffect, useState } from 'react';
import { getFeed, getNetCount } from '../../apis/Feed';
import FeedItem from './FeedItem';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import { useDispatch, useSelector } from 'react-redux'
import Dropdown from '../UI/Dropdown/Dropdown';
import useWindowDimensions from '../../hooks/useWindowDimensions'
import Button from '../UI/Button/Button';
import CreatePost from './CreatePost';
import Banner from '../Banner/Banner';
let firstRun = true
let isSwitch = false
export default function Feed() {
  const { width } = useWindowDimensions()
  const dispatch = useDispatch()
  const [isLoading, loadingStateUpdater] = useState(false)
  const [openNewPost, openStateUpdater] = useState(false)
  const [tag, tagUpdater] = useState('all')
  const cache = useSelector(state => state.cache)
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

  if (firstRun)
    return null
  return (
    <>
      <CreatePost isOpen={openNewPost} onClose={openStateUpdater.bind(this, false)} />
      <div className={classes.feedControls}>
        <Dropdown text="Filter by Categ." filters={["Show All", "General", "Internship", "Project", "Placement", "Question"]} onClick={tagUpdaterHandler} />
        <button className={classes.createBtn} onClick={openStateUpdater.bind(this, true)}>
          <div className={classes.Create}>
            <div className={classes.add}>+</div>
            {width > 670 ? "Create" : ""} New Post
          </div>
        </button>
      </div>
      <Banner />
      {isLoading && isSwitch ? <div style={{ textAlign: "center", padding: "10px 0" }}><LoadingSpinner /></div> : <>
        {
          cache.posts.length ?
            <ul className={classes.posts}>
              {
                cache.posts.map((post, index) => <FeedItem postData={post} authorData={cache.authorData[post.authorIndex]} key={post.id} />)
              }
            </ul> : !firstRun && !isLoading && <p className={classes.noPosts}>There are no posts available</p>
        }
        {cache.posts.length < cache.netPosts[tag] ? <div className={classes.loadMore}>{(isLoading ? <LoadingSpinner /> : <Button onClick={() => getPageData(false, tag)}>Load More</Button>)}</div> : null}
      </>
      }
    </>
  );
}