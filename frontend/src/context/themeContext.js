import { createContext, useReducer, useEffect } from "react";

export const ThemeContext = createContext();

export const themeReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      localStorage.setItem("theme-dark", JSON.stringify(action.payload.dark));
      return { dark: action.payload.dark };
    case "TOGGLE":
      localStorage.setItem("theme-dark", JSON.stringify(!state.dark));
      return { dark: !state.dark };
    default:
      return state;
  }
};

const ThemeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, { dark: false });

  // Used to intiialize state from locally-stored theme
  useEffect(() => {
    const isDark = JSON.parse(localStorage.getItem("theme-dark"));
    if (!isDark) {
      localStorage.setItem("theme-dark", JSON.stringify(false));
      return;
    }

    dispatch({
      type: "SET",
      payload: { dark: isDark === true },
    });
  }, []);

  // Use to update <body> theme class
  useEffect(() => {
    if (state.dark) document.body.setAttribute("data-theme", "dark");
    else document.body.setAttribute("data-theme", "light");
  }, [state.dark]);

  return (
    <ThemeContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
