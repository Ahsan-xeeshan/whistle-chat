import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { userLoginInfo } from "../../Slices/userSlice";
import Login from "../../assets/Login.png";
import facebook from "../../assets/facebook.png";
import google from "../../assets/google.png";

const LogIn = () => {
  const auth = getAuth();
  // eslint-disable-next-line no-useless-escape
  let emailInput = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
  let passwordInput =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showValues, setShowValues] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
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

    if (email && password && emailInput.test(email)) {
      signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          toast.success("Log In successful");
          console.log(user.user);
          dispatch(userLoginInfo(user.user));
          localStorage.setItem("userInfo", JSON.stringify(user.user));
          setTimeout(() => {
            navigate("/home");
          }, 4000);
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
          if (errorCode.includes("auth/invalid-login-credentials")) {
            toast.error("Please input correct email or password");
          }
        });
    }
  };

  const handleGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(() => {
        console.log("ok");
        toast.success("Registration Successful");
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
      });
  };

  const handleFacebook = () => {
    console.log("OK");
    signInWithPopup(auth, facebookProvider)
      .then(() => {
        toast.success("Registration Successful");
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.error(errorCode);
      });
  };

  return (
    <div>
      <div className="flex">
        <div className="w-1/2 flex justify-end">
          <div className="mr-[69px] pt-[60px]">
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
            <h2 className="font-open font-bold text-[34px] text-theme">
              Login to your account!
            </h2>
            <button
              onClick={handleGoogle}
              className="block font-open text-[13.33px] text-theme font-semibold px-[29px] w-[220px] py-[16px] border border-solid rounded-[9px] border-[#11175d3b] mt-[29px]"
            >
              {" "}
              <img
                src={google}
                alt=""
                className="inline-block w-[19px] mr-[9.77px]"
              />
              Login with Google
            </button>
            <button
              onClick={handleFacebook}
              className="block font-open text-[13.33px] text-theme font-semibold pl-[18px] w-[220px] py-[16px] border border-solid rounded-[9px] border-[#11175d3b] mt-[15px]"
            >
              {" "}
              <img
                src={facebook}
                alt=""
                className="inline-block w-[21px] mr-[9.77px]"
              />
              Login with Facebook
            </button>
            <div className="mt-[60px]">
              <p className="font-open pl-1 text-[14px] font-semibold text-[#11175d52]">
                Email Address
              </p>
              <input
                type="email"
                placeholder="Youraddress@email.com"
                onChange={handleEmail}
                value={email}
                className="py-[17px] pl-1 w-96 border-b border-[#11175d3b] outline-none  text-xl font-open text-theme font-semibold"
              />

              {emailError && (
                <p className="bg-red-500 text-white w-96 py-2 px-1 mt-2">
                  {emailError}
                </p>
              )}
            </div>

            <div className="mt-[60px] relative">
              <p className="font-open pl-1 text-[14px] font-semibold text-[#11175d52]">
                Password
              </p>
              <input
                type={showValues ? "text" : "password"}
                onChange={handlePassword}
                value={password}
                placeholder="Enter your password"
                className="py-[17px] pl-1 w-96 border-b border-[#11175d3b] outline-none text-xl text-theme font-open font-semibold"
              />
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
              <div
                onClick={handleShowPassword}
                className="text-[#11175d3b] cursor-pointer text-lg absolute right-[5px] top-[45px]"
              >
                {!showValues ? <AiFillEyeInvisible /> : <AiFillEye />}
              </div>
            </div>
            <div className="w-96">
              <button
                onClick={handleSubmit}
                className="bg-primary mt-[51px] px-[122px] py-[26px] text-white w-full font-nun font-xl rounded-[9px] font-semibold  transition-all duration-500 hover:bg-[#3e0bf7]"
              >
                Login to Continue
              </button>

              <p className=" pt-[35px] font-open text-theme text-center text-[13px] pl-[9px]">
                Don’t have an account ?{" "}
                <span className="font-bold text-[#EA6C00] cursor-pointer">
                  <Link to="/registration">Sign up</Link>
                </span>
              </p>
              <p className=" pt-[35px] font-open text-theme text-center text-[13px] pl-[9px] font-bold">
                <Link to="/forgotPassword">Forgot Password?</Link>
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <img src={Login} alt="" className="h-screen w-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default LogIn;
