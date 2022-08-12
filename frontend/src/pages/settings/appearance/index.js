import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { IoChevronBackCircle } from "react-icons/io5";

import useTheme from "../../../hooks/useTheme";

import styles from "./index.module.css";
import Card from "../../../components/ui/card";
import ToggleButton from "../../../components/formElements/toggleBtn";

const AppearanceSettingsPage = () => {
  const navigate = useNavigate();
  const { dark: darkTheme, setDarkTheme } = useTheme();

  const [isDark, setIsDark] = useState(false);

  const handleThemeChange = (e) => {
    setIsDark(e.target.checked);
    setDarkTheme(e.target.checked);
  };

  useEffect(() => {
    setIsDark(darkTheme);
  }, [darkTheme]);

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div onClick={() => navigate("..")} className={styles.back}>
          <IoChevronBackCircle /> Appearance
        </div>

        <section className={styles.section}>
          <h2>Theme</h2>
          <div className={styles.sectionRow}>
            <p>Dark Mode</p>
            <ToggleButton checked={isDark} onChange={handleThemeChange} />
          </div>
        </section>
      </Card>
    </div>
  );
};

export default AppearanceSettingsPage;
