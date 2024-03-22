import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import neo4j from 'neo4j-driver';

const EditConceptComponent = () => {
  const [data, setData] = useState({ dropdownData: null });
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('');
  const [conceptDetails, setConceptDetails] = useState({ name: '', description: '' });

  useEffect(() => {
    const fetchDropdownData = async () => {
      const docRef = doc(firestore, 'dropData', 'docid');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const parsedData = JSON.parse(docSnap.data().string1);
        setData(parsedData);
      } else {
        console.log('No such document!');
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    // Find and set the selected concept details for editing
    const subject = data.dropdownData?.subjects.find(subj => subj.name === selectedSubject);
    const chapter = subject?.chapters.find(chap => chap.name === selectedChapter);
    const concept = chapter?.concepts.find(con => con.name === selectedConcept);
    if (concept) {
      setConceptDetails({ name: concept.name, description: concept.description });
    }
  }, [selectedSubject, selectedChapter, selectedConcept, data]);

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

  const handleDetailsChange = (e) => {
    setConceptDetails({ ...conceptDetails, [e.target.name]: e.target.value });
  };

  const updateConceptInFirestore = async () => {
    // Logic to update the concept in Firestore
    const updatedSubjects = data.dropdownData.subjects.map((subject) => {
      if (subject.name === selectedSubject) {
        return {
          ...subject,
          chapters: subject.chapters.map((chapter) => {
            if (chapter.name === selectedChapter) {
              return {
                ...chapter,
                concepts: chapter.concepts.map((concept) => {
                  if (concept.name === selectedConcept) {
                    return { ...concept, ...conceptDetails };
                  }
                  return concept;
                }),
              };
            }
            return chapter;
          }),
        };
      }
      return subject;
    });

    // This matches the structure in handleDeleteConcept, wrapping the subjects array in a dropdownData object
    const updatedData = { dropdownData: { subjects: updatedSubjects } };
    const updatedString = JSON.stringify(updatedData);

    const docRef = doc(firestore, 'dropData', 'docid');
    await updateDoc(docRef, { string1: updatedString });
};


  const updateConceptInNeo4j = async () => {
    // Logic to update the concept in Neo4j
    const driver = neo4j.driver('neo4j+s://a2952975.databases.neo4j.io', neo4j.auth.basic('neo4j', 'kL8LezCMVVAP7ZdTpgCbivC3t1HdWD2t3NQ2raMfdb4'));
    const session = driver.session();
    const query = `
      MATCH (c:Concept {name: $oldName})
      SET c.name = $newName, c.description = $newDescription
    `;
    await session.run(query, {
      oldName: selectedConcept,
      newName: conceptDetails.name,
      newDescription: conceptDetails.description
    });
    console.log("Concept Edited in Neo4j successfully.");
    await session.close();
    driver.close();
  };

  const handleSaveChanges = async () => {
    try {
      await updateConceptInFirestore();
      await updateConceptInNeo4j();
      alert('Concept updated successfully!');
    } catch (error) {
      console.error('Error updating concept:', error);
      alert('Failed to update concept.');
    } finally {
      window.location.reload();
    }
  };

  return (
    <div>
    <h2 className="bg-blue-200 text-black py-2">Edit Concept</h2>
    <select className="select select-bordered select-sm w-full max-w-xs"
        onChange={handleSubjectChange} value={selectedSubject}>
        <option value="">Select a Subject</option>
        {data.dropdownData?.subjects.map((subject) => (
            <option key={subject.name} value={subject.name}>{subject.name}</option>
        ))}
    </select>

    <select className="select select-bordered select-sm w-full max-w-xs" 
        onChange={handleChapterChange} value={selectedChapter}>
        <option value="">Select a Chapter</option>
        {data.dropdownData?.subjects.find(subj => subj.name === selectedSubject)?.chapters.map((chapter) => (
            <option key={chapter.name} value={chapter.name}>{chapter.name}</option>
        ))}
    </select>

    <select className="select select-bordered select-sm w-full max-w-xs" 
        onChange={handleConceptChange} value={selectedConcept}>
        <option value="">Select a Concept</option>
        {data.dropdownData?.subjects.find(subj => subj.name === selectedSubject)?.chapters.find(chap => chap.name === selectedChapter)?.concepts.map((concept) => (
            <option key={concept.name} value={concept.name}>{concept.name}</option>
        ))}
    </select>

    <input className="input input-bordered input-sm w-full max-w-xs"
        type="text"
        placeholder="Concept Name"
        name="name"
        value={conceptDetails.name}
        onChange={handleDetailsChange}
    />

    <textarea className="textarea textarea-bordered h-24 w-full max-w-xs"
        name="description"
        placeholder="Concept Description"
        value={conceptDetails.description}
        onChange={handleDetailsChange}
    ></textarea>

    <button className="btn" onClick={handleSaveChanges}>Save Changes</button>
</div>

  );
};

export default EditConceptComponent;
