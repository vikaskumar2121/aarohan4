

import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import neo4j from 'neo4j-driver';

const DeleteConceptComponent = () => {
  const [data, setData] = useState({ dropdownData: null });
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('');

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
    setSelectedConcept('');
  };

  const handleChapterChange = (e) => {
    setSelectedChapter(e.target.value);
    setSelectedConcept('');
  };

  const handleConceptChange = (e) => {
    setSelectedConcept(e.target.value);
  };

  const handleDeleteConcept = async () => {
    if (selectedSubject && selectedChapter && selectedConcept) {
      // Firestore operations
      const updatedSubjects = data.dropdownData.subjects.map((subject) => {
        if (subject.name === selectedSubject) {
          return {
            ...subject,
            chapters: subject.chapters.map((chapter) => {
              if (chapter.name === selectedChapter) {
                return {
                  ...chapter,
                  concepts: chapter.concepts.filter((concept) => concept.name !== selectedConcept)
                };
              }
              return chapter;
            })
          };
        }
        return subject;
      });

      const updatedString = JSON.stringify({ dropdownData: { ...data.dropdownData, subjects: updatedSubjects }, qtypeDropdown: data.qtypeDropdown });
      const docRef = doc(firestore, 'dropData', 'docid');
      await updateDoc(docRef, { string1: updatedString });

      // Neo4j operation
      await deleteConceptFromNeo4j(selectedSubject, selectedChapter, selectedConcept);

      alert("Concept deleted!");
      setSelectedConcept('');
      window.location.reload();
    }
  };

  const deleteConceptFromNeo4j = async (subjectName, chapterName, conceptName) => {
    const URI = 'neo4j+s://a2952975.databases.neo4j.io';
    const USER = 'neo4j';
    const PASSWORD = 'kL8LezCMVVAP7ZdTpgCbivC3t1HdWD2t3NQ2raMfdb4';
    let driver;

    try {
      driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
      const session = driver.session();

      const query = `
        MATCH (s:Subject {name: $subjectName})-[:HAS_CHAPTER]->(c:Chapter {name: $chapterName})-[:HAS_CONCEPT]->(concept:Concept {name: $conceptName})
        DETACH DELETE concept
      `;

      await session.run(query, { subjectName, chapterName, conceptName });
      console.log("Concept deleted from Neo4j successfully.");
    } catch (error) {
      console.error("Failed to delete concept from Neo4j:", error);
    } finally {
      await driver.close();
    }
  };

  return (
    <div>
    <h2 className="bg-blue-200 text-black py-2">Delete a Concept from a Chapter</h2>
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

    <select className="select select-bordered select-sm w-full max-w-xs"
     value={selectedConcept} onChange={handleConceptChange} disabled={!selectedChapter}>
      <option value="">Select a Concept</option>
      {selectedChapter && data.dropdownData?.subjects.find(subj => subj.name === selectedSubject)?.chapters.find(chap => chap.name === selectedChapter)?.concepts.map((concept) => (
        <option key={concept.name} value={concept.name}>{concept.name}</option>
      ))}
    </select>

    <button className="btn" onClick={handleDeleteConcept} disabled={!selectedSubject || !selectedChapter || !selectedConcept}>Delete Concept</button>
  </div>
  );
};

export default DeleteConceptComponent;
