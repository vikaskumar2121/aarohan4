import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import neo4j from 'neo4j-driver';

const DeleteSourceComponent = () => {
  const [sources, setSources] = useState([]);
  const [selectedSourceIndex, setSelectedSourceIndex] = useState('');

  useEffect(() => {
    const fetchSources = async () => {
      const docRef = doc(firestore, 'dropData', 'docid');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const parsedData = JSON.parse(docSnap.data().string3);
        setSources(parsedData.qsources || []);
      } else {
        console.log('No such document!');
      }
    };

    fetchSources();
  }, []);

  const handleSourceSelection = (e) => {
    setSelectedSourceIndex(e.target.value);
  };

  const deleteSourceFromFirestore = async () => {
    const updatedSources = sources.filter((_, index) => index.toString() !== selectedSourceIndex);
    const updatedString = JSON.stringify({ qsources: updatedSources });
    const docRef = doc(firestore, 'dropData', 'docid');
    await updateDoc(docRef, { string3: updatedString });
  };

  const deleteSourceFromNeo4j = async (sourceName) => {
    const URI = 'neo4j+s://a2952975.databases.neo4j.io';
    const USER = 'neo4j';
    const PASSWORD = 'kL8LezCMVVAP7ZdTpgCbivC3t1HdWD2t3NQ2raMfdb4';
    const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const session = driver.session();

    try {
      const query = `
        MATCH (s:Source {name: $name})
        DETACH DELETE s
      `;
      await session.run(query, { name: sourceName });
      console.log('Source deleted from Neo4j successfully.');
    } catch (error) {
      console.error('Error deleting source in Neo4j:', error);
    } finally {
      await session.close();
      await driver.close();
    }
  };

  const handleDeleteSource = async () => {
    if (selectedSourceIndex !== '') {
      const selectedSource = sources[selectedSourceIndex].qsource;

      try {
        await deleteSourceFromFirestore();
        await deleteSourceFromNeo4j(selectedSource);
        alert('Source deleted successfully!');
      } catch (error) {
        console.error('Error deleting source:', error);
        alert('Failed to delete source.');
      } finally {
        window.location.reload();
      }
    }
  };

  return (
    <div>
      <h2 className="bg-blue-200 text-black py-2">Delete Source</h2>
      <select className="select select-bordered select-sm"
        value={selectedSourceIndex} onChange={handleSourceSelection}>
        <option value="">Select a Source</option>
        {sources.map((source, index) => (
          <option key={index} value={index}>
            {source.qsource}
          </option>
        ))}
      </select>
      <button className="btn" onClick={handleDeleteSource}>
        Delete Source
      </button>
    </div>
  );
};

export default DeleteSourceComponent;
