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

  const downloadImages = async () => {
    const imageURLRef = doc(db, "images", props.votingPageID);
    const docSnap = await getDoc(imageURLRef);
    setFirebaseImage(docSnap.data().imageDownloadUrl);
  };

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
        <div>preview</div>
      </div>
      <img src={file.preview} style={{ width: "100%" }} alt="" />
    </div>
  ));

  return (
    <div>
      <div className={styles.dropzoneContainer}>
        <div
          {...getRootProps({
            className: isDragActive ? styles.dropzoneActive : styles.dropzone,
          })}
        >
          <input {...getInputProps()} />
          <div className={styles.dropzoneText}>
            {props.firebaseImage ? (
              <img style={{ width: "100%" }} src={props.firebaseImage} alt="" />
            ) : props.previewImage ? (
              showPreveiw
            ) : (
              <div>
                <img
                  style={{ width: "100px" }}
                  src="/image-upload-icon.svg"
                  alt=""
                />
                <div>Upload Designe 1</div>
                <div>Max Size: 5Mb</div>
                <div>Best Aspect: 2:3</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
