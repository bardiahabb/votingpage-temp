import Head from "next/head";
import { useState } from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Dropzone from "../components/Dropzone";
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

export default function Home() {
  const [firebaseImage1, setFirebaseImage1] = useState(null);
  const [dropedImages1, setDropedImages1] = useState(null);
  const [firebaseImage2, setFirebaseImage2] = useState(null);
  const [dropedImages2, setDropedImages2] = useState(null);
  const [previewMode1, setPreviewMode1] = useState(true);
  const [previewMode2, setPreviewMode2] = useState(true);
  const [design1NoteNumbers, setDesign1NoteNumbers] = useState(0);
  const [design2NoteNumbers, setDesign2NoteNumbers] = useState(0);

  const uploadImages = async () => {
    const docRef = await addDoc(collection(db, "images"), {
      timestamp: serverTimestamp(),
      name: "owner1",
      design1Votes: 2,
      design2Votes: 3,
    });

    const docSnap = await getDoc(docRef);
    setDesign1NoteNumbers(docSnap.data().design1Votes);
    setDesign2NoteNumbers(docSnap.data().design2Votes);
    await Promise.all(
      dropedImages1.map((image) => {
        const ImageRef = ref(storage, `images/${docRef.id}/${image.path}`);
        uploadBytes(ImageRef, image, "data_url").then(async () => {
          const downloadUrl = await getDownloadURL(ImageRef);
          setFirebaseImage1(downloadUrl);
          setPreviewMode1(false);
          await updateDoc(doc(db, "images", docRef.id), {
            image1DownloadUrl: arrayUnion(downloadUrl),
          });
        });
      })
    );
    await Promise.all(
      dropedImages2.map((image) => {
        const ImageRef = ref(storage, `images/${docRef.id}/${image.path}`);
        uploadBytes(ImageRef, image, "data_url").then(async () => {
          const downloadUrl = await getDownloadURL(ImageRef);
          setFirebaseImage2(downloadUrl);
          setPreviewMode2(false);
          await updateDoc(doc(db, "images", docRef.id), {
            image2DownloadUrl: arrayUnion(downloadUrl),
          });
        });
      })
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Dropzone
        designNumber={1}
        votingPageID={"MIL38oANnW4hia6SB3eu"}
        setdropimage={setDropedImages1}
        previewImage={dropedImages1}
        preview={previewMode1}
        firebaseImage={firebaseImage1}
        voteNumber={design1NoteNumbers}
      />
      <Dropzone
        designNumber={2}
        votingPageID={"MIL38oANnW4hia6SB3eu"}
        setdropimage={setDropedImages2}
        previewImage={dropedImages2}
        preview={previewMode2}
        firebaseImage={firebaseImage2}
        voteNumber={design2NoteNumbers}
      />
      <button onClick={uploadImages}>click to upload</button>
    </div>
  );
}
