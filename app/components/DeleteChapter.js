import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const DeleteChapterComponent = () => {
  const [data, setData] = useState({ dropdownData: null });
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  useEffect(() => {
    // Same fetch function as in AddChapterComponent
    const fetchDropdownData = async () => {
        try {
          const docRef = doc(firestore, 'dropData', 'docid');
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            // Extract the string and parse it to JSON
            const jsonString = docSnap.data().string1;
            const parsedData = JSON.parse(jsonString);
            setData(parsedData); // Set the parsed JSON data
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

      const docRef = doc(firestore, 'dropData', 'docid');
      await updateDoc(docRef, { string1: updatedString });

      alert("Chapter deleted!");
      setSelectedChapter('');
    }
  };

  return (
    <div>
    <h2>Delete a Chapter from a Subject</h2>
    <select value={selectedSubject} onChange={handleSubjectChange}>
      <option value="">Select a Subject</option>
      {data.dropdownData?.subjects.map((subject) => (
        <option key={subject.name} value={subject.name}>{subject.name}</option>
      ))}
    </select>

    <select value={selectedChapter} onChange={handleChapterChange} disabled={!selectedSubject}>
      <option value="">Select a Chapter</option>
      {selectedSubject && data.dropdownData?.subjects.find(subj => subj.name === selectedSubject)?.chapters.map((chapter) => (
        <option key={chapter.name} value={chapter.name}>{chapter.name}</option>
      ))}
    </select>

    <button onClick={handleDeleteChapter} disabled={!selectedSubject || !selectedChapter}>Delete Chapter</button>
  </div>
  );
};

export default DeleteChapterComponent;
