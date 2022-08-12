import { useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiFillHome, AiFillSetting, AiOutlineSearch } from "react-icons/ai";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdExitToApp } from "react-icons/md";

import useAuthContext from "../../hooks/useAuthContext";
import useSignOut from "../../hooks/useSignOut";

import styles from "./index.module.css";
import ProfilePic from "../ui/profilePic";
import SearchBar from "./searchbar";

const Navbar = () => {
  const location = useLocation();

  const { user } = useAuthContext();
  const { signout } = useSignOut();

  const menuRef = useRef();

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
        <Link to={`/profiles/${user.id}`} className={styles.profile}>
          <ProfilePic src={user.profilePicUrl} alt="user profile pic" rounded />
          <span className="ellipse">{user.fullName}</span>
        </Link>
        <Link to="/">
          <AiFillHome />
          <span className="ellipse">Home</span>
        </Link>
        <Link to="/search">
          <AiOutlineSearch />
          <span className="ellipse">Search</span>
        </Link>
        <Link to={`/profiles/${user.id}/friends`}>
          <BsFillPeopleFill />
          <span className="ellipse">Friends</span>
        </Link>
        <Link to="/settings">
          <AiFillSetting />
          <span className="ellipse">Settings</span>
        </Link>
        <button onClick={signout}>
          <MdExitToApp />
          <span className="ellipse">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
