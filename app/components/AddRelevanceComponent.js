import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const AddRelevanceComponent = () => {
  const [data, setData] = useState({ qrelevanceDropdown: [] });
  const [newRelevance, setNewRelevance] = useState('');

  useEffect(() => {
    const fetchRelevanceData = async () => {
      try {
        const docRef = doc(firestore, 'dropData', 'docid');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const jsonString = docSnap.data().string4;
          const parsedData = JSON.parse(jsonString);
          setData(parsedData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching relevance data:', error);
      }
    };

    fetchRelevanceData();
  }, []);

  const handleAddRelevance = async () => {
    if (newRelevance.trim()) {
      // First, fetch the current document to ensure all data remains intact
      const docRef = doc(firestore, 'dropData', 'docid');
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const currentData = docSnap.data().string4;
        const parsedData = JSON.parse(currentData);
  
        // Correct the property name to 'qrelavanceDropdown'
        const updatedRelevance = [...(parsedData.qrelavanceDropdown || []), newRelevance];
  
        // Prepare the updated JSON string, including all parts of string1
        const updatedString = JSON.stringify({
          ...parsedData,
          qrelavanceDropdown: updatedRelevance // Correct the property name here
        });
  
        // Update Firestore with the newly updated string1
        try {
          await updateDoc(docRef, { string4: updatedString });
  
          alert("Relevance added!");
          setNewRelevance(''); // Reset the input
          // Update local state to reflect the new addition
          setData({ ...parsedData, qrelavanceDropdown: updatedRelevance }); // Correct the property name here
        } catch (error) {
          console.error('Error adding new relevance:', error);
        }
      } else {
        console.log('No such document!');
      }
    }
  };
  
  

  return (
    <div>
      <h2 className="bg-blue-200 text-black py-2">Add a Relevance</h2>
      <input className="input input-bordered input-sm w-full max-w-xs"
        type="text"
        placeholder="Relevance Type"
        value={newRelevance}
        onChange={(e) => setNewRelevance(e.target.value)}
      />
      <button className="btn" onClick={handleAddRelevance} disabled={!newRelevance.trim()}>Add Relevance</button>
    </div>
  );
};

export default AddRelevanceComponent;
