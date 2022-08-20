import styles from "./comment.module.css";

export default function Comment(props) {
  return <div className={styles.commentContainer}>{props.comment}</div>;
}
