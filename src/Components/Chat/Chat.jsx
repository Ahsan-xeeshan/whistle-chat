/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import EmojiPicker from "emoji-picker-react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as sref,
  uploadBytes,
} from "firebase/storage";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaTelegramPlane } from "react-icons/fa";
import { IoTriangleSharp } from "react-icons/io5";
import { LiaCameraSolid } from "react-icons/lia";
import { MdEmojiEmotions } from "react-icons/md";
import ModalImage from "react-modal-image";
import { useSelector } from "react-redux";
const Chat = () => {
  const activeChat = useSelector((state) => state.activeChatSlice.active);
  const data = useSelector((state) => state.user.userInfo);
  const storage = getStorage();

  const [msg, setMsg] = useState("");
  const [singleMsg, setSingleMsg] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const db = getDatabase();

  const handleMsg = () => {
    if (activeChat.status == "single") {
      if (msg != "") {
        set(push(ref(db, "singleMsg/")), {
          msg: msg,
          msgSenderId: data.uid,
          msgSenderName: data.displayName,
          msgReceiverId: activeChat.id,
          msgReceiverName: activeChat.name,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }- ${new Date().getDate()}, ${new Date().getHours()}:${new Date().getMinutes()}`,
        });
      }
      setMsg("");
    } else {
      console.log("I am group");
    }
  };

  const handleImage = (e) => {
    let upFile = e.target.files[0];
    const storageRef = sref(storage, "some-child");

    uploadBytes(storageRef, upFile).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        set(push(ref(db, "singleMsg/")), {
          img: downloadURL,
          msgSenderId: data.uid,
          msgSenderName: data.displayName,
          msgReceiverId: activeChat.id,
          msgReceiverName: activeChat.name,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }- ${new Date().getDate()}, ${new Date().getHours()}:${new Date().getMinutes()}`,
        });
      });
    });
  };

  const handleEmoji = (emoji) => {
    setMsg(msg + emoji.emoji);
  };

  useEffect(() => {
    const msgRef = ref(db, "singleMsg/");
    onValue(msgRef, (snapShot) => {
      let arr = [];
      snapShot.forEach((item) => {
        if (
          (item.val().msgSenderId == data.uid &&
            item.val().msgReceiverId == activeChat.id) ||
          (item.val().msgReceiverId == data.uid &&
            item.val().msgSenderId == activeChat.id)
        ) {
          arr.push(item.val());
        }
      });
      setSingleMsg(arr);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat.id]);

  return (
    <div className="mt-[10px] rounded-[20px]  h-[750px] drop-shadow-lg border relative">
      <div className="flex items-center justify-between border-b py-2 px-5 top-0 left-0 right-0 sticky z-50 bg-white">
        <div className="flex items-center justify-between">
          <img
            src={activeChat.img}
            alt=""
            className="rounded-full w-[60px] h-[60px]"
          />
          <div className="ml-[20px]  ">
            <h3 className="font-pops text-xl font-bold">{activeChat.name}</h3>
            <p className="text-xs text-gray-500 font-pops">Online</p>
          </div>
        </div>
        <div>
          <BiDotsVerticalRounded className="text-primary text-[26px] font-semibold" />
        </div>
      </div>
      <div className="pt-[120px] px-[50px] h-[650px]  overflow-y-scroll">
        {/* receiver msg */}
        {singleMsg.map((item) =>
          item.msgSenderId == data.uid ? (
            item.img ? (
              <div className="text-right">
                <div className="relative text-right mt-11">
                  <p className="text-xl text-left font-bold text-[20px] font-pops bg-primary p-4 inline-block rounded-lg text-white w-[300px]">
                    <ModalImage small={item.img} large={item.img} />
                  </p>
                  <IoTriangleSharp className="absolute bottom-[3.5px] right-[-12px] text-2xl text-primary" />
                </div>
                <p>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
              </div>
            ) : (
              <div className="text-right">
                <div className="relative mt-11">
                  <p className="text-xl text-left font-bold text-[20px] font-pops bg-primary py-[20px] px-[50px] inline-block rounded-lg text-white w-[400px]">
                    {item.msg}
                  </p>
                  <IoTriangleSharp className="absolute bottom-[-2px] right-[-12px] text-2xl text-primary" />
                </div>
                <p>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
              </div>
            )
          ) : item.img ? (
            <div>
              <div className="relative mt-11">
                <p className="text-xl text-left font-bold text-[20px] font-pops bg-[#F1F1f1] p-4 inline-block rounded-lg w-[300px]">
                  <ModalImage small={item.img} large={item.img} />
                </p>
                <IoTriangleSharp className="absolute bottom-[3.5px] left-[-13px] text-2xl text-[#F1F1f1]" />
              </div>
              <p>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
            </div>
          ) : (
            <div>
              <div className="relative mt-11">
                <p className="text-xl text-left font-bold text-[20px] font-pops bg-[#F1F1f1] py-[20px] px-[50px] inline-block rounded-lg w-[400px]">
                  {item.msg}
                </p>
                <IoTriangleSharp className="absolute bottom-[-3px] left-[-13px] text-2xl text-[#F1F1f1]" />
              </div>
              <p>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
            </div>
          )
        )}
      </div>
      <div className="sticky bottom-0 left-0 right-0 w-full bg-white border border-t-[#F1F1F1] py-[34px] rounded">
        <div className="flex items-center">
          <div className="relative">
            {showEmoji && (
              <div className="absolute bottom-[60px] right-[55px]">
                <EmojiPicker onEmojiClick={(emoji) => handleEmoji(emoji)} />
              </div>
            )}
            <label>
              <MdEmojiEmotions
                onClick={(e) => setShowEmoji(!showEmoji)}
                className="absolute top-[13px] right-[44px] text-xl cursor-pointer"
              />
            </label>
            <label>
              <input onChange={handleImage} type="file" className="hidden" />
              <LiaCameraSolid className="absolute top-[13px] right-[14px] text-xl cursor-pointer" />
            </label>
            <input
              onChange={(e) => setMsg(e.target.value)}
              value={msg}
              type="text"
              className=" w-[800px] ml-[54px] h-[45px] bg-[#F1F1F1] outline-none px-6 rounded-lg"
            />
          </div>
          <div>
            <button
              onClick={handleMsg}
              className="bg-primary text-white p-3 rounded-lg ml-9 "
            >
              <FaTelegramPlane className="text-[22px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
