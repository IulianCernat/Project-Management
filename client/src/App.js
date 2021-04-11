import 'fontsource-roboto';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './components/authentication/Login';
import SignUp from './components/authentication/SignUp';
import ForgotPassword from './components/authentication/ForgotPassword';
import { AuthProvider } from './contexts/AuthContext';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signUp">
            <SignUp />
          </Route>
          <Route path="/forgotPassword">
            <ForgotPassword />
          </Route>
        </Switch>
      </AuthProvider>
    </BrowserRouter>


  );
}

export default App;
