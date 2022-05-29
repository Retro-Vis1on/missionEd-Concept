import Welcome from './components/welcome-page/Welcome'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Suspense, lazy } from 'react';
import Layout from './components/layout/Layout';
import ScrollToTop from './hooks/useScrollToTop'
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { userProfile } from './apis/User';
import { UserActions } from './redux/UserSlice';
import { useEffect } from 'react';
import CenteredLoader from './components/UI/LoadingSpinner/CenteredLoader';
// import Store from './components/profile-page/Store'
import ReactGA from 'react-ga';
import LoadingSpinner from './components/UI/LoadingSpinner/LoadingSpinner';
const Home = lazy(() => import('./components/home-page/Home'))
const User = lazy(() => import('./components/user-view/User'))
const Network = lazy(() => import('./components/network/Network'))
const Profile = lazy(() => import('./components/profile-page/Profile'))
const Account = lazy(() => import('./components/profile-page/Account'))
const Messages = lazy(() => import('./components/chat-page/Messages'))
const Post = lazy(() => import('./components/post-view/Post'))
const Notification = lazy(() => import('./components/notification-page/Notification'))
ReactGA.initialize(process.env.REACT_APP_ANALYTICS_ID);
let userUnsub = null
let isSubbed = false
function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    return () => {
      if (userUnsub !== null)
        userUnsub()
    }
  }, [])
  const cachedAuthors = useSelector(state => state.cache).authorData
  const isLoggedIn = useSelector(state => state.user).isLoggedIn
  auth.onAuthStateChanged(user => {
    if (user) {
      if (!isSubbed) {
        isSubbed = true
        userUnsub = userProfile(user.uid, dispatch, cachedAuthors)
        ReactGA.event({
          category: 'User',
          action: 'Login',
          value: {
            uid: user.uid,
          }
        })
      }
    }
    else {
      if ((isLoggedIn === -1) || isSubbed)
        dispatch(UserActions.userLogout({}))
      if (isSubbed) {
        userUnsub()
        userUnsub = null
        isSubbed = false
      }
    }
  })
  if (isLoggedIn === -1)
    return <CenteredLoader />
  return (<ScrollToTop>
    <Switch>
      <Layout>
        <Suspense fallback={<div style={{ textAlign: "center" }}><LoadingSpinner /></div>}>
          <Route path='/welcome' component={Welcome} exact />
          {isLoggedIn === false ? <Redirect to="/welcome" /> : null}
          <Route path='/' component={Home} exact />
          <Route path='/network' component={Network} exact />
          <Route path='/user/:uid' render={(props) => <User {...props} />} />
          <Route path='/profile' component={Profile} exact />
          <Route path='/profile/settings' component={Account} exact />
          <Route path='/messages' render={(props) => <Messages {...props} />} exact />
          <Route path='/post/:id' component={Post} />
          <Route path='/notifications' component={Notification} />
        </Suspense>
      </Layout>
    </Switch>
  </ScrollToTop>
  );
}

export default App;
