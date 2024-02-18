import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const AddSourceComponent = () => {
  const [data, setData] = useState({ qsources: [] });
  const [newSource, setNewSource] = useState({ qsource: '', isActive: true });

  useEffect(() => {
    const fetchSourcesData = async () => {
      try {
        const docRef = doc(firestore, 'dropData', 'docid');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const jsonString = docSnap.data().string3;
          const parsedData = JSON.parse(jsonString);
          setData(parsedData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching sources data:', error);
      }
    };

    fetchSourcesData();
  }, []);

  const handleSourceChange = (e) => {
    setNewSource({ ...newSource, qsource: e.target.value });
  };

  const handleIsActiveChange = (e) => {
    setNewSource({ ...newSource, isActive: e.target.checked });
  };

  const handleAddSource = async () => {
    if (newSource.qsource.trim()) {
      const updatedSources = [...data.qsources, newSource];

      // Prepare the updated JSON string
      const updatedString = JSON.stringify({ ...data, qsources: updatedSources });

      // Update Firestore
      const docRef = doc(firestore, 'dropData', 'docid');
      await updateDoc(docRef, { string3: updatedString });

      alert("Source added!");
      setNewSource({ qsource: '', isActive: true }); // Reset the form
    }
  };

  return (
    <div>
      <h2 class="bg-blue-200 text-black py-2">Add a Source</h2>
      <input className="input input-bordered input-sm w-full max-w-xs"
        type="text"
        placeholder="Source Name"
        value={newSource.qsource}
        onChange={handleSourceChange}
      />
      <label>
        <input className="checkbox"
          style={{ flex: 2, marginLeft: '10px' }}
          type="checkbox"
          checked={newSource.isActive}
          onChange={handleIsActiveChange}
        />
        Is Active?
      </label>
      <button class="btn" onClick={handleAddSource} disabled={!newSource.qsource.trim()}>Add Source</button>
    </div>
  );
};

export default AddSourceComponent;
