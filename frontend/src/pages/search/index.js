import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./index.module.css";

const SearchPage = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    console.log("[Query] Param:", searchParams.get("query"));
  }, [searchParams]);

  return (
    <div>
      <h1>Search Page</h1>
    </div>
  );
};

export default SearchPage;
