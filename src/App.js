import Welcome from './components/welcome-page/Welcome'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './contexts/AuthContext';
import {BrowserRouter as Router , Switch, Route} from 'react-router-dom'
import Home from './components/home-page/Home'
function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path='/welcome' exact component={Welcome}/>
          <Route path='/'  component={Home}/>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
