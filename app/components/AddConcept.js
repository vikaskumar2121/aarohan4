import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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
    if (selectedSubject && selectedChapter && newConcept.name) {
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

      // Prepare the updated JSON string
      const updatedString = JSON.stringify({ dropdownData: { ...data.dropdownData, subjects: updatedSubjects }, qtypeDropdown: data.qtypeDropdown });

      // Update Firestore
      const docRef = doc(firestore, 'dropData', 'docid');
      await updateDoc(docRef, { string1: updatedString });

      alert("Concept added!");
      setNewConcept({ name: '', description: '' });
    }
  };

  return (
    <div>
    <h2 class="bg-blue-200 text-black py-2"> Add a Concept to a Chapter</h2>
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
    <button class="btn" onClick={handleAddConcept} disabled={!selectedSubject || !selectedChapter || !newConcept.name || !newConcept.description}>Add Concept</button>
  </div>
  );
};

export default AddConceptComponent;
