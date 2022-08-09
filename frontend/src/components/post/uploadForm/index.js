import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiSend } from "react-icons/bi";
import { IoMdPhotos } from "react-icons/io";
import toast from "react-hot-toast";

import useAuthContext from "../../../hooks/useAuthContext";

import styles from "./index.module.css";
import Card from "../../ui/card";
import ProfilePic from "../../ui/profilePic";
import Input from "../../formElements/input";
import Button from "../../formElements/button";

const UploadForm = ({ addToFeed }) => {
  const { user, authedFetch } = useAuthContext();

  const [postContent, setPostContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState(undefined);

  const handleNewPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", postContent);
    formData.append("postImg", uploadedFile);

    try {
      const res = await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (res.ok) {
        addToFeed(data.post);
        removeImg();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("Something unexpected occurred.");
    }
  };

  const removeImg = () => {
    setPostContent("");
    setUploadedFile(null);
  };

  return (
    <Card>
      <form
        autoComplete="off"
        onSubmit={handleNewPost}
        className={styles.postForm}
      >
        <ProfileInputComp
          user={user}
          placeholder={`What's on your mind, ${user.firstName}?`}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />

        <div className={styles.fileUploadCont}>
          <label
            htmlFor="post-file-upload"
            className={`${styles.imgInputLabel} ${
              uploadedFile && styles.hidden
            }`}
          >
            <IoMdPhotos /> Upload Image
          </label>
          <input
            id="post-file-upload"
            type="file"
            name="postImg"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files.length === 0) return;
              setUploadedFile(e.target.files[0]);
            }}
            className={styles.imgInput}
          />

          {uploadedFile && (
            <div className={styles.selectedFile}>
              <span className="ellipse">{uploadedFile.name}</span>

              <AiOutlineClose onClick={removeImg} />
            </div>
          )}
        </div>
      </form>
    </Card>
  );
};

export default UploadForm;

export const ProfileInputComp = ({ user, placeholder, value, onChange }) => {
  return (
    <div className={styles.formRow1}>
      <ProfilePic src={user.profilePicUrl} alt="profile pic" rounded />

      <div className={styles.formContent}>
        <Input
          type="text"
          name="content"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
        <Button type="submit">
          <BiSend />
        </Button>
      </div>
    </div>
  );
};
