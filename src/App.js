// import Welcome from './components/welcome-page/Welcome'
// import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './components/home-page/Home'
import Layout from './components/layout/Layout';
// import Navigation from './components/Navigation/Navigation'
// import Network from './components/network/Network'
// import Profile from './components/profile-page/Profile'
// import Messages from './components/chat-page/Messages'
import Post from './components/post-view/Post'
import { auth } from './firebase';
import { useDispatch } from 'react-redux';
import { getUserData } from './apis/User';
import { UserActions } from './redux/UserSlice';
// import User from './components/user-view/User'
// import Store from './components/profile-page/Store'
// import Notification from './components/notification-page/Notification'
function App() {
  const disptach = useDispatch()
  auth.onAuthStateChanged(user => {
    if (user) {
      getUserData(user.uid).then(data => disptach(UserActions.userLogin({ ...data })))
    }
  })
  return (
    <Router>
      <AuthProvider>
        {/* <Navigation /> */}
        <Switch>
          {/* <Route path='/welcome' component={Welcome} exact /> */}
          <Layout>
            <Route path='/' component={Home} exact />
            {/* <Route path='/network' component={Network} exact />
            <Route path='/messages' component={Messages} exact />
            <Route path='/saved-post' component={Home} exact />
            <Route path='/my-post' component={Home} />
            <Route path='/profile' component={Profile} exact />
            <Route path='/user' component={User} />
          <Route path='/store' component={Store} /> */}
            <Route path='/post/:id' component={Post} />

            {/* <Route path='/notifications' component={Notification} /> */}
          </Layout>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
