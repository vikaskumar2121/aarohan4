
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import neo4j from 'neo4j-driver';

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
      const updatedString = JSON.stringify({ ...data, qsources: updatedSources });

      // Update Firestore
      const docRef = doc(firestore, 'dropData', 'docid');
      await updateDoc(docRef, { string3: updatedString });

      // Add the source to Neo4j
      await addSourceToNeo4j(newSource.qsource, newSource.isActive);

      alert("Source added!");
      setNewSource({ qsource: '', isActive: true }); // Reset the form
    }
  };

  const addSourceToNeo4j = async (sourceName, isActive) => {
    const URI = 'neo4j+s://a2952975.databases.neo4j.io';
    const USER = 'neo4j';
    const PASSWORD = 'kL8LezCMVVAP7ZdTpgCbivC3t1HdWD2t3NQ2raMfdb4';
    const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    let session = null; // Define session here
  
    try {
      session = driver.session(); // Assign the session here
      const result = await session.run(
        'CREATE (s:Source {name: $name, isActive: $isActive}) RETURN s',
        { name: sourceName, isActive: isActive }
      );
  
      console.log(`Source added: ${result.records[0].get('s').properties.name}`);
    } catch (error) {
      console.error('Error adding source to Neo4j:', error);
    } finally {
      if (session) {
        await session.close(); // Now session is defined in this scope
      }
      await driver.close();
    }
  };
  

  return (
    <div>
      <h2 className="bg-blue-200 text-black py-2">Add a Source</h2>
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
      <button className="btn" onClick={handleAddSource} disabled={!newSource.qsource.trim()}>Add Source</button>
    </div>
  );
};

export default AddSourceComponent;
