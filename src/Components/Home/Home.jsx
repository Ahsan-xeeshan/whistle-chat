import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userLoginInfo } from "../../Slices/userSlice";
import BlockedUser from "../BlockedUser/BlockedUser";
import FriendRequest from "../FriendRequest/FriendRequest";
import Friends from "../Friends/Friends";
import GroupList from "../GroupList/GroupList";
import MyGroup from "../MyGroup/MyGroup";
import Sidebar from "../Sidebar/Sidebar";
import UserList from "../UserList/UserList";

const Home = () => {
  const auth = getAuth();
  const data = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const [verify, setVerify] = useState(false);
  const navigate = useNavigate();
  console.log(data);

  onAuthStateChanged(auth, (user) => {
    if (user.emailVerified) {
      setVerify(true);
      dispatch(userLoginInfo(user));
      localStorage.setItem("userInfo", JSON.stringify(user));
    }
  });

  useEffect(() => {
    if (!data) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {verify ? (
        <div className="flex">
          <div className="w-[186px] h-screen mx-[32px] py-[35px]">
            <Sidebar active="home" />
          </div>
          <div className="w-[427px] mx-[43px] py-[35px] ">
            <GroupList />
            <FriendRequest />
          </div>
          <div className="w-[380px]">
            <Friends className="h-[440px]" />
            <MyGroup />
          </div>
          <div className="w-[380px]">
            <UserList />
            <BlockedUser />
          </div>
        </div>
      ) : (
        <div className="h-screen bg-primary text-white w-full">
          <h1 className="text-[90px] font-open font-bold">
            Please verify your mail
          </h1>
          <button>
            <Link to="/">Back To Login</Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
