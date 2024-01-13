/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import "cropperjs/dist/cropper.css";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { ref as dref, getDatabase, update } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

import { createRef, useState } from "react";
import { Cropper } from "react-cropper";
import { AiFillMessage, AiOutlineSetting } from "react-icons/ai";
import { FaCloudUploadAlt, FaRegBell } from "react-icons/fa";
import { VscHome, VscSignOut } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
const Sidebar = ({ active }) => {
  const data = useSelector((state) => state.user.userInfo);

  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("#");

  const cropperRef = createRef();
  const db = getDatabase();

  let [profileUpload, setProfileUpload] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  let handleProfileUpload = () => {
    console.log("Ok");
    setProfileUpload(true);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign Out Successful");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        console.log(error.code);
      });
  };

  const onPhotoChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      const storage = getStorage();
      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", downloadURL);
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            update(dref(db, "users/" + data.uid), {
              photo: downloadURL,
            });

            setProfileUpload(false), setImage(""), setCropData("");
          });
        });
      });
    }
  };
  return (
    <div className="bg-primary h-full w-full rounded-md">
      {profileUpload ? (
        <div className="w-full h-screen bg-primary absolute top-0 left-0 flex justify-center items-center">
          <div className="w-[500px] bg-white rounded-3xl p-10">
            <p className="font-nun text-2xl font-bold mb-5">
              Upload your profile photo
            </p>

            {/* <div className="img-preview h-[90px] w-[100px] rounded-full overflow-hidden mx-auto" /> */}

            {image ? (
              <div className="w-[100px] h-[100px] rounded-full mx-auto overflow-hidden">
                <div className="img-preview w-full h-full rounded-full" />
              </div>
            ) : (
              <div className="w-[100px] h-[100px] rounded-full mx-auto">
                <img src={data.photoURL} alt="" className="rounded-full" />
              </div>
            )}
            <input type="file" onChange={onPhotoChange} className="mb-5" />
            {image && (
              <Cropper
                ref={cropperRef}
                style={{ height: 400, width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                guides={true}
              />
            )}

            <div>
              <button
                onClick={getCropData}
                className="px-5 py-3 bg-primary text-white mt-5"
              >
                Upload
              </button>
              <button
                onClick={() => {
                  setProfileUpload(false);
                  setImage("");
                }}
                className="px-5 py-3 bg-red-500 text-white mt-5 ml-5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="w-full flex justify-center">
            <div className="relative mt-10 w-[100px] h-[100px] rounded-full group">
              <img src={data.photoURL} alt="" className="rounded-full" />
              <div
                onClick={handleProfileUpload}
                className="cursor-pointer w-0 group-hover:w-[100px] h-[100px] rounded-full absolute top-0 left-0 bg-overlay flex justify-center items-center"
              >
                <FaCloudUploadAlt className="text-white text-xl" />
              </div>
            </div>
          </div>
          <div className="mt-[15px] text-center">
            <h3 className="text-white font-nun text-base font-semibold uppercase">
              {data.displayName}
            </h3>
          </div>

          <div
            className={`mt-[40px] relative py-5 z-[1] after:absolute ${
              active == "home" ? "after:bg-white" : "after:bg-transparent"
            } after:content-[''] after:h-full after:w-full after:top-0 after:left-[25px] after:rounded-l-[20px] after:z-[-1] before:absolute before:content-[''] before:top-0 before:right-0 before:bg-primary before:z-[1] before:h-full before:w-[8px] before:rounded-l-[20px] before:shadow-tab`}
          >
            <Link to="/home">
              {" "}
              <VscHome
                className={`text-[46px] ${
                  active == "home" ? "text-primary" : "text-[#BAD1FF]"
                } mx-auto`}
              />
            </Link>
          </div>

          <div
            className={`mt-[57px] relative py-5 z-[1] after:absolute ${
              active == "message" ? "after:bg-white" : "after:bg-transparent"
            } after:content-[''] after:h-full after:w-full after:top-0 after:left-[25px] after:rounded-l-[20px] after:z-[-1] before:absolute before:content-[''] before:top-0 before:right-0 before:bg-primary before:z-[1] before:h-full before:w-[8px] before:rounded-l-[20px] before:shadow-tab`}
          >
            <Link to="/message">
              <AiFillMessage
                className={`text-[46px] ${
                  active == "message" ? "text-primary" : "text-[#BAD1FF]"
                } mx-auto`}
              />
            </Link>
          </div>

          <div className="mt-[57px]">
            <FaRegBell className="text-[46px] text-[#BAD1FF] mx-auto cursor-pointer " />
          </div>
          <div className="mt-[57px]">
            <AiOutlineSetting className="text-[46px] text-[#BAD1FF] mx-auto cursor-pointer" />
          </div>
          <div className="mt-[100px]">
            <VscSignOut
              onClick={handleSignOut}
              className="text-[46px] text-[#BAD1FF] mx-auto cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
