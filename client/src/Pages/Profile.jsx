import React, { useContext, useState, useRef, useEffect } from "react";
import { Alert, Button, FileInput, TextInput, Modal } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../Redux/Theme/userSlice";
import { CiWarning } from "react-icons/ci";
import { stateContext } from "../Context/stateContexts";
import { CircularProgressbar } from "react-circular-progressbar";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";
import Message from "../Components/Message";
import { Link } from "react-router-dom";
const Profile = () => {
  const fileRef = useRef(null);

  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [togglemodal, setToggleModal] = useState(false);
  const [file, setFile] = useState(undefined);
  const [fileerror, setFileError] = useState(null);
  const { signOutUser } = useContext(stateContext);
  const [action, setAction] = useState("");
  const [message, setMessage] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [formdata, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    profilePicture: currentUser.profilePicture,
    password:''
  });
  useEffect(() => {
    if (file) {
      uploadFileTask();
    }
  }, [file]);

  if (fileerror || message) {
    setTimeout(() => {
      setFileError(null);
      setMessage(null);
      setImageUploadProgress(null);
    }, 3000);
  }

  const deleteUser = async () => {
    try {
      dispatch(signOutStart());
      const response = await axios.delete(
        `http://localhost:8000/api/user/deleteUser/${currentUser._id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data) {
        console.log(response);
        dispatch(signOutSuccess());
      }
    } catch (error) {
      dispatch(signOutFailure(error.response.data.message));
    }
  };
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
        setMessage("Profile Updated Successfully");
           setFormData(
            {
              ...formdata,
              password:''
            }
           )
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

  return (
    <>
      <div className="max-w-xl mx-auto w-full">
        <h1 className="text-3xl text-center  mt-8 font-semibold">
          User Profile
        </h1>

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
            value={formdata.password}
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
          <Button color="success" outline as={"div"}>
            <Link to={"/create-listing"}>
            Create Listing
            </Link>
            </Button>
          {
          fileerror && <Message message={fileerror} type={"failure"}/>}
          {
            message && <Message message={message} type={"success"}/>
          }
          
        </form>
        
        <div className="mx-2 mt-2 flex justify-between">
          <p
            className=" text-red-600  cursor-pointer"
            onClick={() => {
              setAction("signout");
              setToggleModal(true);
            }}
          >
            Sign Out
          </p>
          <p
            className=" text-red-600 cursor-pointer"
            onClick={() => {
              setToggleModal(true);
              setAction("delete your account");
            }}
          >
            Delete Account
          </p>
        </div>

        {/* Modal */}

        <Modal
          size={"md"}
          dismissible
          show={togglemodal}
          onClose={() => setToggleModal(false)}
          popup
        >
          <Modal.Header className=" text-center">
            Are you sure you want to {action}?
          </Modal.Header>
          <Modal.Body>
            <div className=" flex justify-center mt-1">
              <CiWarning className=" w-24 h-20 text-red-500 cursor-pointer" />
            </div>
          </Modal.Body>
          <Modal.Footer className="flex justify-between pt-0">
            <Button
              color="failure"
              onClick={() => {
                action === "signout" ? signOutUser() : deleteUser();
              }}
            >
              Yes
            </Button>
            <Button
              className=" bg-slate-500"
              onClick={() => setToggleModal(false)}
            >
              No
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Profile;
