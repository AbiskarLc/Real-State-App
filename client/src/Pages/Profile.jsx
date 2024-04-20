import React, { useContext, useState, useRef, useEffect } from "react";
import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../Redux/Theme/userSlice";
import { stateContext } from "../Context/stateContexts";
import { HiEye } from "react-icons/hi";
import { CircularProgressbar } from "react-circular-progressbar";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";
import Error from "../Components/Error";
const Profile = () => {
  const fileRef = useRef(null);

  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileerror, setFileError] = useState(null);
  const { signOutUser } = useContext(stateContext);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [formdata, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    profilePicture: currentUser.profilePicture,
  });
  useEffect(() => {
    if (file) {
      uploadFileTask();
    }
  }, [file]);

  if (fileerror) {
    setTimeout(() => {
      setFileError(null);
      setImageUploadProgress(null);
    }, 3000);
  }
  const uploadFileTask = () => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
        console.log(`file upload is ${Math.round(progress)}% completed`);
      },
      (error) => {
        console.log(error);
        setFileError(`File size is greater than 2mb`);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({
            ...formdata,
            profilePicture: downloadUrl,
          });
          setImageUploadProgress(null);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const response = await axios.put(
        `http://localhost:8000/api/user/updateUser/${currentUser._id}`,
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data) {
        console.log(response.data);
        dispatch(signInSuccess(response.data));
      }
    } catch (error) {
      dispatch(signInFailure());
    }
  };

  const toggleShowPassword = () => {
    setShow(!show ? true : false);
  };
  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };
  console.log(formdata);
  return (
    <div className="max-w-xl mx-auto w-full">
      <h1 className="text-3xl text-center  mt-8 font-semibold">User Profile</h1>

      <form className="mx-2 flex flex-col gap-2 mt-4">
        <div
          className=" relative w-32 h-32 cursor-pointer mx-auto  shadow-md overflow-hidden rounded-full"
          onClick={() => fileRef.current.click()}
        >
          <FileInput
            ref={fileRef}
            onChange={(e) => setFile(e.target.files[0])}
            className=" hidden"
          />
          {imageUploadProgress && (
            <CircularProgressbar
              value={imageUploadProgress}
              text={`${imageUploadProgress}%`}
              strokeWidth={4}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  textAlign: "center",
                },
                path: {
                  stroke: `rgba(28,89,128,${imageUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={formdata.profilePicture}
            alt="Profile"
            className={`rounded-full w-full h-full object-cover text-center border-gray-100 border-4 ${
              imageUploadProgress && imageUploadProgress < 100
                ? " opacity-60"
                : "opacity-100"
            }`}
          />
        </div>

        <TextInput
          type="text"
          name="username"
          placeholder="UserName"
          onChange={handleChange}
          value={formdata.username}
        />
        <TextInput
          type="email"
          name="email"
          placeholder="UserEmail"
          onChange={handleChange}
          value={formdata.email}
          disabled={true}
        />
        <TextInput
          type={show ? "text" : "password"}
          name="password"
          placeholder="Enter password"
          onChange={handleChange}
        />
        <div>
          <p
            className="text-blue-600 underline cursor-pointer text-xs hover:text-gray-800 dark:hover:text-gray-200"
            onClick={toggleShowPassword}
          >
            {show ? "hide password" : "show password"}
          </p>
        </div>

        <Button
          gradientDuoTone={"purpleToBlue"}
          onClick={handleSubmit}
          type="submit"
          outline
        >
          Update Profile
        </Button>
        {fileerror && <Error error={fileerror} />}
      </form>
      <div className="mx-2 mt-2 flex justify-between">
        <p className=" text-red-600  cursor-pointer" onClick={signOutUser}>
          Sign Out
        </p>
        <p className=" text-red-600 cursor-pointer">Delete Account</p>
      </div>
    </div>
  );
};

export default Profile;
