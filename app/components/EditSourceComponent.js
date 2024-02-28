import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import neo4j from 'neo4j-driver';

const EditSourceComponent = () => {
  const [sources, setSources] = useState([]);
  const [selectedSourceIndex, setSelectedSourceIndex] = useState('');

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const docRef = doc(firestore, 'dropData', 'docid');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const jsonString = docSnap.data().string3;
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
      const selectedSource = sources[selectedSourceIndex];
      // Firestore operations
      const updatedSources = sources.map((source, index) => {
        if (index.toString() === selectedSourceIndex) {
          return { ...source, isActive: !source.isActive };
        }
        return source;
      });

      // Update Firestore
      const docRef = doc(firestore, 'dropData', 'docid');
      const updatedString = JSON.stringify({ qsources: updatedSources });
      await updateDoc(docRef, { string3: updatedString });

      // Update Neo4j
      await updateSourceInNeo4j(selectedSource.qsource, !selectedSource.isActive);

      setSources(updatedSources); // Update local state
      alert('Source active status updated!');
    }
  };

  const updateSourceInNeo4j = async (sourceName, isActive) => {
    const URI = 'neo4j+s://a2952975.databases.neo4j.io';
    const USER = 'neo4j';
    const PASSWORD = 'kL8LezCMVVAP7ZdTpgCbivC3t1HdWD2t3NQ2raMfdb4';
    const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    let session = null;

    try {
      session = driver.session();
      const query = `
        MATCH (s:Source {name: $name})
        SET s.isActive = $isActive
        RETURN s.name, s.isActive
      `;
      const result = await session.run(query, { name: sourceName, isActive: isActive });
      if (result.records.length > 0) {
        console.log(`Source active status updated in Neo4j: ${result.records[0].get('s.name')} is now ${isActive ? 'active' : 'inactive'}.`);
      } else {
        console.log('No source found to update.');
      }
    } catch (error) {
      console.error('Error updating source in Neo4j:', error);
    } finally {
      if (session) {
        await session.close();
      }
      await driver.close();
    }
  };

  return (
    <div>
      <h2 className="bg-blue-200 text-black py-2">Edit Source Active Status</h2>
      <select className="select select-bordered select-sm"
         value={selectedSourceIndex} onChange={handleSourceSelection}>
        <option value="">Select a Source</option>
        {sources.map((source, index) => (
          <option key={index} value={index}>
            {source.qsource} ({source.isActive ? 'Active' : 'Inactive'})
          </option>
        ))}
      </select>
      {selectedSourceIndex !== '' && (
        <div>
          <p>
            Current Status: {sources[selectedSourceIndex].isActive ? 'Active' : 'Inactive'}
          </p>
          <button className="btn" onClick={toggleIsActive}>
            Toggle Active
          </button>
        </div>
      )}
    </div>
  );
};

export default EditSourceComponent;
