import Welcome from './components/welcome-page/Welcome'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider,useAuth } from './contexts/AuthContext';
import {BrowserRouter as Router , Switch, Route} from 'react-router-dom'
import Home from './components/home-page/Home'
import Navigation from './components/Navigation/Navigation'
import Network from './components/network/Network'
import Profile from './components/profile-page/Profile'
import Messages from './components/chat-page/Messages'
import Post from './components/post-view/Post'
import User from './components/user-view/User'
import Store from './components/profile-page/Store'
import Notification from './components/notification-page/Notification'
import Footer from './components/Footer-pg/Footer'
import {FeedProvider} from './contexts/FeedContext'

function App() {
  return (
    <Router>
      <AuthProvider>
      <FeedProvider>
          <Navigation/>
        <Switch>
          <Route path='/'  component={Home} exact/>
          <Route path='/welcome' exact component={Welcome} exact/>
          <Route path='/network' component={Network} exact/>
          <Route path='/messages' component={Messages} exact/>
          <Route path='/saved-post' component={Home} exact/>
          <Route path='/my-post' component={Home}/>
          <Route path='/profile' component={Profile} exact/>
          <Route path='/post' component={Post} />
          <Route path='/user' component={User} />
          <Route path='/store' component={Store} />

          <Route path='/notifications' component={Notification} />
        </Switch>
      </FeedProvider>
      </AuthProvider>
      {/*<Footer/>*/}
    </Router>
  );
}

export default App;
