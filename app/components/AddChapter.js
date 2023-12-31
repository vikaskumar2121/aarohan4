import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Adjust this path as needed
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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
  };

  const handleNewChapterNameChange = (e) => {
    setNewChapterName(e.target.value);
  };

  const handleAddChapter = async () => {
    if (selectedSubject && newChapterName) {
      // Update only the subjects array within dropdownData
      const updatedSubjects = data.dropdownData.subjects.map((subject) => {
        if (subject.name === selectedSubject) {
          return { 
            ...subject, 
            chapters: [...subject.chapters, { name: newChapterName, concepts: [] }]
          };
        }
        return subject;
      });

      // Prepare the updated dropdownData
      const updatedDropdownData = { ...data.dropdownData, subjects: updatedSubjects };

      // Convert updatedDropdownData back to a JSON string to be stored in Firestore
      const updatedString = JSON.stringify({ dropdownData: updatedDropdownData, qtypeDropdown: data.qtypeDropdown });

      // Update Firestore
      const docRef = doc(firestore, 'dropData', 'docid');
      await updateDoc(docRef, { string1: updatedString });
      
      alert("Chapter added!");
      setNewChapterName('');
    }
  };

  return (
    <div>
    <h2>Add a Chapter to a Subject</h2>
    <select value={selectedSubject} onChange={handleSubjectChange}>
      <option value="">Select a Subject</option>
      {data.dropdownData?.subjects.map((subject) => (
        <option key={subject.name} value={subject.name}>{subject.name}</option>
      ))}
    </select>
    <input 
      type="text" 
      placeholder="New Chapter Name" 
      value={newChapterName} 
      onChange={handleNewChapterNameChange}
    />
    <button onClick={handleAddChapter} disabled={!selectedSubject || !newChapterName.trim()}>Add Chapter</button>
  </div>
  );
};

export default AddChapterComponent;
