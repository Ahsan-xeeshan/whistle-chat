/* eslint-disable react/prop-types */
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
import { useDispatch, useSelector } from "react-redux";
import { activeChat } from "../../Slices/activeSlice";

const Friends = ({ className }) => {
  const db = getDatabase();
  const data = useSelector((state) => state.user.userInfo);
  const [friendlist, setFriendList] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const friendRef = ref(db, "friend/");
    onValue(friendRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          data.uid == item.val().receiverid ||
          data.uid == item.val().senderid
        ) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setFriendList(arr);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBlock = (item) => {
    console.log(item);
    if (data.uid == item.senderid) {
      set(push(ref(db, "block/")), {
        block: item.receivername,
        blockid: item.receiverid,
        blockImg: item.receiverImg,
        blockby: item.sendername,
        blockbyid: item.senderid,
        blockbyImg: item.senderImg,
      }).then(() => {
        remove(ref(db, "friend/" + item.key));
      });
    } else {
      set(push(ref(db, "block/")), {
        block: item.sendername,
        blockid: item.senderid,
        blockImg: item.senderImg,
        blockby: item.receivername,
        blockbyid: item.receiverid,
        blockbyImg: item.receiverImg,
      }).then(() => {
        remove(ref(db, "friend/" + item.key));
      });
    }
  };

  const handleActive = (item) => {
    console.log(item);
    if (item.receiverid == data.uid) {
      dispatch(
        activeChat({
          status: "single",
          id: item.senderid,
          name: item.sendername,
          img: item.senderImg,
        })
      );
      localStorage.setItem(
        "active",
        JSON.stringify(
          activeChat({
            status: "single",
            id: item.senderid,
            name: item.sendername,
            img: item.senderImg,
          })
        )
      );
    } else {
      dispatch(
        activeChat({
          status: "single",
          id: item.receiverid,
          name: item.receivername,
          img: item.receiverImg,
        })
      );
      localStorage.setItem(
        "active",
        JSON.stringify(
          activeChat({
            status: "single",
            id: item.senderid,
            name: item.sendername,
            img: item.senderImg,
          })
        )
      );
    }
  };

  return (
    <div>
      <div
        className={`my-[43px] rounded-[20px] py-5 shadow-lg p-[20px]  overflow-y-scroll ${className}`}
      >
        <div className="flex items-center pb-[17px] justify-between">
          <div>
            <h2 className="font-pops text-xl font-semibold">Friends</h2>
          </div>
          <div>
            <BiDotsVerticalRounded className="text-primary text-[26px] font-semibold" />
          </div>
        </div>
        {friendlist.map((item) => (
          <div
            onClick={() => handleActive(item)}
            className="flex items-center justify-around border-b-2 py-3 last:border-none"
          >
            <div>
              {data.uid == item.senderid ? (
                <img
                  src={item.receiverImg}
                  alt=""
                  className="rounded-full w-[60px] h-[60px]"
                />
              ) : (
                <img
                  src={item.senderImg}
                  alt=""
                  className="rounded-full w-[60px] h-[60px]"
                />
              )}
            </div>
            <div>
              <h3 className="font-pops text-sm font-semibold">
                {data.uid == item.senderid
                  ? item.receivername
                  : item.sendername}
              </h3>
              <p className="text-xs">Hi Guys, Wassup!</p>
            </div>
            <div>
              <button
                onClick={() => handleBlock(item)}
                className="bg-primary px-[22px] text-white text-xs font-semibold capitalize rounded-md h-[30px]"
              >
                Block
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Friends;
