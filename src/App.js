import Welcome from './components/welcome-page/Welcome'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './components/home-page/Home'
import Layout from './components/layout/Layout';
import Network from './components/network/Network'
import Profile from './components/profile-page/Profile'
import Account from './components/profile-page/Account'
import Messages from './components/chat-page/Messages'
import Post from './components/post-view/Post'
import ScrollToTop from './hooks/useScrollToTop'
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { userProfile } from './apis/User';
import { UserActions } from './redux/UserSlice';
import { useEffect } from 'react';
import CenteredLoader from './components/UI/LoadingSpinner/CenteredLoader';
import User from './components/user-view/User'
// import Store from './components/profile-page/Store'
import Notification from './components/notification-page/Notification'
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
  const isLoggedIn = useSelector(state => state.user).isLoggedIn
  auth.onAuthStateChanged(user => {
    if (user) {
      if (!isSubbed) {
        isSubbed = true
        userUnsub = userProfile(user.uid, dispatch)
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
      </Layout>
    </Switch>
  </ScrollToTop>
  );
}

export default App;
