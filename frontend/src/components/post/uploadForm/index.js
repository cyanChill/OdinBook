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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewPost = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

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
        setPostContent("");
        removeImg();
      } else {
        if (data.errors) data.errors.map((err) => toast.error(err.msg));
        else toast.error(data.message);
      }
    } catch (err) {
      console.log("Something unexpected occurred.");
    }
    setIsSubmitting(false);
  };

  const removeImg = () => setUploadedFile(null);

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
          disable={isSubmitting}
        />

        <div className={styles.fileUploadCont}>
          <label
            htmlFor="post-file-upload"
            className={`${styles.imgInputLabel} ${
              uploadedFile && styles.hidden
            }`}
            tabIndex="0"
            data-disabled={isSubmitting}
          >
            <IoMdPhotos /> Upload Image
          </label>
          <input
            id="post-file-upload"
            type="file"
            name="postImg"
            accept="image/*"
            onClick={(e) => (e.target.value = null)}
            onChange={(e) => {
              if (e.target.files.length === 0) return;
              setUploadedFile(e.target.files[0]);
            }}
            className={styles.imgInput}
            data-disabled={isSubmitting}
          />

          {uploadedFile && (
            <div className={styles.selectedFile}>
              <span className="ellipse">{uploadedFile.name}</span>

              <AiOutlineClose
                onClick={removeImg}
                data-disabled={isSubmitting}
              />
            </div>
          )}
        </div>
      </form>
    </Card>
  );
};

export default UploadForm;

export const ProfileInputComp = ({
  user,
  placeholder,
  value,
  onChange,
  disable = false,
}) => {
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
          data-disabled={disable}
          autoComplete="off"
          required
        />
        <Button type="submit" data-disabled={disable}>
          <BiSend />
        </Button>
      </div>
    </div>
  );
};
