/* eslint-disable react/jsx-key */
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useSelector } from "react-redux";

const FriendRequest = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.user.userInfo);
  const [friendReqList, setFriendReqList] = useState([]);

  useEffect(() => {
    const friendReqRef = ref(db, "friendRequest/");
    onValue(friendReqRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().receiverid == data.uid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setFriendReqList(arr);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccept = (item) => {
    console.log(item);
    set(push(ref(db, "friend/")), {
      ...item,
    }).then(() => {
      remove(ref(db, "friendRequest/" + item.key));
    });
  };

  return (
    <div>
      <div className="my-[43px] rounded-[20px] py-5 shadow-lg p-[20px]  overflow-y-scroll h-[347px] ">
        <div className="flex items-center pb-[17px] justify-between">
          <div>
            <h2 className="font-pops text-xl font-semibold">Friend Request</h2>
          </div>
          <div>
            <BiDotsVerticalRounded className="text-primary text-[26px] font-semibold" />
          </div>
        </div>
        {friendReqList.map((item) => (
          <div className="flex items-center justify-around border-b-2 py-3 last:border-none">
            <div>
              <img
                src={item.senderImg}
                alt=""
                className="rounded-full w-[60px] h-[60px]"
              />
            </div>
            <div>
              <h3 className="font-pops text-lg font-semibold">
                {item.sendername}
              </h3>
              <p>Hi Guys, Wassup!</p>
            </div>
            <div>
              <button
                onClick={() => handleAccept(item)}
                className="bg-primary px-[22px] text-white text-xl font-semibold capitalize rounded-md h-[30px]"
              >
                accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequest;
