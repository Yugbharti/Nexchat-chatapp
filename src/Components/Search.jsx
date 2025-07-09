import { IoSearchOutline } from "react-icons/io5";
import { IoAddSharp } from "react-icons/io5";
import { IoIosRemove } from "react-icons/io";
import styles from "./Search.module.css";
import Adduser from "./AddnewUser/Adduser";
import { useState } from "react";

export default function Search({ setsearchval }) {
  const [add, setAdd] = useState(true);
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    setInput(e.target.value);
    setsearchval(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setAdd((prev) => !prev);
  };

  return (
    <div className={styles["search"]}>
      <span className={styles["search-bar"]}>
        <span className={styles["icons"]}>
          <IoSearchOutline />
        </span>
        <input
          type="search"
          placeholder="Search"
          className={styles["search-input"]}
          value={input}
          onChange={handleChange}
        />
      </span>
      <button className={styles["add"]} onClick={handleClick}>
        {add ? <IoAddSharp /> : <IoIosRemove />}
      </button>
      {!add && <Adduser />}
    </div>
  );
}
