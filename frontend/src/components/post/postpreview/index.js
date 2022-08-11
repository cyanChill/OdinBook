import PostBase from "../base";

const PostPreview = ({ post, onPostDelete }) => {
  return <PostBase post={post} isPreview onDelete={onPostDelete} />;
};

export default PostPreview;
