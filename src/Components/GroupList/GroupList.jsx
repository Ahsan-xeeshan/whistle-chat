/* eslint-disable react/jsx-key */
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import groupPhoto from "../../assets/groupPhoto.png";

const GroupList = () => {
  const [show, setShow] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupTagName, setGroupTagName] = useState("");
  const [groupData, setGroupData] = useState([]);
  const [error, setError] = useState("");
  const [tagError, setTagError] = useState("");
  const [searchData, SetSearchData] = useState([]);
  const db = getDatabase();
  const data = useSelector((state) => state.user.userInfo);

  const handleSearch = (e) => {
    let arr = [];
    if (e.target.value.length === 0) {
      SetSearchData([]);
    } else {
      groupData.filter((item) => {
        if (item.groupName.toLowerCase().includes(e.target.value)) {
          arr.push(item);
          SetSearchData(arr);
        }
      });
    }
  };

  const handleGroup = () => {
    setShow(!show);
  };

  const handleGroupName = (e) => {
    setGroupName(e.target.value);
    setError("");
  };

  const handleGroupTagName = (e) => {
    setGroupTagName(e.target.value);
    setTagError("");
  };

  const handleCreateGroup = () => {
    if (!groupName) {
      setError("Group Name is required!");
    }
    if (!groupTagName) {
      setTagError("Group Tag Name is required!");
    }
    if (groupName && groupTagName) {
      set(push(ref(db, "groups/")), {
        groupName,
        groupTagName,
        adminName: data.displayName,
        adminId: data.uid,
      });
      setShow(false);
    }
    setGroupName("");
    setGroupTagName("");
  };
  const handleCancel = () => {
    setShow(false);
    setError("");
    setTagError("");
  };

  useEffect(() => {
    const groupRef = ref(db, "groups/");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().adminId != data.uid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setGroupData(arr);
      console.log(groupData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <div className="flex items-center justify-around h-[59px] rounded-full py-5 shadow-lg">
        <div>
          <FiSearch className="text-[26px]" />
        </div>
        <div>
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Search"
            className="w-[300px] font-pops font-medium text-[#3D3D3D59] text-base outline-none"
          />
        </div>
        <div>
          <BiDotsVerticalRounded className="text-primary text-[26px] font-semibold" />
        </div>
      </div>
      <div className="my-[43px] rounded-[20px] py-5 shadow-lg p-[20px]  overflow-y-scroll h-[347px] ">
        <div className="flex items-center pb-[17px] justify-between">
          <div>
            <h2 className="font-pops text-xl font-semibold">Group List</h2>
          </div>
          <div>
            <button
              onClick={handleGroup}
              className="bg-primary text-white w-32 p-2 rounded-lg"
            >
              Create Group
            </button>
          </div>
        </div>
        {show ? (
          <div className="w-full h-screen absolute top-0 left-0 flex justify-center items-center z-[1000] bg-group bg-no-repeat bg-cover bg-blend-color-burn">
            <div className="w-[500px] bg-white rounded-3xl p-10">
              <p className="font-nun text-[30px] font-bold mb-5">
                Create your group
              </p>
              <input
                type="text"
                onChange={handleGroupName}
                placeholder="Group Name"
                className="py-[17px] pl-1 w-96 border-b border-[#11175d3b] outline-none  text-xl font-open text-theme font-semibold"
              />
              {error && (
                <p className="bg-red-500 text-white w-96 py-2 px-1 mt-2">
                  {error}
                </p>
              )}
              <input
                type="text"
                onChange={handleGroupTagName}
                placeholder="Group Tag Name"
                className="py-[17px] pl-1 w-96 border-b border-[#11175d3b] outline-none  text-xl font-open text-theme font-semibold"
              />
              {tagError && (
                <p className="bg-red-500 text-white w-96 py-2 px-1 mt-2">
                  {tagError}
                </p>
              )}
              <button
                onClick={handleCreateGroup}
                className="px-5 py-2 bg-primary text-white text-lg font-medium mt-5 rounded-xl"
              >
                Create
              </button>
              <button
                onClick={handleCancel}
                className="px-5 py-2 bg-red-500 text-white text-lg font-medium mt-5 ml-5 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {searchData.length > 0
              ? searchData.map((item) => (
                  <div className="flex items-center justify-around border-b-2 py-3 last:border-none">
                    <div>
                      <img src={groupPhoto} alt="" />
                    </div>
                    <div>
                      <h3 className="font-pops text-lg font-semibold">
                        {item.groupName}
                      </h3>
                      <p>{item.groupTagName}</p>
                    </div>
                    <div>
                      <button className="bg-primary px-[14px] text-white  rounded-md h-[30px]">
                        Join
                      </button>
                    </div>
                  </div>
                ))
              : groupData.map((item) => (
                  <div className="flex items-center justify-around border-b-2 py-3 last:border-none">
                    <div>
                      <img src={groupPhoto} alt="" />
                    </div>
                    <div>
                      <h3 className="font-pops text-lg font-semibold">
                        {item.groupName}
                      </h3>
                      <p>{item.groupTagName}</p>
                    </div>
                    <div>
                      <button className="bg-primary px-[14px] text-white  rounded-md h-[30px]">
                        Join
                      </button>
                    </div>
                  </div>
                ))}
          </>
        )}
      </div>
    </div>
  );
};

export default GroupList;
