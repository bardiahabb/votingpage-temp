import styles from "./dropzone.module.css";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

export default function Dropzone(props) {
  const [dropedImages, setDropedImages] = useState([]);
  const [firebaseImage, setFirebaseImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const votingPage = props.pagemode == "voting";

  const onDrop = useCallback((acceptedFiles) => {
    props.setdropimage(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
    setDropedImages(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({ onDrop });

  const showPreveiw = props.previewImage?.map((file) => (
    <div key={file.preview} className={styles.previewImageContainer}>
      <div className={styles.previewNoteContainer}>
        <div className={styles.previewModeDot}></div>
        <div className={styles.noteText}>preview</div>
      </div>
      <img
        src={file.preview}
        style={{ maxWidth: "100%", height: "auto" }}
        alt=""
      />
    </div>
  ));

  const imageLoadHandle = () => {
    setImageLoaded(true);
  };

  const voteHandle = () => {
    if (props.voted) {
      props.unvote();
      props.votedState(false);
      props.setUserVoted(false);
    } else if (!props.userVoted) {
      props.vote();
      props.votedState(true);
      props.setUserVoted(true);
    }
  };

  const showOnVoteImage = (
    <div className={styles.realImageContainer}>
      {!votingPage ? (
        <div
          className={
            imageLoaded
              ? styles.realNoteContainer
              : styles.realNoteContainerHidden
          }
        >
          <div className={styles.votingModeDot}></div>
          <div className={styles.noteText}>voting</div>
        </div>
      ) : (
        ""
      )}
      <img
        onLoad={imageLoadHandle}
        src={props.firebaseImage}
        className={imageLoaded ? styles.imageLoaded : styles.imagenotLoaded}
        alt=""
      />
      {votingPage ? (
        <div
          onClick={voteHandle}
          style={
            imageLoaded ? { visibility: "visible" } : { visibility: "hidden" }
          }
          className={styles.thumbIconContainer}
        >
          <svg
            className={
              props.voted ? styles.thumbIconVoted : styles.thumbIconNotVoted
            }
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
        </div>
      ) : (
        ""
      )}
    </div>
  );

  const voteNumber = (
    <div className={styles.voteNumber}>{props.voteNumber} votes</div>
  );

  return (
    <div>
      <div className={styles.dropzoneContainer}>
        {!votingPage ? (
          <div
            {...getRootProps({
              className: isDragActive ? styles.dropzoneActive : styles.dropzone,
            })}
          >
            <input {...getInputProps()} />
            <div className={styles.dropzoneText}>
              {props.firebaseImage ? (
                // <img style={{ width: "100%" }} src={props.firebaseImage} alt="" />
                showOnVoteImage
              ) : props.previewImage ? (
                showPreveiw
              ) : (
                <div>
                  <img
                    style={{ width: "100px" }}
                    src="/image-upload-icon.svg"
                    alt=""
                  />
                  <div>Upload Designe {props.designNumber}</div>
                  <div>Max Size: 5Mb</div>
                  <div>Best Aspect: 3:2</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.dropzoneActive}>
            <div className={styles.dropzoneText}>{showOnVoteImage}</div>
          </div>
        )}
        {props.firebaseImage ? voteNumber : ""}
      </div>
    </div>
  );
}
