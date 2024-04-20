import './App.css'
import Header from './Components/Header';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Signin from "./Pages/Signin";
import SignOut from "./Pages/SignOut";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import PrivateRoute from './Components/PrivateRoute';
import SignUp from './Pages/SignUp';
import About from './Pages/About';
function App() {

  return (
    <>
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route element={<Home/>} path="/"/>
      <Route element={<Signin/>} path="/signin"/>
      <Route element={<SignOut/>} path="/signout"/>
      <Route element={<PrivateRoute/>}>
      <Route element={<Profile/>} path="/profile"/>
      </Route>
      <Route element={<Dashboard/>} path='/dashboard'/>
      <Route element={<SignUp/>} path="/signup"/>
      <Route element={<About/>} path="/about"/>

    </Routes>
    
    </BrowserRouter>


    </>
  )
}

export default App
