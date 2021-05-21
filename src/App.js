import Welcome from './components/welcome-page/Welcome'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './contexts/AuthContext';
function App() {
  return (
    <AuthProvider>
    <div >
      <Welcome/>
    </div>
    </AuthProvider>
  );
}

export default App;
