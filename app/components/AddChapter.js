import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Adjust this path as needed
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import neo4j from 'neo4j-driver';

const AddChapterComponent = () => {
  const [data, setData] = useState({ dropdownData: null });
  const [selectedSubject, setSelectedSubject] = useState('');
  const [newChapterName, setNewChapterName] = useState('');

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const docRef = doc(firestore, 'dropData', 'docid');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const jsonString = docSnap.data().string1;
          const parsedData = JSON.parse(jsonString);
          setData(parsedData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching and parsing dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleNewChapterNameChange = (e) => {
    setNewChapterName(e.target.value);
  };

  const handleAddChapter = async () => {
    if (selectedSubject && newChapterName) {
        const updatedSubjects = data.dropdownData.subjects.map((subject) => {
            if (subject.name === selectedSubject) {
                return { 
                    ...subject, 
                    chapters: [...subject.chapters, { name: newChapterName, concepts: [] }]
                };
            }
            return subject;
        });

        const updatedDropdownData = { ...data.dropdownData, subjects: updatedSubjects };
        const updatedString = JSON.stringify({ dropdownData: updatedDropdownData, qtypeDropdown: data.qtypeDropdown });

        try {
            // Update Firestore
            const docRef = doc(firestore, 'dropData', 'docid');
            await updateDoc(docRef, { string1: updatedString });

            // Now, add the chapter to Neo4j
            await addChapterToNeo4j(selectedSubject, newChapterName);

            alert("Chapter added!");

            // Refresh the page after operations are completed
            window.location.reload();
        } catch (error) {
            console.error("Operation failed:", error);
            alert("Failed to add chapter. Please try again.");
        } finally {
            setNewChapterName('');
        }
    }
};


  const addChapterToNeo4j = async (subjectName, chapterName) => {
    const URI = 'neo4j+s://a2952975.databases.neo4j.io';
    const USER = 'neo4j';
    const PASSWORD = 'kL8LezCMVVAP7ZdTpgCbivC3t1HdWD2t3NQ2raMfdb4';
    let driver;

    try {
      driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
      const session = driver.session();

      // Cypher query to add a chapter node and create a relationship with its subject
      const query = `
        MATCH (s:Subject {name: $subjectName})
        CREATE (c:Chapter {name: $chapterName})
        CREATE (s)-[:HAS_CHAPTER]->(c)
      `;

      await session.run(query, { subjectName, chapterName });
      console.log("Chapter added to Neo4j successfully.");

    } catch (error) {
      console.error("Failed to add chapter to Neo4j:", error);
    } finally {
      await driver.close();
    }
  };

  return (
    <div>
      <h2 className="bg-blue-200 text-black py-2">Add a Chapter to a Subject</h2>
      <select className="select select-bordered select-sm" value={selectedSubject} onChange={handleSubjectChange}>
        <option value="">Select a Subject</option>
        {data.dropdownData?.subjects.map((subject) => (
          <option key={subject.name} value={subject.name}>{subject.name}</option>
        ))}
      </select>
      <input className="input input-bordered input-sm w-full max-w-xs"
        type="text" 
        placeholder="New Chapter Name" 
        value={newChapterName} 
        onChange={handleNewChapterNameChange}
      />
      <button className="btn" onClick={handleAddChapter} disabled={!selectedSubject || !newChapterName.trim()}>Add Chapter</button>
    </div>
  );
};

export default AddChapterComponent;
