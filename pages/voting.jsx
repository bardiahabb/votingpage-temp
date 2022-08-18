import Head from "next/head";
import { useState, useEffect } from "react";
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
  const [design1VoteNumbers, setDesign1VoteNumbers] = useState(0);
  const [design2VoteNumbers, setDesign2VoteNumbers] = useState(0);
  const [pagemode, setPagemode] = useState("voting");
  const [votingPageID, setVotingPageID] = useState("0t5sNBSyYljl28rSUESi");

  const voteDesign1 = async () => {
    const docRef = doc(db, "images", votingPageID);
    const docSnap = await getDoc(docRef);
    const design1VoteNumbers = docSnap.data().design1Votes;
    await updateDoc(docRef, {
      design1Votes: design1VoteNumbers + 1,
    });
    setDesign1VoteNumbers(design1VoteNumbers + 1)
  };

  const voteDesign2 = async () => {
    const docRef = doc(db, "images", votingPageID);
    const docSnap = await getDoc(docRef);
    const design2VoteNumbers = docSnap.data().design2Votes;
    await updateDoc(docRef, {
      design2Votes: design2VoteNumbers + 1,
    });
    setDesign2VoteNumbers(design2VoteNumbers + 1)
  };

  const unvoteDesign1 = async () => {
    const docRef = doc(db, "images", votingPageID);
    const docSnap = await getDoc(docRef);
    const design1VoteNumbers = docSnap.data().design1Votes;
    await updateDoc(docRef, {
      design1Votes: design1VoteNumbers - 1,
    });
    setDesign1VoteNumbers(design1VoteNumbers - 1)
  };

  const unvoteDesign2 = async () => {
    const docRef = doc(db, "images", votingPageID);
    const docSnap = await getDoc(docRef);
    const design2VoteNumbers = docSnap.data().design2Votes;
    await updateDoc(docRef, {
      design2Votes: design2VoteNumbers - 1,
    });
    setDesign2VoteNumbers(design2VoteNumbers - 1)
  };

  const downloadImages = async () => {
    const imageURLRef = doc(db, "images", votingPageID);
    const docSnap = await getDoc(imageURLRef);
    setFirebaseImage1(docSnap.data().image1DownloadUrl);
    setFirebaseImage2(docSnap.data().image2DownloadUrl);
  };

  const uploadImages = async () => {
    const docRef = await addDoc(collection(db, "images"), {
      timestamp: serverTimestamp(),
      name: "owner1",
      design1Votes: 2,
      design2Votes: 3,
    });

    const docSnap = await getDoc(docRef);
    setDesign1VoteNumbers(docSnap.data().design1Votes);
    setDesign2VoteNumbers(docSnap.data().design2Votes);
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

  useEffect(() => {
    if (pagemode == "voting") {
      downloadImages();
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Dropzone
        vote={voteDesign1}
        unvote={unvoteDesign1}
        designNumber={1}
        votingPageID={"MIL38oANnW4hia6SB3eu"}
        setdropimage={setDropedImages1}
        previewImage={dropedImages1}
        preview={previewMode1}
        firebaseImage={firebaseImage1}
        voteNumber={design1VoteNumbers}
        pagemode={pagemode}
      />
      <Dropzone
        vote={voteDesign2}
        unvote={unvoteDesign2}
        designNumber={2}
        votingPageID={"MIL38oANnW4hia6SB3eu"}
        setdropimage={setDropedImages2}
        previewImage={dropedImages2}
        preview={previewMode2}
        firebaseImage={firebaseImage2}
        voteNumber={design2VoteNumbers}
        pagemode={pagemode}
      />
      {!pagemode == "voting" ? (
        <button onClick={uploadImages}>click to upload</button>
      ) : (
        ""
      )}
    </div>
  );
}