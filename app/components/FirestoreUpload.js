import React from 'react';
import { firestore } from '../firebase'; // Adjust the path as needed
import { collection, addDoc } from 'firebase/firestore';

const FirestoreUpload = ({ dataToUpload, collectionName }) => {
  const uploadData = async () => {
    if (!dataToUpload) {
      console.error('No data provided to upload');
      return;
    }

    try {
      const docRef = await addDoc(collection(firestore, collectionName), dataToUpload);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div>
      <button onClick={uploadData}>Upload Data to Firestore</button>
    </div>
  );
};

export default FirestoreUpload;
