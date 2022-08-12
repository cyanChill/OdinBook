import { useNavigate } from "react-router";
import { BiCog } from "react-icons/bi";
import { IoKeyOutline, IoColorPaletteOutline } from "react-icons/io5";

import styles from "./index.module.css";
import Card from "../../components/ui/card";

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Card onClick={() => navigate("./account")} className={styles.card}>
        <BiCog />
        <div className={styles.info}>
          <p>Account</p>
          <p>
            This is where you can update your profile picture, name, and email.
          </p>
        </div>
      </Card>

      <Card onClick={() => navigate("./appearance")} className={styles.card}>
        <IoColorPaletteOutline />
        <div className={styles.info}>
          <p>Appearance</p>
          <p>This is where you can update the look of the app.</p>
        </div>
      </Card>

      <Card onClick={() => navigate("./security")} className={styles.card}>
        <IoKeyOutline />
        <div className={styles.info}>
          <p>Security</p>
          <p>
            This is where you can update your password and delete your account.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
