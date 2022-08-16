import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import useAuthContext from "../../hooks/useAuthContext";

import styles from "./index.module.css";
import Loading from "../../components/ui/loading";
import SearchBar from "../../components/nav/searchbar";
import FriendWidget from "../../components/friends/widget";
import Card from "../../components/ui/card";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const { authedFetch } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const query = searchParams.get("query");

  useEffect(() => {
    const findQuery = async () => {
      setLoading(true);
      setResults([]);
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        const res = await authedFetch(
          `${
            process.env.REACT_APP_BACKEND_URL
          }/api/users/search?searchQuery=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        if (res.ok) setResults(data.users);
      } catch (err) {
        console.log("Something unexpected occurred.");
      }

      setLoading(false);
    };

    findQuery();
  }, [searchParams, query]); // eslint-disable-line

  return (
    <div className={styles.container}>
      {/* Add stylign to center search bar */}
      <SearchBar className={styles.searchBar} />

      {loading && <Loading fullWidth />}

      <div className={styles.messages}>
        {!loading && !query && <p>Please enter a search query.</p>}
        {!loading && query && results.length === 0 && <p>No results found.</p>}
      </div>

      {!loading && results.length > 0 && (
        <div className={styles.resultsContainer}>
          {results.map((usr) => (
            <Card key={usr._id}>
              <FriendWidget user={usr} type="FRIENDS" />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
