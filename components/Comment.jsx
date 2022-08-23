import styles from "./comment.module.css";

export default function Comment(props) {
  return (
    <div key={props.key} className={styles.commentContainer}>
      {props.comment}
    </div>
  );
}
