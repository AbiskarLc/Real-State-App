import './App.css'
import Header from './Components/Header';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Signin from "./Pages/Signin";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import PrivateRoute from './Components/PrivateRoute';
import SignUp from './Pages/SignUp';
import About from './Pages/About';
import CreateListing from './Components/CreateListing';
function App() {

  return (
    <>
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route element={<Home/>} path="/"/>
      <Route element={<Signin/>} path="/signin"/>
      <Route element={<PrivateRoute/>}>
      <Route element={<Profile/>} path="/profile"/>
      <Route element={<CreateListing/>} path='/create-listing'/>
      </Route>
      <Route element={<Dashboard/>} path='/dashboard'/>
      <Route element={<SignUp/>} path="/signup"/>
      <Route  element={<></>} path='/lists/'/>
      <Route element={<About/>} path="/about"/>

    </Routes>
    
    </BrowserRouter>


    </>
  )
}

export default App
