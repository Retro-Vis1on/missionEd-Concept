import Welcome from './components/welcome-page/Welcome'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider,useAuth } from './contexts/AuthContext';
import {BrowserRouter as Router , Switch, Route} from 'react-router-dom'
import Home from './components/home-page/Home'
import Navigation from './components/Navigation/Navigation'
function App() {
  return (
    <Router>
      <AuthProvider>
          <Navigation/>
        <Switch>
          <Route path='/welcome' exact component={Welcome}/>
          <Route path='/'  component={Home}/>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
