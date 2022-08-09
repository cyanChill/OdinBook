import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

import styles from "./index.module.css";

const SearchBar = ({ className, ...rest }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    location.pathname === "/search" ? searchParams.get("query") || "" : ""
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.pathname !== "/search") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    } else {
      setSearchParams({ query: searchTerm });
    }
  };

  useEffect(() => {
    if (location.pathname !== "/search") setSearchTerm("");
  }, [location]);

  return (
    <form
      className={`${styles.searchBar} ${className}`}
      onSubmit={handleSearch}
      autoComplete="off"
      {...rest}
    >
      <input
        type="text"
        placeholder="Search OdinWorks"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* Hide button until we enter something in the input */}
      <button
        type="submit"
        className={`${styles.searchBtn} ${searchTerm && styles.show}`}
      >
        🔎
      </button>
    </form>
  );
};

export default SearchBar;
