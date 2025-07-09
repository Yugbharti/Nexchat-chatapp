import styles from "./chatList.module.css";
import { BsThreeDots } from "react-icons/bs";
import { HiVideoCamera } from "react-icons/hi2";
import { BiMessageSquareEdit } from "react-icons/bi";
import Search from "./Search";
import UserChatList from "./UserChatList";
import useUserStore from "../lib/UserStore";
import { useState } from "react";

export default function ChatList() {
  const { currentUser } = useUserStore();
  const [searchval, setSearchval] = useState("");

  return (
    <div className={`col ${styles["c1-col1"]}`}>
      <div className={styles.User}>
        <div className={styles["user-info"]}>
          <div className={styles["user-image"]}>
            <img src={currentUser.avatar} alt="avatar" />
          </div>
          <span className={styles.Name}>{currentUser.username}</span>
        </div>
        <div className={styles.icons}>
          <BsThreeDots />
          <HiVideoCamera />
          <BiMessageSquareEdit />
        </div>
      </div>
      <Search setsearchval={setSearchval} />
      <UserChatList searchval={searchval} />
    </div>
  );
}
