import { useNavigate } from "react-router";
import { BsFillShieldFill, BsFillShieldLockFill } from "react-icons/bs";

import styles from "./index.module.css";
import Card from "../../components/ui/card";

const PolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.policyContainer}>
      <Card onClick={() => navigate("./privacy")} className={styles.widget}>
        <BsFillShieldLockFill />
        <p>Privacy Policy</p>
      </Card>

      <Card onClick={() => navigate("./tos")} className={styles.widget}>
        <BsFillShieldFill />
        <p>Terms of Service</p>
      </Card>
    </div>
  );
};

export default PolicyPage;
