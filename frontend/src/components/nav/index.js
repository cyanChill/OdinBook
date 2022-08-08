import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiFillHome, AiFillSetting, AiOutlineSearch } from "react-icons/ai";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdExitToApp } from "react-icons/md";

import useAuthContext from "../../hooks/useAuthContext";
import useSignOut from "../../hooks/useSignOut";

import styles from "./index.module.css";
import SearchBar from "./searchbar";

const USER_OBJ = { profilePic: "", fullName: "", id: "" };

const Navbar = () => {
  const location = useLocation();

  const { user, authedFetch } = useAuthContext();
  const { signout } = useSignOut();

  const [userInfo, setUserInfo] = useState(USER_OBJ);
  const menuRef = useRef();

  // Save to component basic user info
  useEffect(() => {
    const fetchUserAssets = async () => {
      const res = await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${user.userId}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserInfo({
          profilePic: data.user.profilePicUrl,
          fullName: `${data.user.first_name} ${data.user.last_name}`,
          id: user.userId,
        });
      }
    };

    if (user.userId) {
      fetchUserAssets();
    }
  }, [user]);

  // Close menu when we click outside of menu
  const closeMenuClick = (e) => {
    if (!e.target.closest("#navbar")) menuRef.current.checked = false;
  };
  useEffect(() => {
    window.addEventListener("click", closeMenuClick);
    return () => {
      window.removeEventListener("click", closeMenuClick);
    };
  }, []);

  // Close menu when we switch pages
  useEffect(() => {
    menuRef.current.checked = false;
  }, [location]);

  return (
    <nav id="navbar" className={styles.nav}>
      {/* Left End */}
      <Link to="/">
        <img src="/assets/logo.png" alt="logo" className={styles.logo} />
      </Link>

      <SearchBar className={styles.searchBar} />

      <input type="checkbox" className={styles.navControl} ref={menuRef} />

      <div className={styles.sidebar}>
        <Link to="/" className={styles.profile}>
          <img src={userInfo.profilePic} alt="user profile pic" />
          <span> {userInfo.fullName}</span>
        </Link>
        <Link to="/">
          <AiFillHome />
          <span>Home</span>
        </Link>
        <Link to="/search">
          <AiOutlineSearch />
          <span>Search</span>
        </Link>
        <Link to="/friends">
          <BsFillPeopleFill />
          <span>Friends</span>
        </Link>
        <Link to="/settings">
          <AiFillSetting />
          <span>Settings</span>
        </Link>
        <button onClick={signout}>
          <MdExitToApp />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
