import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./index.module.css";
import SearchBar from "../../components/nav/searchbar";

const SearchPage = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    console.log("[Query] Param:", searchParams.get("query"));
  }, [searchParams]);

  return (
    <div>
      <h1>Search Page</h1>
      <SearchBar className={styles.searchBar} />
    </div>
  );
};

export default SearchPage;
