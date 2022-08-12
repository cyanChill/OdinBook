import useThemeContext from "./useThemeContext";

const useTheme = () => {
  const { dark, dispatch } = useThemeContext();

  const setDarkTheme = (bool) => {
    dispatch({ type: "SET", payload: { dark: bool === true } });
  };

  const toggleTheme = () => {
    dispatch({ type: "TOGGLE" });
  };

  return { dark, setDarkTheme, toggleTheme };
};

export default useTheme;
