import styles from "./UserChatList.module.css";
import useUserStore from "../lib/UserStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useState, useEffect } from "react";
import useChatStore from "../lib/chatStore";

export default function UserChatList({ searchval = "" }) {
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const data = res.data();
        if (!data || !Array.isArray(data.chats)) {
          setChats([]);
          return;
        }
        const items = data.chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.recieverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();

          return { ...item, user };
        });
        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );
    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const filteredChats = chats.filter((chat) =>
    chat.user?.username?.toLowerCase().includes(searchval.toLowerCase())
  );

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    if (chatIndex !== -1) {
      userChats[chatIndex].isSeen = true;
      const userChatsRef = doc(db, "userchats", currentUser.id);
      try {
        await updateDoc(userChatsRef, {
          chats: userChats,
        });
        changeChat(chat.chatId, chat.user);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <ul className="list-group list-group-flush">
      {filteredChats.map((chat) => (
        <li
          key={chat.user?.id}
          className={`list-group-item ${styles["chat-list"]}`}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
          }}
        >
          <img
            src={
              chat.user?.blocked?.includes(currentUser.id)
                ? "avatar.jpg"
                : chat.user?.avatar
            }
            alt="avatar"
          />
          <div className={styles["chat-details"]}>
            <p className={styles["chat-name"]}>
              {chat.user?.blocked?.includes(currentUser.id)
                ? "User"
                : chat.user?.username}
            </p>
            <p className={styles["chat-last-message"]}>
              {chat.lastMessage?.slice(0, 40) || "No messages yet."}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
