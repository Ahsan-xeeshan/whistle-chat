/* eslint-disable react/jsx-key */
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useSelector } from "react-redux";
import friendPic from "../../assets/friend.png";

const MyGroup = () => {
  const db = getDatabase();
  const [myGroup, setMyGroup] = useState([]);
  const data = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    const myGroupRef = ref(db, "groups/");
    onValue(myGroupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().adminId == data.uid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setMyGroup(arr);
      console.log(myGroup);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="my-[43px] rounded-[20px] py-5 shadow-lg p-[20px]  overflow-y-scroll h-[347px] ">
        <div className="flex items-center pb-[17px] justify-between">
          <div>
            <h2 className="font-pops text-xl font-semibold">My Group</h2>
          </div>
          <div>
            <BiDotsVerticalRounded className="text-primary text-[26px] font-semibold" />
          </div>
        </div>
        {myGroup.map((item) => (
          <div className="flex items-center justify-around border-b-2 py-3 last:border-none">
            <div>
              <img src={friendPic} alt="" />
            </div>
            <div>
              <h3 className="font-pops text-sm font-semibold">
                {item.groupName}
              </h3>
              <p className="text-xs">{item.groupTagName}</p>
            </div>
            <div>
              <button className="bg-primary px-[22px] text-white text-xs font-semibold capitalize rounded-md h-[30px]">
                accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyGroup;
