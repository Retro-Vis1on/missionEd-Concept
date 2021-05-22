import Welcome from './components/welcome-page/Welcome'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider,useAuth } from './contexts/AuthContext';
import {BrowserRouter as Router , Switch, Route} from 'react-router-dom'
import Home from './components/home-page/Home'
import Navigation from './components/Navigation/Navigation'
import Network from './components/network/Following'
import Profile from './components/profile-page/Profile'
import Messages from './components/chat-page/Messages'
function App() {
  return (
    <Router>
      <AuthProvider>
          <Navigation/>
        <Switch>
          <Route path='/'  component={Home} exact/>
          <Route path='/welcome' exact component={Welcome}/>
          <Route path='/network' component={Network}/>
          <Route path='/messages' component={Messages}/>
          <Route path='/saved-post' component={Home}/>
          <Route path='/my-post' component={Home} />
          <Route path='/profile' component={Profile}/>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
