import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import neo4j from 'neo4j-driver';

const DeleteChapterComponent = () => {
  const [data, setData] = useState({ dropdownData: null });
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

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

  const handleDeleteChapter = async () => {
    if (selectedSubject && selectedChapter) {
      try {
        const updatedSubjects = data.dropdownData.subjects.map((subject) => {
          if (subject.name === selectedSubject) {
            return {
              ...subject,
              chapters: subject.chapters.filter((chapter) => chapter.name !== selectedChapter)
            };
          }
          return subject;
        });
  
        const updatedString = JSON.stringify({ dropdownData: { ...data.dropdownData, subjects: updatedSubjects }, qtypeDropdown: data.qtypeDropdown });
  
        // Update Firestore
        const docRef = doc(firestore, 'dropData', 'docid');
        await updateDoc(docRef, { string1: updatedString });
  
        // Delete the chapter from Neo4j
        await deleteChapterFromNeo4j(selectedSubject, selectedChapter);
  
        alert("Chapter deleted!");
        setSelectedChapter('');
      } catch (error) {
        console.error('Error deleting chapter:', error);
        alert('Failed to delete chapter. Please try again.');
      } finally {
        // Page will reload after the operation completes, regardless of success or failure
        window.location.reload();
      }
    } else {
      alert('Please select a subject and chapter to delete.');
    }
  };
  

  const deleteChapterFromNeo4j = async (subjectName, chapterName) => {
    const URI = 'neo4j+s://a2952975.databases.neo4j.io';
    const USER = 'neo4j';
    const PASSWORD = 'kL8LezCMVVAP7ZdTpgCbivC3t1HdWD2t3NQ2raMfdb4';
    let driver;

    try {
      driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
      const session = driver.session();

      const query = `
        MATCH (s:Subject {name: $subjectName})-[:HAS_CHAPTER]->(c:Chapter {name: $chapterName})
        OPTIONAL MATCH (c)-[:HAS_CONCEPT]->(concept)
        DETACH DELETE c, concept
      `;

      await session.run(query, { subjectName, chapterName });
      console.log("Chapter and related concepts deleted from Neo4j successfully.");
    } catch (error) {
      console.error("Failed to delete chapter and related concepts from Neo4j:", error);
    } finally {
      await driver.close();
    }
  };

  return (
    <div>
      <h2 className="bg-blue-200 text-black py-2">Delete a Chapter from a Subject</h2>
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

      <button className="btn" onClick={handleDeleteChapter} disabled={!selectedSubject || !selectedChapter}>Delete Chapter</button>
    </div>
  );
};

export default DeleteChapterComponent;
