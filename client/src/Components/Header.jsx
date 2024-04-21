import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaMoon, FaSearch, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Redux/Theme/ThemeSlice";
import { stateContext } from "../Context/stateContexts";
const Header = () => {

  const user = useSelector(state=>state.user);
const context = useContext(stateContext);
const {signOutUser} = context;
  const {currentUser} = user;
  const {theme} = useSelector(state=>state.theme)
  const location = useLocation();
  const [acive, setActive] = useState();
const dispatch = useDispatch();

  useEffect(()=>{
setActive(location.pathname);
  },[location.pathname])

  return (
    <div className=" mx-auto  dark:text-gray-600 shadow-sm">
      <Navbar>
        <Navbar.Brand>
          <h1 className=" text-gray-500 text-lg font-bold">
            Abiskar
            <span className="text-gray-800 dark:text-gray-300">Estate</span>
          </h1>
        </Navbar.Brand>
       <form className="flex items-center" >
        <TextInput type="text" placeholder="Search..." className="text-xl w-24 sm:w-auto md:block" rightIcon={FaSearch} />
    
       </form>

        <div className=" flex md:order-2 hover:shadow-md hover:shadow-white bg-gray-400 dark:bg-slate-700 dark:text-gray-200 p-3 rounded-full cursor-pointer"  onClick={()=> dispatch(toggleTheme())}>
          {
            theme === "light"?
            <FaSun/>: <FaMoon/>

          }
        </div>
        <div className=" sm:flex md:order-3 hidden ">
          {

            currentUser?
            <Dropdown arrowIcon={false} inline label={<Avatar img={currentUser.profilePicture} rounded/>}>
            <Dropdown.Header>
            <span className="block text-sm">{currentUser.username}</span>
            <span className="block truncate text-sm font-medium">{currentUser.email}</span>
            </Dropdown.Header>
            <Dropdown.Item >
              <Link to={"/profile"}>  Profile</Link>
            
              </Dropdown.Item>
            <Dropdown.Item onClick={signOutUser}>
              SignOut
            </Dropdown.Item>

          </Dropdown>:
          <>
          <Button gradientDuoTone={"purpleToPink"} outline>
            <Link to={"/signup"}>Sign up</Link>
            </Button>
          </>
          }
        
        </div>
        <Navbar.Toggle />

        <Navbar.Collapse className="text-gray-600 cursor-pointer">
          <Navbar.Link as={"div"}  className=" cursor-pointer md:text-md" active={acive==="/"}>
            <Link to={"/"}>Home</Link>

          </Navbar.Link>
          <Navbar.Link as={"div"} className=" cursor-pointer md:text-md"  active={acive==="/dashboard"}>
           <Link to={"/profile"}>Dashboard</Link>
          </Navbar.Link>
          <Navbar.Link as={"div"} className=" cursor-pointer md:text-md">
          <Link to={"/about"}>About</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
