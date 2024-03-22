

import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import neo4j from 'neo4j-driver';

const AddConceptComponent = () => {
  const [data, setData] = useState({ dropdownData: null });
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [newConcept, setNewConcept] = useState({ name: '', description: '' });

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
    setSelectedChapter('');
  };

  const handleChapterChange = (e) => {
    setSelectedChapter(e.target.value);
  };

  const handleConceptChange = (e) => {
    setNewConcept({ ...newConcept, [e.target.name]: e.target.value });
  };

  const handleAddConcept = async () => {
    if (selectedSubject && selectedChapter && newConcept.name && newConcept.description) {
      try {
        const updatedSubjects = data.dropdownData.subjects.map((subject) => {
          if (subject.name === selectedSubject) {
            return {
              ...subject,
              chapters: subject.chapters.map((chapter) => {
                if (chapter.name === selectedChapter) {
                  return {
                    ...chapter,
                    concepts: [...chapter.concepts, newConcept]
                  };
                }
                return chapter;
              })
            };
          }
          return subject;
        });
  
        const updatedString = JSON.stringify({ dropdownData: { ...data.dropdownData, subjects: updatedSubjects }, qtypeDropdown: data.qtypeDropdown });
  
        // Update Firestore
        const docRef = doc(firestore, 'dropData', 'docid');
        await updateDoc(docRef, { string1: updatedString });
  
        // Add the concept to Neo4j
        await addConceptToNeo4j(selectedSubject, selectedChapter, newConcept);
  
        alert("Concept added!");
      } catch (error) {
        console.error("Error adding concept:", error);
        alert("Failed to add concept!");
      } finally {
        setNewConcept({ name: '', description: '' }); // Reset the form fields
        // Refresh the page to reflect changes
        window.location.reload();
      }
    }
  };
  

  const addConceptToNeo4j = async (subjectName, chapterName, concept) => {
    const URI = 'neo4j+s://a2952975.databases.neo4j.io';
    const USER = 'neo4j';
    const PASSWORD = 'kL8LezCMVVAP7ZdTpgCbivC3t1HdWD2t3NQ2raMfdb4';
    let driver;

    try {
      driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
      const session = driver.session();

      const query = `
        MATCH (s:Subject {name: $subjectName})-[:HAS_CHAPTER]->(c:Chapter {name: $chapterName})
        CREATE (n:Concept {name: $conceptName, description: $conceptDescription})
        CREATE (c)-[:HAS_CONCEPT]->(n)
      `;

      await session.run(query, { 
        subjectName, 
        chapterName, 
        conceptName: concept.name, 
        conceptDescription: concept.description 
      });
      console.log("Concept added to Neo4j successfully.");
    } catch (error) {
      console.error("Failed to add concept to Neo4j:", error);
    } finally {
      await driver.close();
    }
  };

  return (
    <div>
      <h2 className="bg-blue-200 text-black py-2">Add a Concept to a Chapter</h2>
      <select className="select select-bordered select-sm w-full max-w-xs"
       value={selectedSubject} onChange={handleSubjectChange}>
      <option value="">Select a Subject</option>
      {data.dropdownData?.subjects.map((subject) => (
        <option key={subject.name} value={subject.name}>{subject.name}</option>
      ))}
    </select>

    <select className="select select-bordered select-sm w-full max-w-xs" 
      value={selectedChapter} onChange={handleChapterChange} disabled={!selectedSubject}>
      <option value="">Select a Chapter</option>
      {selectedSubject && data.dropdownData?.subjects.find(subj => subj.name === selectedSubject)?.chapters.map((chapter) => (
        <option key={chapter.name} value={chapter.name}>{chapter.name}</option>
      ))}
    </select>

    <input className="input input-bordered input-sm w-full max-w-xs"
      name="name"
      type="text"
      placeholder="Concept Name"
      value={newConcept.name}
      onChange={handleConceptChange}
    />
    <div>
    <textarea className="textarea textarea-bordered h-24"
      name="description"
      placeholder="Concept Description"
      value={newConcept.description}
      onChange={handleConceptChange}
    />
    </div>
    <button className="btn" onClick={handleAddConcept} disabled={!selectedSubject || !selectedChapter || !newConcept.name || !newConcept.description}>Add Concept</button>
  
    </div>
  );
};

export default AddConceptComponent;
