import styles from "./Chat.module.css";
import { IoMdCall, IoMdVideocam } from "react-icons/io";
import { VscInfo } from "react-icons/vsc";
import { FaImage, FaCamera, FaMicrophone } from "react-icons/fa";
import { BsEmojiGrinFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState } from "react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import useChatStore from "../lib/chatStore";
import useUserStore from "../lib/UserStore";
import uploadImage from "../lib/uploadImage";

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState(null);
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const { chatId, user, isCurrentUserBlocked, isRecieverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const uploadedImage = await uploadImage(file);

      if (uploadedImage && uploadedImage.url) {
        setImg({
          file,
          url: uploadedImage.url,
        });
      } else {
        console.error("Upload failed - no URL returned");
        alert("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleSend = async () => {
    if (!text.trim() && !img.url) return;

    let imgUrl = null;
    try {
      if (img.file && img.url) {
        imgUrl = img.url;
      }

      const messageObj = {
        senderId: currentUser.id,
        text: text.trim(),
        createdAt: Timestamp.now(),
        ...(imgUrl && { img: imgUrl }),
      };

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion(messageObj),
      });

      const userIDs = [currentUser.id, user.id];

      for (const id of userIDs) {
        const userChatsRef = doc(db, "userchats", id);
        const snapshot = await getDoc(userChatsRef);
        if (!snapshot.exists()) continue;

        const data = snapshot.data();
        const chatIndex = data.chats.findIndex((c) => c.chatId === chatId);
        if (chatIndex === -1) continue;

        const updatedChats = [...data.chats];
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          lastMessage: text.trim() || "Image",
          isSeen: id === currentUser.id,
          updatedAt: Date.now(),
        };

        await updateDoc(userChatsRef, {
          chats: updatedChats,
        });
      }
      setText("");

      setImg({
        file: null,
        url: "",
      });
    } catch (err) {
      console.error("Send Message Error:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  useEffect(() => {
    if (!chatId) return;
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      const data = res.data();
      setChat(data);
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  return (
    <div className={`col-5 ${styles["c1-col2"]}`}>
      <div className={styles["top"]}>
        <img
          src={
            user?.blocked?.includes(currentUser.id)
              ? "avatar.jpg"
              : user?.avatar || "avatar.jpg"
          }
          alt="avatar"
        />
        <div className={styles["user-name"]}>
          <span className={styles["userName"]}>
            {user?.blocked?.includes(currentUser.id)
              ? "User"
              : user?.username || "User"}
          </span>
          <p className={styles["status-text"]}>Online</p>
        </div>
        <div className={styles["icons"]}>
          <IoMdCall />
          <IoMdVideocam />
          <VscInfo />
        </div>
      </div>

      <div className={styles["center"]}>
        {chat?.messages?.map((message, index) => {
          const isOwn = message.senderId === currentUser.id;
          return (
            <div
              key={index}
              className={`${styles.message} ${isOwn ? styles.own : ""}`}
            >
              {!isOwn && (
                <img
                  src={
                    user?.blocked?.includes(currentUser.id)
                      ? "avatar.jpg"
                      : user?.avatar || "avatar.jpg"
                  }
                  alt=""
                />
              )}
              <div className={styles.texts}>
                {message.img && (
                  <img
                    src={message.img}
                    alt="chat-img"
                    className={styles["images"]}
                    onError={(e) => {
                      console.error("Image load error:", message.img);
                      console.error("Error event:", e);
                    }}
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  />
                )}
                {message.text && <p>{message.text}</p>}
                <span>
                  {message.createdAt?.seconds
                    ? new Date(
                        message.createdAt.seconds * 1000
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Just now"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles["bottom"]}>
        <div className={styles["icons"]}>
          <label htmlFor="file">
            <span
              className={styles["image-btn"]}
              disabled={isRecieverBlocked || isCurrentUserBlocked}
            >
              <FaImage />
            </span>
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImage}
            accept="image/*"
          />
          <FaCamera />
          <FaMicrophone />
        </div>
        {img.url && (
          <div className={styles["image-preview"]}>
            <img
              src={img.url}
              alt="Preview"
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                objectFit: "cover",
                borderRadius: "4px",
                margin: "8px 0",
              }}
            />
            <button
              onClick={() => setImg({ file: null, url: "" })}
              style={{
                marginLeft: "8px",
                padding: "4px 8px",
                backgroundColor: "#ff4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        )}
        <input
          type="text"
          value={text}
          placeholder={
            isCurrentUserBlocked || isRecieverBlocked
              ? "You cannot send a message"
              : "Text message..."
          }
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          disabled={isRecieverBlocked || isCurrentUserBlocked}
          className={styles["texts"]}
        />
        <div className={styles["icons"]}>
          <div className={styles["emoji-wrapper"]}>
            <button
              disabled={isRecieverBlocked || isCurrentUserBlocked}
              className={styles["emoji-btn"]}
            >
              <BsEmojiGrinFill onClick={() => setOpen(!open)} />
            </button>

            {open && (
              <div className={styles["emoji-picker-container"]}>
                <EmojiPicker
                  onEmojiClick={handleEmoji}
                  style={{ width: "280px", height: "350px" }}
                />
              </div>
            )}
          </div>
          <button
            className={styles["send"]}
            onClick={handleSend}
            disabled={isUploading || isRecieverBlocked || isCurrentUserBlocked}
          >
            {isUploading ? "..." : <IoSend />}
          </button>
        </div>
      </div>
    </div>
  );
}
