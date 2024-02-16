import React, { useState } from 'react';
import { firestore } from '../firebase'; // Adjust the path as needed
import { collection, addDoc } from 'firebase/firestore';



const FirestoreUpload = ({ dataToUpload, collectionName , onUploadComplete }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const isFormDataEmpty = () => {
    // Check specific form fields in dataToUpload for emptiness
    const formFields = ['Qsource', 'Qtext', 'Simage', 'Stext', 'Atext', 'Qdifficulty', 'Qrelavance', 'Qtype', 'Qmagnitude']; // add other form fields as necessary
    return formFields.every(field => !dataToUpload[field]);
  };

  const uploadData = async () => {
    if (isFormDataEmpty()) {
      console.error('No data provided to upload');
      return;
    }
  
    setIsButtonDisabled(true);
  
    // Transform Qsource and serialNumber into an array of objects
    const transformedData = {
      ...dataToUpload,
      Qsources: [{ Qsource: dataToUpload.Qsource, serialNumber: dataToUpload.serialNumber }],
    };
  
    // Remove Qsource and serialNumber from the object as they're now included in Qsources
    delete transformedData.Qsource;
    delete transformedData.serialNumber;
  
    try {
      const docRef = await addDoc(collection(firestore, collectionName), transformedData);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    } finally {
      onUploadComplete({
        // Resetting the form fields including Qsources as an empty array
        Qsources: [],
        Qimage: '',
        Qtext: '',
        Simage: '',
        Stext: '',
        Atext: '',
        Qdifficulty: '',
        Qrelavance: [],
        Qtype: '',
        Qmagnitude: '',
        serialNumber: '0', // Assuming you want to reset serialNumber here as well
      });
      setTimeout(() => {
        setIsButtonDisabled(false); // Enable button after 10 seconds
      }, 10000);
    }
  };
  

  return (
    <div>
      <button onClick={uploadData} disabled={isButtonDisabled || isFormDataEmpty()}>Upload Data to Firestore</button>
    </div>
  );
};


  export default FirestoreUpload;