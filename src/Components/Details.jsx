import styles from "./Details.module.css";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiOutlineDownload } from "react-icons/hi";
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import useUserStore from "../lib/UserStore";
import useChatStore from "../lib/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

export default function Details() {
  const { chatId, user, isCurrentUserBlocked, isRecieverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };
  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isRecieverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={`col ${styles["c1-col3"]}`}>
      <div className={styles["user"]}>
        <img
          src={
            user?.blocked?.includes(currentUser.id)
              ? "avatar.jpg"
              : user?.avatar || "avatar.jpg"
          }
          alt=""
        />
        <h1>
          {user?.blocked?.includes(currentUser.id)
            ? "User"
            : user?.username || "User"}
        </h1>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className={styles["utilities"]}>
        <div className={styles["row-utility"]}>
          <p>Chat Settings</p>
          <span>
            <MdKeyboardArrowUp />
          </span>
        </div>
        <div className={styles["row-utility"]}>
          <p>Privacy & Help</p>
          <span>
            <MdKeyboardArrowUp />
          </span>
        </div>
        <div className={styles["row-utility"]}>
          <p>Shared Photos</p>
          <span>
            <MdKeyboardArrowDown />
          </span>
        </div>
        <div className={styles["SharedImages"]}>
          <div className={styles["images"]}>
            <div className={styles["images-info"]}>
              <div className={styles["photo"]}>
                <img src="image.jpg" alt="" />
              </div>
              <div className="photo-url">
                <p>photo_2025.jpg</p>
              </div>
            </div>
            <div className={styles["icon"]}>
              <HiOutlineDownload />
            </div>
          </div>

          <div className={styles["images"]}>
            <div className={styles["images-info"]}>
              <div className={styles["photo"]}>
                <img src="image.jpg" alt="" />
              </div>
              <div className="photo-url">
                <p>photo_2025.jpg</p>
              </div>
            </div>
            <div className={styles["icon"]}>
              <HiOutlineDownload />
            </div>
          </div>

          <div className={styles["images"]}>
            <div className={styles["images-info"]}>
              <div className={styles["photo"]}>
                <img src="image.jpg" alt="" />
              </div>
              <div className="photo-url">
                <p>photo_2025.jpg</p>
              </div>
            </div>
            <div className={styles["icon"]}>
              <HiOutlineDownload />
            </div>
          </div>
        </div>
        <div className={styles["row-utility"]}>
          <p>Shared Files</p>
          <span>
            <MdKeyboardArrowUp />
          </span>
        </div>

        <button onClick={handleLogout} className={styles["logout-btn"]}>
          Log Out
        </button>
        <button className={styles["block-button"]} onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked"
            : isRecieverBlocked
            ? "Unblock User"
            : "Block User"}
        </button>
        <div className={styles["row-utility"]}>
          <p>Chat Settings</p>
          <span>
            <MdKeyboardArrowUp />
          </span>
        </div>
      </div>
    </div>
  );
}
