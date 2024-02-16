import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditSourceComponent = () => {
  const [sources, setSources] = useState([]);
  const [selectedSourceIndex, setSelectedSourceIndex] = useState('');

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const docRef = doc(firestore, 'dropData', 'docid');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const jsonString = docSnap.data().string1;
          const parsedData = JSON.parse(jsonString);
          setSources(parsedData.qsources || []);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching sources:', error);
      }
    };

    fetchSources();
  }, []);

  const handleSourceSelection = (e) => {
    setSelectedSourceIndex(e.target.value);
  };

  const toggleIsActive = async () => {
    if (selectedSourceIndex !== '') {
      // Fetch the current state of the document to ensure all other data remains intact
      const docRef = doc(firestore, 'dropData', 'docid');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentData = docSnap.data().string1;
        const parsedData = JSON.parse(currentData);
  
        // Toggle isActive status
        const updatedSources = parsedData.qsources.map((source, index) => {
          if (index.toString() === selectedSourceIndex) {
            return { ...source, isActive: !source.isActive };
          }
          return source;
        });
  
        // Prepare the updated JSON string including all parts of string1
        const updatedString = JSON.stringify({ 
          ...parsedData, 
          qsources: updatedSources 
        });
  
        // Update Firestore
        try {
          await updateDoc(docRef, { string1: updatedString });
          setSources(updatedSources); // Update local state
          alert('Source active status updated!');
        } catch (error) {
          console.error('Error updating source:', error);
        }
      } else {
        console.log('Document does not exist!');
      }
    }
  };

  return (
    <div>
      <h2>Edit Source Active Status</h2>
      <select value={selectedSourceIndex} onChange={handleSourceSelection}>
        <option value="">Select a Source</option>
        {sources.map((source, index) => (
          <option key={index} value={index}>
            {source.qsource}
          </option>
        ))}
      </select>
      {selectedSourceIndex !== '' && (
        <div>
          <p>
            Current Status: {sources[selectedSourceIndex].isActive ? 'Active' : 'Inactive'}
          </p>
          <button onClick={toggleIsActive}>
            Toggle Active
          </button>
        </div>
      )}
    </div>
  );
};

export default EditSourceComponent;
