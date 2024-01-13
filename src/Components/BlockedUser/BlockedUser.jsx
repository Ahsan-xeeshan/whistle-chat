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

const BlockedUser = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.user.userInfo);
  const [blockList, setBlockList] = useState([]);

  useEffect(() => {
    const blockRef = ref(db, "block/");
    onValue(blockRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        console.log(item.val());
        if (item.val().blockbyid == data.uid) {
          arr.push({
            key: item.key,
            block: item.val().block,
            blockid: item.val().blockid,
            blockimg: item.val().blockImg,
          });
        } else {
          arr.push({
            key: item.key,
            blockby: item.val().blockby,
            blockbyid: item.val().blockbyid,
            blockbyimg: item.val().blockbyImg,
          });
        }
      });
      setBlockList(arr);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnblock = (item) => {
    set(push(ref(db, "friend/")), {
      receivername: item.block,
      receiverid: item.blockid,
      receiverImg: item.blockimg,
      sendername: data.displayName,
      senderid: data.uid,
      senderImg: data.photoURL,
    }).then(() => {
      remove(ref(db, "block/" + item.key));
    });
  };
  console.log(blockList);
  return (
    <div>
      <div className="my-[43px] rounded-[20px] py-5 shadow-lg p-[20px]  overflow-y-scroll h-[347px] ">
        <div className="flex items-center pb-[17px] justify-between">
          <div>
            <h2 className="font-pops text-xl font-semibold">Blocked User</h2>
          </div>
          <div>
            <BiDotsVerticalRounded className="text-primary text-[26px] font-semibold" />
          </div>
        </div>
        {blockList.map((item) => (
          <div className="flex items-center justify-around border-b-2 py-3 last:border-none">
            <div>
              {item.blockimg && (
                <img
                  src={item.blockimg}
                  alt=""
                  className="rounded-full w-[60px] h-[60px]"
                />
              )}

              {item.blockbyimg && (
                <img
                  src={item.blockbyimg}
                  alt=""
                  className="rounded-full w-[60px] h-[60px]"
                />
              )}
            </div>
            <div>
              <h3 className="font-pops text-sm font-semibold">{item.block}</h3>
              <h3 className="font-pops text-sm font-semibold">
                {item.blockby}
              </h3>
              <p className="text-xs">Hi Guys, Wassup!</p>
            </div>
            <div>
              {!item.blockbyid && (
                <button
                  onClick={() => {
                    handleUnblock(item);
                  }}
                  className="bg-primary px-[22px] text-white text-lg font-pops font-semibold  rounded-md h-[30px]"
                >
                  unblock
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockedUser;
