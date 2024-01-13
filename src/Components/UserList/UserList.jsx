import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";

const UserList = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.user.userInfo);

  const [userData, setUserData] = useState([]);
  const [friendReqList, setFriendReqList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [blockList, setBlockList] = useState([]);

  useEffect(() => {
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid !== item.key) {
          arr.push({ ...item.val(), userid: item.key });
        }
      });
      setUserData(arr);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFriendRequest = (item) => {
    set(push(ref(db, "friendRequest/")), {
      sendername: data.displayName,
      senderid: data.uid,
      receivername: item.username,
      receiverid: item.userid,
      senderImg: data.photoURL,
      receiverImg: item.photo,
    });
  };

  useEffect(() => {
    const friendReqRef = ref(db, "friendRequest/");
    onValue(friendReqRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receiverid + item.val().senderid);
      });
      setFriendReqList(arr);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(friendList, "friend");

  useEffect(() => {
    const friendRef = ref(db, "friend/");
    onValue(friendRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receiverid + item.val().senderid);
      });
      setFriendList(arr);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const blockRef = ref(db, "block/");
    onValue(blockRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().blockid + item.val().blockbyid);
      });
      setBlockList(arr);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(blockList, "blocked");

  return (
    <div>
      <div className="my-[43px] rounded-[20px] py-5 shadow-lg p-[20px]  overflow-y-scroll h-[440px] ">
        <div className="flex items-center pb-[17px] justify-between">
          <div>
            <h2 className="font-pops text-xl font-semibold">User List</h2>
          </div>
          <div>
            <BiDotsVerticalRounded className="text-primary text-[26px] font-semibold" />
          </div>
        </div>
        {userData.map((item) => (
          // eslint-disable-next-line react/jsx-key
          <div className="flex items-center justify-around border-b-2 py-3 last:border-none">
            <div>
              <img
                src={item.photo}
                alt=""
                className="rounded-full w-[60px] h-[60px]"
              />
            </div>
            <div>
              <h3 className="font-pops text-sm font-semibold">
                {item.username}
              </h3>
              <p className="text-xs">{item.email}</p>
            </div>
            <div>
              {blockList.includes(item.userid + data.uid) ||
              blockList.includes(data.uid + item.userid) ? (
                <button className="bg-red-500 px-[14px] text-white  rounded-md h-[30px] cursor-default">
                  Blocked
                </button>
              ) : (
                <>
                  {friendList.includes(item.userid + data.uid) ||
                  friendList.includes(data.uid + item.userid) ? (
                    <button className="bg-primary px-[14px] text-white  rounded-md h-[30px]">
                      Friend
                    </button>
                  ) : (
                    <>
                      {friendReqList.includes(item.userid + data.uid) ||
                      friendReqList.includes(data.uid + item.userid) ? (
                        <button className="bg-primary px-[14px] text-white  rounded-md h-[30px]">
                          Pending
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFriendRequest(item)}
                          className="bg-primary px-[14px] text-white  rounded-md h-[30px]"
                        >
                          <FaPlus className="text-lg font-extrabold" />
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
