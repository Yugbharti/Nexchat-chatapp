import { useState } from "react";
import styles from "./Login.module.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../lib/firebase.js";
import { db } from "../../lib/firebase.js";
import { doc, setDoc } from "firebase/firestore";
import uploadImage from "../../lib/uploadImage.js";
import { IoCloudDownloadOutline } from "react-icons/io5";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadedImage = await uploadImage(file);
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: uploadedImage.url,
      });
    }
    setLoading(false);
  };
  const handleSignin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email_signin, password_signin } = Object.fromEntries(formData);
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        email_signin,
        password_signin
      );
      toast.success("Logged In successfully!!");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: avatar.url,
        id: res.user.uid,
        blocked: [],
      });
      toast.success("Account created successfully !!");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  return (
    <div className={styles["login-container"]}>
      <div className={styles["signin"]}>
        <h2>Welcome Back</h2>
        <form onSubmit={handleSignin}>
          <input
            type="email"
            placeholder="Email Address"
            name="email_signin"
            className={styles["input-box"]}
          />
          <input
            type="password"
            placeholder="password"
            name="password_signin"
            className={styles["input-box"]}
          />
          <button type="submit" className={styles["submit-btn"]}>
            Sign In
          </button>
        </form>
      </div>
      <div className={styles["separator"]}></div>
      <div className={styles["signup"]}>
        <h2>Create an Account</h2>
        <div className={styles["image"]}>
          <img src={avatar.url || "avatar.jpg"} alt="" />
          <label htmlFor="file">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className={styles["upload-label"]}>
                Upload an image
                <div className={styles["icons"]}>
                  <IoCloudDownloadOutline />
                </div>
              </div>
            )}
          </label>
          <input
            type="file"
            id="file"
            className={styles["file-input"]}
            onChange={handleAvatar}
          />
        </div>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="username"
            className={styles["input-box"]}
            name="username"
          />
          <input
            type="email"
            placeholder="Email Address"
            className={styles["input-box"]}
            name="email"
          />
          <input
            type="password"
            placeholder="password"
            className={styles["input-box"]}
            name="password"
          />
          <button type="submit" className={styles["submit-btn"]}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
