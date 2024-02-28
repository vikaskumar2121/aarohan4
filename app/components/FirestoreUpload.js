import React, { useState } from 'react';
import { firestore } from '../firebase'; // Adjust the path as needed
import { collection, addDoc } from 'firebase/firestore';
import neo4j from 'neo4j-driver';

const FirestoreUpload = ({ dataToUpload, collectionName, onUploadComplete }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const URI = 'neo4j+s://a2952975.databases.neo4j.io';
  const USER = 'neo4j';
  const PASSWORD = 'kL8LezCMVVAP7ZdTpgCbivC3t1HdWD2t3NQ2raMfdb4';

  const isFormDataEmpty = () => {
    const formFields = ['Qsource', 'Qtext', 'Simage', 'Stext', 'Atext', 'Qdifficulty', 'Qrelavance', 'Qtype', 'Qmagnitude'];
    return formFields.every(field => !dataToUpload[field]);
  };

  const uploadDataToNeo4j = async (docRefId) => {
    const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    let session;
  
    try {
      session = driver.session();
      const result = await session.run(`
        MATCH (source:Source {name: $Qsource})
        MATCH (concept:Concept {name: $selectedConcept})
        CREATE (question:Question {
          id: $id,
          Qimage: $Qimage,
          Qtext: $Qtext,
          Simage: $Simage,
          Stext: $Stext,
          Atext: $Atext,
          Qdifficulty: $Qdifficulty,
          Qrelavance: $Qrelavance,
          Qtype: $Qtype,
          Qmagnitude: $Qmagnitude
        })
        MERGE (question)-[:HAS_SOURCE]->(source)
        MERGE (concept)-[:INCLUDES]->(question)
        RETURN question
      `, {
        id: docRefId,
        ...dataToUpload
      });
  
      if (result.records.length > 0) {
        console.log(`Question node created with ID: ${result.records[0].get('question').properties.id}`);
      } else {
        console.log('No question node was created.');
      }
    } catch (error) {
      console.error('Error adding question node to Neo4j:', error);
    } finally {
      if (session) await session.close();
      await driver.close();
    }
  };
  

  const uploadData = async () => {
    if (isFormDataEmpty()) {
      console.error('No data provided to upload');
      return;
    }
  
    setIsButtonDisabled(true);
  
    const transformedData = {
      ...dataToUpload,
      Qsources: [{ Qsource: dataToUpload.Qsource, serialNumber: dataToUpload.serialNumber }],
    };

    delete transformedData.Qsource;
    delete transformedData.serialNumber;
  
    try {
      const docRef = await addDoc(collection(firestore, collectionName), transformedData);
      console.log('Document written with ID: ', docRef.id);

      // Upload data to Neo4j after Firestore success
      await uploadDataToNeo4j(docRef.id);
    } catch (e) {
      console.error('Error adding document to Firestore and Neo4j:', e);
    } finally {
      onUploadComplete({
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
        serialNumber: '0',
      });
      setTimeout(() => setIsButtonDisabled(false), 10000);
    }
  };

  return (
    <div>
      <button className="btn" onClick={uploadData} disabled={isButtonDisabled || isFormDataEmpty()}>Upload Data to Firestore</button>
    </div>
  );
};

export default FirestoreUpload;
