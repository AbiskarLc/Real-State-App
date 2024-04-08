import React, { useContext, useState } from 'react'
import {Button, TextInput} from 'flowbite-react';
import {useSelector} from 'react-redux';
import { stateContext } from '../Context/stateContexts';
import { HiEye } from 'react-icons/hi';
const Profile = () => {


  const {currentUser} = useSelector(state=>state.user);
const {signOutUser} = useContext(stateContext);
const [formdata,setFormData] = useState({
  username: currentUser.username,
  email: currentUser.email,
  profilePicture: currentUser.profilePicture
})

const toggleShowPassword = (e) =>{

  console.log(e);
}
const handleChange = (e) =>{

  setFormData({
    ...formdata,
    [e.target.name]:e.target.value
  })
}
console.log(formdata);
  return (
    <div className='max-w-xl mx-auto w-full'>
      <h1 className='text-3xl text-center mt-4 font-semibold'>User Profile</h1>
      <div className=' w-28 h-28 rounded-full cursor-pointer my-3 flex mx-auto border-8 dark:border-gray-400'>
         <img src={formdata.profilePicture} className='rounded-full w-21 h-21' alt="" srcset="" />
      </div>
      <form className='mx-2 flex flex-col gap-2' >
        <TextInput type='text' name='username' placeholder='UserName' onChange={handleChange} value={formdata.username} />
        <TextInput type='email' name='email' placeholder='UserEmail' value={formdata.email} />
        <TextInput type='password' name='password' placeholder='Enter password' onChange={handleChange}  rightIcon={()=> <HiEye onClick={(e)=> console.log(e.target)}/>} />

          <Button gradientDuoTone={"purpleToBlue"} type='submit' outline>Update Profile</Button>
      </form>
      <div className='mx-2 mt-2 flex justify-between'>
        <p className=' text-red-600  cursor-pointer' onClick={signOutUser}>Sign Out</p>
        <p className=' text-red-600 cursor-pointer'>Delete Account</p>
      </div>
    </div>
  )
}

export default Profile
