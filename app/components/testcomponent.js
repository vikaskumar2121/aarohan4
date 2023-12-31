"use client"
import  { useState , useEffect} from 'react';
import React, { useReducer } from 'react';
import Image from 'next/image'
//import { dropdownData } from './dropdowndata'; 

const initialState = {
    selectedSubject: '',
    selectedChapter: '',
    selectedConcept: ''
  };
  
  
  
    
  
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SELECT_SUBJECT':
        return {
          selectedSubject: action.payload,
          selectedChapter: '',
          selectedConcept: ''
        };
      case 'SELECT_CHAPTER':
        return {
          ...state,
          selectedChapter: action.payload,
          selectedConcept: ''
        };
      case 'SELECT_CONCEPT':
        return {
          ...state,
          selectedConcept: action.payload
        };
      default:
        return state;
    }
  };

  export default function Testcomp({ dropdownData, qtypeDropdown, imageUrls, onJsonUpdate }) {
    const [selectedQImageURL, setSelectedQImageURL] = useState(null);
    const [selectedSImageURL, setSelectedSImageURL] = useState(null);
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        console.log(dropdownData);
      }, []);

      const [formData, setFormData] = useState({
        Qsource: '',
        Qimage: imageUrls?.[0] ?? '', // Set default to first image URL or empty string
        Qtext: '',
        Simage: imageUrls?.[1] ?? '', // Set default to second image URL or empty string
        Stext: '',
        Atext: '',
        Qdifficulty: '5',
        Qrelavance: '',
        Qtype: '',
        Qmagnitude: '1',
    });

  useEffect(() => {
    if (imageUrls && imageUrls.length === 2) {
      setFormData(prevData => ({
        ...prevData,
        Qimage: imageUrls[0], // Assuming first URL is for the question image
        Simage: imageUrls[1]  // Assuming second URL is for the solution image
      }));
    }
  }, [imageUrls]);
  

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  


  const handleSubjectChange = (e) => {
    const selectedSubject = e.target.value;
    console.log(selectedSubject);
    dispatch({ type: 'SELECT_SUBJECT', payload: selectedSubject });
  };

  const handleChapterChange = (e) => {
    const selectedChapter = e.target.value;
    dispatch({ type: 'SELECT_CHAPTER', payload: selectedChapter });
  };

  const handleConceptChange = (e) => {
    const selectedConcept = e.target.value;
    dispatch({ type: 'SELECT_CONCEPT', payload: selectedConcept });
  };


  const { selectedSubject, selectedChapter, selectedConcept } = state;

  // Get the selected subject based on the subject name
  const subject = dropdownData.subjects.find((subj) => subj.name === selectedSubject);

  // Get the selected chapter based on the chapter name
  const chapter = subject ? subject.chapters.find((chap) => chap.name === selectedChapter) : null;


  const handleSubmit = () => {
    // Do something with formData, such as sending it to an API
    console.log(formData);
    onJsonUpdate(formData);
  };

  const resetForm = () => {
    setFormData({
      Qsource: '', 
      Qimage: null,
      Qtext: '', 
      Simage: null,
      Stext: '', 
      Atext: '', 
      Qdifficulty: '5', 
      Qrelavance: '', 
      Qtype: '', 
      Qmagnitude: '1', 
    });
    
    
  dispatch({ type: 'SELECT_SUBJECT', payload: '' });
  dispatch({ type: 'SELECT_CHAPTER', payload: '' });
  dispatch({ type: 'SELECT_CONCEPT', payload: '' });
  };
  
// <> {JSON.stringify(dropdownData)}</> 
if (!dropdownData || !qtypeDropdown) {
  return <div>Loading...</div>; // Or some other loading indicator
}
return (
    <>
    <p>
    "test comp"
      
    </p>
    <div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="Qsource" style={{ flex: 1, marginRight: '10px' }}>
            Question Source:
          </label>
          <input
            type="text"
            id="Qsource"
            style={{ flex: 2, marginLeft: '10px' }}
            value={formData.Qsource}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="Qtext" style={{ flex: 1, marginRight: '10px' }}>
            Question Text:
          </label>
          <input
            type="text"
            id="Qtext"
            style={{ flex: 2, marginLeft: '10px' }}
            value={formData.Qtext}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="Stext" style={{ flex: 1, marginRight: '10px' }}>
            Solution Text:
          </label>
          <input
            type="text"
            id="Stext"
            style={{ flex: 2, marginLeft: '10px' }}
            value={formData.Stext}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="Atext" style={{ flex: 1, marginRight: '10px' }}>
            Answer Text:
          </label>
          <input
            type="text"
            id="Atext"
            style={{ flex: 2, marginLeft: '10px' }}
            value={formData.Atext}
            onChange={handleInputChange}
          />
        </div>
      </div>

        {/* Add the Subject dropdown */}
      <div>
        <label htmlFor="Qsubject">Subject:</label>
        <select id="Qsubject" value={selectedSubject} onChange={handleSubjectChange}>
          <option value="">Select a subject</option>
          {dropdownData.subjects.map((subj) => (
            <option key={subj.name} value={subj.name}>
              {subj.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add the Chapter dropdown */}
      <div>
        <label htmlFor="Qchapter">Chapter:</label>
        <select
          id="Qchapter"
          value={selectedChapter}
          onChange={handleChapterChange}
          disabled={!selectedSubject}
        >
          <option value="">Select a chapter</option>
          {subject &&
            subject.chapters.map((chap) => (
              <option key={chap.name} value={chap.name}>
                {chap.name}
              </option>
            ))}
        </select>
      </div>

      {/* Add the Concept dropdown */}
      <div>
        <label htmlFor="Qconcept">Concept:</label>
        <select
          id="Qconcept"
          value={selectedConcept}
          onChange={handleConceptChange}
          disabled={!selectedChapter}
        >
          <option value="">Select a concept</option>
          {chapter &&
            chapter.concepts.map((concept) => (
              <option key={concept.name} value={concept.name}>
                {concept.name}
              </option>
            ))}
        </select>
      </div>


      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="Qdifficulty" style={{ flex: 1, marginRight: '10px' }}>
            Question Difficulty:
          </label>
          <input
            type="number"
            id="Qdifficulty"
            style={{ flex: 2, marginLeft: '10px' }}
            value={formData.Qdifficulty}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="Qrelavance" style={{ flex: 1, marginRight: '10px' }}>
            Question Realavance:
          </label>
          <input
            type="string"
            id="Qrelavance"
            style={{ flex: 2, marginLeft: '10px' }}
            value={formData.Qrelavance}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
  <label htmlFor="Qtype" style={{ flex: 1, marginRight: '10px' }}>
    Question Type:
  </label>
  <select
    id="Qtype"
    style={{ flex: 2, marginLeft: '10px' }}
    value={formData.Qtype}
    onChange={handleInputChange}
  >
    <option value="">Select a question type</option>
    {Object.entries(qtypeDropdown).map(([type, description]) => (
      <option key={type} value={type}>
        {description}
      </option>
    ))}
  </select>
</div>



      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="Qmagnitude" style={{ flex: 1, marginRight: '10px' }}>
            Question Magnitude:
          </label>
          <input
            type="number"
            id="Qmagnitude"
            style={{ flex: 2, marginLeft: '10px' }}
            value={formData.Qmagnitude}
            onChange={handleInputChange} min="1" max="5"
          />
        </div>
      </div>
      <button onClick={() => {handleSubmit(); resetForm();}}>Submit</button>

    </div>


    </>
)
}