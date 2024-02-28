"use client"
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Adjust the path as needed
import { collection, getDocs } from 'firebase/firestore';

const FirestoreDisplay = ({ collectionName }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(firestore, collectionName));
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocuments(docs);
    };

    fetchData().catch(console.error);
  }, [collectionName]);

  return (
    <div>
      {documents.map((doc) => (
        <div className="card lg:card-side bg-base-100 shadow-xl" key={doc.id}  style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
          <img src={doc.Qimage} alt="Question" style={{ width: '100%', maxWidth: '500px' }} />
          <p>Question: {doc.Qtext}</p>
          <img src={doc.Simage} alt="Solution" style={{ width: '100%', maxWidth: '500px' }} />
          <p>Solution Text:  {doc.Stext}</p>
          <p>Answer:   {doc.Atext}</p>
          <div className="card-body"> 
          <div className="card-title">Sources:
          <ul>
              {doc.Qsources.map((source, index) => (
              <li key={index}>
               {source.Qsource} - Qno : {source.serialNumber}
              </li>
               ))}
            </ul>
            </div>

            <div>Subject: <span className="badge"> {doc.selectedSubject} </span></div>
            <div>Chapter: <span className="badge"> {doc.selectedChapter} </span></div>
            <div>Concept: <span className="badge"> {doc.selectedConcept} </span></div>
            
            <div >Difficulty: <span className="badge">{doc.Qdifficulty} </span> </div>
            <div >Relevance: <span className="badge">{doc.Qrelavance.join(', ')} </span></div>
            <div > Type: <span className="badge">{doc.Qtype} </span> </div>
            <div >Magnitude: <span className="badge">{doc.Qmagnitude} </span> </div>
            <div>Uploaded by:  {doc.username} </div>
            <div>Email:  {doc.email}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FirestoreDisplay;
