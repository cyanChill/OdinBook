import { useNavigate } from "react-router";
import { IoChevronBackCircle } from "react-icons/io5";

import styles from "../index.module.css";
import Card from "../../../components/ui/card";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <header>
          <h1 onClick={() => navigate("/policies")} className={styles.back}>
            <IoChevronBackCircle />
            Privacy Policy
          </h1>
          <p>
            Last Updated on <b>August 13, 2022</b>.
          </p>
        </header>

        <h2>Personal Information</h2>
        <p>
          OdinWorks will store the following personal information on account
          creation:
        </p>
        <ul>
          <li>Name</li>
          <li>Email</li>
        </ul>

        <p>
          You <b>email</b> is used for login purposes only. Your <b>name</b> is
          used to display to other users on who you are. You can edit these
          values in <b>Accounts</b> section of the <b>Settings page</b>.
        </p>

        <p>
          To protect yourself, you can update your <b>name</b> or <b>email</b>{" "}
          to be "fake" as they serve no other purposes except for the purposes
          mentioned above.
        </p>

        <h2>Storage</h2>
        <p>
          Images uploaded by the user are stored on Firebase for the duration of
          the user account's lifetime (or application lifetime, in which all
          data will be deleted.)
        </p>
        <p>All other data are stored on MongoDB.</p>

        <h2>Data Deletion</h2>
        <p>
          Users are free to delete their account and all data you uploaded since
          the date of account creation in the <b>Privacy</b> section of the{" "}
          <b>Settings page</b>.
        </p>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;
