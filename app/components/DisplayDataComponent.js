import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const DisplayDataComponent = () => {
  const [dropdownData, setDropdownData] = useState({ subjects: [] });
  const [qtypeDropdown, setQtypeDropdown] = useState({});
  const [qsources, setQsources] = useState([]);
  const [qrelavanceDropdown, setQrelavanceDropdown] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(firestore, 'dropData', 'docid');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Fetch and set dropdownData from string1
        setDropdownData(JSON.parse(docSnap.data().string1).dropdownData);
        // Fetch and set qtypeDropdown from string2
        setQtypeDropdown(JSON.parse(docSnap.data().string2).qtypeDropdown);
        // Fetch and set qsources from string3
        setQsources(JSON.parse(docSnap.data().string3).qsources);
        // Fetch and set qrelavanceDropdown from string4
        setQrelavanceDropdown(JSON.parse(docSnap.data().string4).qrelavanceDropdown);
      } else {
        console.log("No such document!");
      }
    };

    fetchData();
  }, []);

  // Simple CSS for indentation
  const indentStyle = {
    marginLeft: '20px',
    borderLeft: '2px solid #ddd',
    paddingLeft: '20px',
  };

  return (
    <div>
      <h2>Dropdown Data</h2>
      <div style={indentStyle}>
        {dropdownData.subjects.map((subject, index) => (
          <div key={index}>
            <h3>{subject.name}</h3>
            <div style={indentStyle}>
              {subject.chapters.map((chapter, chapterIndex) => (
                <div key={chapterIndex}>
                  <h4>{chapter.name}</h4>
                  <ul style={indentStyle}>
                    {chapter.concepts?.map((concept, conceptIndex) => (
                      <li key={conceptIndex}>{concept.name}: {concept.description}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2>Question Type Dropdown</h2>
      <ul style={indentStyle}>
        {Object.entries(qtypeDropdown).map(([key, value], index) => (
          <li key={index}>{key}: {value}</li>
        ))}
      </ul>

      <h2>Sources</h2>
      <ul style={indentStyle}>
        {qsources.map((source, index) => (
          <li key={index}>{source.qsource}: {source.isActive ? 'Active' : 'Inactive'}</li>
        ))}
      </ul>

      <h2>Relevance Dropdown</h2>
      <ul style={indentStyle}>
        {qrelavanceDropdown.map((relevance, index) => (
          <li key={index}>{relevance}</li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayDataComponent;
