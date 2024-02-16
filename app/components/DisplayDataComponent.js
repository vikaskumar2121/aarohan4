import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const DisplayDataComponent = () => {
  const [data, setData] = useState({
    dropdownData: { subjects: [] },
    qtypeDropdown: {},
    qsources: [],
    qrelavanceDropdown: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(firestore, 'dropData', 'docid');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const string1 = docSnap.data().string1;
        const parsedData = JSON.parse(string1);
        setData(parsedData);
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
        {data.dropdownData.subjects.map((subject, index) => (
          <div key={index}>
            <h3>{subject.name}</h3>
            <div style={indentStyle}>
              {subject.chapters.map((chapter, chapterIndex) => (
                <div key={chapterIndex}>
                  <h4>{chapter.name}</h4>
                  <ul style={indentStyle}>
                    {chapter.concepts.map((concept, conceptIndex) => (
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
        {Object.entries(data.qtypeDropdown).map(([key, value], index) => (
          <li key={index}>{key}: {value}</li>
        ))}
      </ul>

      <h2>Sources</h2>
      <ul style={indentStyle}>
        {data.qsources.map((source, index) => (
          <li key={index}>{source.qsource}: {source.isActive ? 'Active' : 'Inactive'}</li>
        ))}
      </ul>

      <h2>Relevance Dropdown</h2>
      <ul style={indentStyle}>
        {data.qrelavanceDropdown.map((relevance, index) => (
          <li key={index}>{relevance}</li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayDataComponent;
