/* eslint-disable no-useless-escape */
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { RotatingLines } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import registration from "../../assets/registration.png";

const Registration = () => {
  const auth = getAuth();
  const db = getDatabase();
  let emailInput = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
  let passwordInput =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showValues, setShowValues] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleFullName = (e) => {
    setFullName(e.target.value);
    setFullNameError("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleShowPassword = () => {
    setShowValues(!showValues);
  };

  const handleSubmit = () => {
    if (!email) {
      setEmailError("Email is required!");
    } else if (!emailInput.test(email)) {
      setEmailError("Email is Invalid");
    }
    if (!fullName) {
      setFullNameError("Full Name is required!");
    }
    if (!password) {
      setPasswordError("Password is required!");
    } else {
      if (!passwordInput.test(password)) {
        setPasswordError("Must be valid password");
        setPwdMsg(
          "#Password should be between 8 to 15 characters which contain at least one lowercase letter[a-z], one uppercase letter[A-Z], one numeric digit[0-9], and one special character[!,@,#,$,%,^,&,*]"
        );
      } else {
        setPwdMsg("");
      }
    }
    if (
      (email && password && fullName && emailInput.test(email),
      passwordInput.test(password))
    ) {
      setLoading(false);
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          updateProfile(auth.currentUser, {
            displayName: fullName,
            photoURL: "./src/assets/defPro.png",
          })
            .then(() => {
              setLoading(true);
              sendEmailVerification(auth.currentUser);
              toast.success("Registration Done, please verify your email.");
              setEmail("");
              setFullName("");
              setPassword("");
              setTimeout(() => {
                navigate("/");
              }, 5000);
            })
            .then(() => {
              console.log(user, "user reg");
              set(ref(db, "users/" + user.user.uid), {
                username: user.user.displayName,
                email: user.user.email,
                photo: user.user.photoURL,
              });
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
          if (errorCode.includes("auth/email-already-in-use")) {
            setEmailError("This Email is already exist");
          }
        });
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="w-1/2 flex justify-end">
          <div className="mr-[69px] pt-[80px]">
            <h2 className="font-nun font-bold text-[34px] text-theme">
              Get started with easily register
            </h2>
            <p className="font-nun text-xl text-[#0000007e] mt-[13px]">
              Free register and you can enjoy it
            </p>

            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <div className="mt-[60px] relative">
              <input
                type="email"
                onChange={handleEmail}
                value={email}
                className="py-[26px] pl-[52px] w-96 border-2 border-[#11175d3b] rounded-lg outline-none font-nun text-xl text-theme font-semibold"
              />
              <p className="font-nun text-[14px] font-semibold text-[#11175d52] tracking-[1.1px] absolute top-[-10px] left-[34px] bg-white px-[18px]">
                Email Address
              </p>
              {emailError && (
                <p className="bg-red-500 text-white w-96 py-2 px-1 mt-2">
                  {emailError}
                </p>
              )}
            </div>
            <div className="mt-[60px] relative">
              <input
                type="text"
                onChange={handleFullName}
                value={fullName}
                className="py-[26px] pl-[52px] w-96 border-2 border-[#11175d3b] rounded-lg outline-none font-nun text-xl text-theme font-semibold"
              />
              <p className="font-nun text-[14px] font-semibold text-[#11175d52] tracking-[1.1px] absolute top-[-10px] left-[34px] bg-white px-[18px]">
                Full Name
              </p>
              {fullNameError && (
                <p className="bg-red-500 text-white w-96 py-2 px-1 mt-2">
                  {fullNameError}
                </p>
              )}
            </div>
            <div className="mt-[60px] relative">
              <input
                type={showValues ? "text" : "password"}
                onChange={handlePassword}
                value={password}
                className="py-[26px] pl-[52px] w-96 border-2 border-[#11175d3b] rounded-lg outline-none font-nun text-xl text-theme font-semibold"
              />
              <p className="font-nun text-[14px] font-semibold text-[#11175d52] tracking-[1.1px] absolute top-[-10px] left-[34px] bg-white px-[18px]">
                Password
              </p>
              <div
                onClick={handleShowPassword}
                className="text-[#11175d3b] cursor-pointer text-lg absolute right-[120px] top-[32px]"
              >
                {!showValues ? <AiFillEyeInvisible /> : <AiFillEye />}
              </div>
              {passwordError && (
                <p className="bg-red-500 text-white w-96 py-2 px-1 mt-2">
                  {passwordError}
                </p>
              )}
              {pwdMsg && (
                <p className="text-green-600 absolute top-0 left-[-300px] w-64">
                  {pwdMsg}
                </p>
              )}
            </div>
            <div className="w-96">
              {loading ? (
                <div className="w-full text-center">
                  <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="48"
                    visible={true}
                  />
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-primary mt-[51px] px-[158px] py-[20px] text-white w-full font-nun font-xl font-semibold rounded-full transition-all duration-500 hover:bg-[#3e0bf7]"
                >
                  Sign Up
                </button>
              )}

              <p className=" pt-[35px] font-open text-theme text-[13px] text-center">
                Already have an account ?{" "}
                <span className="font-bold text-[#EA6C00] cursor-pointer">
                  <Link to="/">Sign In</Link>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <img
            src={registration}
            alt=""
            className="h-screen w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Registration;
